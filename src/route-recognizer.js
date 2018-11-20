import {buildQueryString, parseQueryString} from 'aurelia-path';
import {State} from './state';
import {
  StaticSegment,
  DynamicSegment,
  StarSegment,
  EpsilonSegment
} from './segments';

/**
* Class that parses route patterns and matches path strings.
*
* @class RouteRecognizer
* @constructor
*/
export class RouteRecognizer {
  constructor() {
    this.rootState = new State();
    this.names = {};
    this.routes = new Map();
  }

  /**
  * Parse a route pattern and add it to the collection of recognized routes.
  *
  * @param route The route to add.
  */
  add(route: ConfigurableRoute|ConfigurableRoute[]): State {
    if (Array.isArray(route)) {
      route.forEach(r => this.add(r));
      return undefined;
    }

    let currentState = this.rootState;
    let skippableStates = [];
    let regex = '^';
    let types = { statics: 0, dynamics: 0, stars: 0 };
    let names = [];
    let routeName = route.handler.name;
    let isEmpty = true;
    let segments = parse(route.path, names, types, route.caseSensitive);

    for (let i = 0, ii = segments.length; i < ii; i++) {
      let segment = segments[i];
      if (segment instanceof EpsilonSegment) {
        continue;
      }

      // Add a representation of the segment to the NFA and regex
      let [firstState, nextState] = addSegment(currentState, segment);

      // add the first part of the next segment to the end of any skipped states
      for (let j = 0, jj = skippableStates.length; j < jj; j++) {
        skippableStates[j].nextStates.push(firstState);
      }

      // If the segment was optional we don't fast forward to the end of the
      // segment, but we do hold on to a reference to the end of the segment
      // for adding future segments. Multiple consecutive optional segments
      // will accumulate.
      if (segment.optional) {
        skippableStates.push(nextState);
        regex += `(?:/${segment.regex()})?`;

      // Otherwise, we fast forward to the end of the segment and remove any
      // references to skipped segments since we don't need them anymore.
      } else {
        currentState = nextState;
        regex += `/${segment.regex()}`;
        skippableStates.length = 0;
        isEmpty = false;
      }
    }

    // An "all optional" path is technically empty since currentState is this.rootState
    if (isEmpty) {
      currentState = currentState.put({ validChars: '/' });
      regex += '/?';
    }

    let handlers = [{ handler: route.handler, names: names }];

    this.routes.set(route.handler, { segments, handlers });
    if (routeName) {
      let routeNames = Array.isArray(routeName) ? routeName : [routeName];
      for (let i = 0; i < routeNames.length; i++) {
        if (!(routeNames[i] in this.names)) {
          this.names[routeNames[i]] = { segments, handlers };
        }
      }
    }

    // Any trailing skipped states need to be endpoints and need to have
    // handlers attached.
    for (let i = 0; i < skippableStates.length; i++) {
      let state = skippableStates[i];
      state.handlers = handlers;
      state.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
      state.types = types;
    }

    currentState.handlers = handlers;
    currentState.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
    currentState.types = types;

    return currentState;
  }

  /**
  * Retrieve a RouteGenerator for a route by name or RouteConfig (RouteHandler).
  *
  * @param nameOrRoute The name of the route or RouteConfig object.
  * @returns The RouteGenerator for that route.
  */
  getRoute(nameOrRoute: string | RouteHandler): RouteGenerator {
    return typeof(nameOrRoute) === 'string' ? this.names[nameOrRoute] : this.routes.get(nameOrRoute);
  }

  /**
  * Retrieve the handlers registered for the route by name or RouteConfig (RouteHandler).
  *
  * @param nameOrRoute The name of the route or RouteConfig object.
  * @returns The handlers.
  */
  handlersFor(nameOrRoute: string | RouteHandler): HandlerEntry[] {
    let route = this.getRoute(nameOrRoute);
    if (!route) {
      throw new Error(`There is no route named ${nameOrRoute}`);
    }

    return [...route.handlers];
  }

  /**
  * Check if this RouteRecognizer recognizes a route by name or RouteConfig (RouteHandler).
  *
  * @param nameOrRoute The name of the route or RouteConfig object.
  * @returns True if the named route is recognized.
  */
  hasRoute(nameOrRoute: string | RouteHandler): boolean {
    return !!this.getRoute(nameOrRoute);
  }

  /**
  * Generate a path and query string from a route name or RouteConfig (RouteHandler) and params object.
  *
  * @param nameOrRoute The name of the route or RouteConfig object.
  * @param params The route params to use when populating the pattern.
  *  Properties not required by the pattern will be appended to the query string.
  * @returns The generated absolute path and query string.
  */
  generate(nameOrRoute: string | RouteHandler, params: object): string {
    let route = this.getRoute(nameOrRoute);
    if (!route) {
      throw new Error(`There is no route named ${nameOrRoute}`);
    }

    let handler = route.handlers[0].handler;
    if (handler.generationUsesHref) {
      return handler.href;
    }

    let routeParams = Object.assign({}, params);
    let segments = route.segments;
    let consumed = {};
    let output = '';

    for (let i = 0, l = segments.length; i < l; i++) {
      let segment = segments[i];

      if (segment instanceof EpsilonSegment) {
        continue;
      }

      let segmentValue = segment.generate(routeParams, consumed);
      if (segmentValue === null || segmentValue === undefined) {
        if (!segment.optional) {
          throw new Error(`A value is required for route parameter '${segment.name}' in route '${nameOrRoute}'.`);
        }
      } else {
        output += '/';
        output += segmentValue;
      }
    }

    if (output.charAt(0) !== '/') {
      output = '/' + output;
    }

    // remove params used in the path and add the rest to the querystring
    for (let param in consumed) {
      delete routeParams[param];
    }

    let queryString = buildQueryString(routeParams);
    output += queryString ? `?${queryString}` : '';

    return output;
  }

