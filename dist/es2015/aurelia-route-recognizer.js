import { buildQueryString, parseQueryString } from 'aurelia-path';

export let State = class State {
  constructor(charSpec) {
    this.charSpec = charSpec;
    this.nextStates = [];
  }

  get(charSpec) {
    for (let child of this.nextStates) {
      let isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;

      if (isEqual) {
        return child;
      }
    }

    return undefined;
  }

  put(charSpec) {
    let state = this.get(charSpec);

    if (state) {
      return state;
    }

    state = new State(charSpec);

    this.nextStates.push(state);

    if (charSpec.repeat) {
      state.nextStates.push(state);
    }

    return state;
  }

  match(ch) {
    let nextStates = this.nextStates;
    let results = [];

    for (let i = 0, l = nextStates.length; i < l; i++) {
      let child = nextStates[i];
      let charSpec = child.charSpec;

      if (charSpec.validChars !== undefined) {
        if (charSpec.validChars.indexOf(ch) !== -1) {
          results.push(child);
        }
      } else if (charSpec.invalidChars !== undefined) {
        if (charSpec.invalidChars.indexOf(ch) === -1) {
          results.push(child);
        }
      }
    }

    return results;
  }
};

const specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

const escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

export let StaticSegment = class StaticSegment {
  constructor(string, caseSensitive) {
    this.string = string;
    this.caseSensitive = caseSensitive;
  }

  eachChar(callback) {
    let s = this.string;
    for (let i = 0, ii = s.length; i < ii; ++i) {
      let ch = s[i];
      callback({ validChars: this.caseSensitive ? ch : ch.toUpperCase() + ch.toLowerCase() });
    }
  }

  regex() {
    return this.string.replace(escapeRegex, '\\$1');
  }

  generate() {
    return this.string;
  }
};

export let DynamicSegment = class DynamicSegment {
  constructor(name, optional) {
    this.name = name;
    this.optional = optional;
  }

  eachChar(callback) {
    callback({ invalidChars: '/', repeat: true });
  }

  regex() {
    return '([^/]+)';
  }

  generate(params, consumed) {
    consumed[this.name] = true;
    return params[this.name];
  }
};

export let StarSegment = class StarSegment {
  constructor(name) {
    this.name = name;
  }

  eachChar(callback) {
    callback({ invalidChars: '', repeat: true });
  }

  regex() {
    return '(.+)';
  }

  generate(params, consumed) {
    consumed[this.name] = true;
    return params[this.name];
  }
};

export let EpsilonSegment = class EpsilonSegment {
  eachChar() {}

  regex() {
    return '';
  }

  generate() {
    return '';
  }
};

export let RouteRecognizer = class RouteRecognizer {
  constructor() {
    this.rootState = new State();
    this.names = {};
    this.routes = new Map();
  }

  add(route) {
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

      let [firstState, nextState] = addSegment(currentState, segment);

      for (let j = 0, jj = skippableStates.length; j < jj; j++) {
        skippableStates[j].nextStates.push(firstState);
      }

      if (segment.optional) {
        skippableStates.push(nextState);
        regex += `(?:/${segment.regex()})?`;
      } else {
        currentState = nextState;
        regex += `/${segment.regex()}`;
        skippableStates.length = 0;
        isEmpty = false;
      }
    }

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

  getRoute(nameOrRoute) {
    return typeof nameOrRoute === 'string' ? this.names[nameOrRoute] : this.routes.get(nameOrRoute);
  }

  handlersFor(nameOrRoute) {
    let route = this.getRoute(nameOrRoute);
    if (!route) {
      throw new Error(`There is no route named ${nameOrRoute}`);
    }

    return [...route.handlers];
  }

  hasRoute(nameOrRoute) {
    return !!this.getRoute(nameOrRoute);
  }

  generate(nameOrRoute, params) {
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

    for (let param in consumed) {
      delete routeParams[param];
    }

    let queryString = buildQueryString(routeParams);
    output += queryString ? `?${queryString}` : '';

    return output;
  }

  recognize(path) {
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
      if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
        normalizedPath = normalizedPath + '/';
      }

      return findHandler(state, normalizedPath, queryParams);
    }
  }
};

let RecognizeResults = class RecognizeResults {
  constructor(queryParams) {
    this.splice = Array.prototype.splice;
    this.slice = Array.prototype.slice;
    this.push = Array.prototype.push;
    this.length = 0;
    this.queryParams = queryParams || {};
  }
};


function parse(route, names, types, caseSensitive) {
  let normalizedRoute = route;
  if (route.charAt(0) === '/') {
    normalizedRoute = route.substr(1);
  }

  let results = [];

  let splitRoute = normalizedRoute.split('/');
  for (let i = 0, ii = splitRoute.length; i < ii; ++i) {
    let segment = splitRoute[i];

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