  /**
  * Match a path string against registered route patterns.
  *
  * @param path The path to attempt to match.
  * @returns Array of objects containing `handler`, `params`, and
  *  `isDynanic` values for the matched route(s), or undefined if no match
  *  was found.
  */
  recognize(path: string): RecognizedRoute[] | void {
    let states = [this.rootState];
    let queryParams = {};
    let isSlashDropped = false;
    let normalizedPath = path;

    let queryStart = normalizedPath.indexOf('?');
    if (queryStart !== -1) {
      let queryString = normalizedPath.substr(queryStart + 1, normalizedPath.length);
      normalizedPath = normalizedPath.substr(0, queryStart);
      queryParams = parseQueryString(queryString);
    }

    normalizedPath = decodeURI(normalizedPath);

    if (normalizedPath.charAt(0) !== '/') {
      normalizedPath = '/' + normalizedPath;
    }

    let pathLen = normalizedPath.length;
    if (pathLen > 1 && normalizedPath.charAt(pathLen - 1) === '/') {
      normalizedPath = normalizedPath.substr(0, pathLen - 1);
      isSlashDropped = true;
    }

    for (let i = 0, l = normalizedPath.length; i < l; i++) {
      states = recognizeChar(states, normalizedPath.charAt(i));
      if (!states.length) {
        break;
      }
    }

    let solutions = [];
    for (let i = 0, l = states.length; i < l; i++) {
      if (states[i].handlers) {
        solutions.push(states[i]);
      }
    }

    states = sortSolutions(solutions);

    let state = solutions[0];
    if (state && state.handlers) {
      // if a trailing slash was dropped and a star segment is the last segment
      // specified, put the trailing slash back
      if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
        normalizedPath = normalizedPath + '/';
      }

      return findHandler(state, normalizedPath, queryParams);
    }
  }
}

class RecognizeResults {
  constructor(queryParams: Object) {
    this.splice = Array.prototype.splice;
    this.slice = Array.prototype.slice;
    this.push = Array.prototype.push;
    this.length = 0;
    this.queryParams = queryParams || {};
  }
}

function parse(route, names, types, caseSensitive) {
  // normalize route as not starting with a '/'. Recognition will
  // also normalize.
  let normalizedRoute = route;
  if (route.charAt(0) === '/') {
    normalizedRoute = route.substr(1);
  }

  let results = [];

  let splitRoute = normalizedRoute.split('/');
  for (let i = 0, ii = splitRoute.length; i < ii; ++i) {
    let segment = splitRoute[i];

    // Try to parse a parameter :param?
    let match = segment.match(/^:([^?]+)(\?)?$/);
    if (match) {
      let [, name, optional] = match;
      if (name.indexOf('=') !== -1) {
        throw new Error(`Parameter ${name} in route ${route} has a default value, which is not supported.`);
      }
      results.push(new DynamicSegment(name, !!optional));
      names.push(name);
      types.dynamics++;
      continue;
    }

    // Try to parse a star segment *whatever
    match = segment.match(/^\*(.+)$/);
    if (match) {
      results.push(new StarSegment(match[1]));
      names.push(match[1]);
      types.stars++;
    } else if (segment === '') {
      results.push(new EpsilonSegment());
    } else {
      results.push(new StaticSegment(segment, caseSensitive));
      types.statics++;
    }
  }

  return results;
}

// This is a somewhat naive strategy, but should work in a lot of cases
// A better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
//
// This strategy generally prefers more static and less dynamic matching.
// Specifically, it
//
//  * prefers fewer stars to more, then
//  * prefers using stars for less of the match to more, then
//  * prefers fewer dynamic segments to more, then
//  * prefers more static segments to more
function sortSolutions(states) {
  return states.sort((a, b) => {
    if (a.types.stars !== b.types.stars) {
      return a.types.stars - b.types.stars;
    }

    if (a.types.stars) {
      if (a.types.statics !== b.types.statics) {
        return b.types.statics - a.types.statics;
      }
      if (a.types.dynamics !== b.types.dynamics) {
        return b.types.dynamics - a.types.dynamics;
      }
    }

    if (a.types.dynamics !== b.types.dynamics) {
      return a.types.dynamics - b.types.dynamics;
    }

    if (a.types.statics !== b.types.statics) {
      return b.types.statics - a.types.statics;
    }

    return 0;
  });
}

function recognizeChar(states, ch) {
  let nextStates = [];

  for (let i = 0, l = states.length; i < l; i++) {
    let state = states[i];
    nextStates.push(...state.match(ch));
  }

  return nextStates;
}

function findHandler(state, path, queryParams) {
  let handlers = state.handlers;
  let regex = state.regex;
  let captures = path.match(regex);
  let currentCapture = 1;
  let result = new RecognizeResults(queryParams);

  for (let i = 0, l = handlers.length; i < l; i++) {
    let handler = handlers[i];
    let names = handler.names;
    let params = {};

    for (let j = 0, m = names.length; j < m; j++) {
      params[names[j]] = captures[currentCapture++];
    }

    result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
  }

  return result;
}

function addSegment(currentState, segment) {
  let firstState = currentState.put({ validChars: '/' });
  let nextState = firstState;
  segment.eachChar(ch => {
    nextState = nextState.put(ch);
  });

  return [firstState, nextState];
}
