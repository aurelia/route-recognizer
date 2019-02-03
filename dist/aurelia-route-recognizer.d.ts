import {
  buildQueryString,
  parseQueryString
} from 'aurelia-path';

/*
* An object that is indexed and used for route generation, particularly for dynamic routes.
*/
export declare interface RouteGenerator {
  segments: Array<StaticSegment | DynamicSegment | StarSegment | EpsilonSegment>;
  handlers: HandlerEntry[];
}
export declare interface RouteHandler {
  name: string;
}
export declare interface ConfigurableRoute {
  path: string;
  handler: RouteHandler;
  caseSensitive: boolean;
}
export declare interface HandlerEntry {
  handler: RouteHandler;
  names: string[];
}
export declare interface RecognizedRoute {
  handler: RouteHandler;
  params: Object;
  isDynamic: boolean;
}
export declare interface CharSpec {
  invalidChars?: string;
  validChars?: string;
  repeat?: boolean;
}

// A State has a character specification and (`charSpec`) and a list of possible
// subsequent states (`nextStates`).
//
// If a State is an accepting state, it will also have several additional
// properties:
//
// * `regex`: A regular expression that is used to extract parameters from paths
//   that reached this accepting state.
// * `handlers`: Information on how to convert the list of captures into calls
//   to registered handlers with the specified parameters.
// * `types`: How many static, dynamic, or star segments in this route. Used to
//   decide which route to use if multiple registered routes match a path.
//
// Currently, State is implemented naively by looping over `nextStates` and
// comparing a character specification against a character. A more efficient
// implementation would use a hash of keys pointing at one or more next states.
export declare class State {
  constructor(charSpec: CharSpec);
  get(charSpec: CharSpec): State;
  put(charSpec: CharSpec): State;
  
  // Find a list of child states matching the next character
  match(ch: string): State[];
}

// A Segment represents a segment in the original route description.
// Each Segment type provides an `eachChar` and `regex` method.
//
// The `eachChar` method invokes the callback with one or more character
// specifications. A character specification consumes one or more input
// characters.
//
// The `regex` method returns a regex fragment for the segment. If the
// segment is a dynamic or star segment, the regex fragment also includes
// a capture.
//
// A character specification contains:
//
// * `validChars`: a String with a list of all valid characters, or
// * `invalidChars`: a String with a list of all invalid characters
// * `repeat`: true if the character specification can repeat
export declare class StaticSegment {
  constructor(string: string, caseSensitive: boolean);
  eachChar(callback: ((spec: CharSpec) => void)): void;
  regex(): string;
  generate(): string;
}
export declare class DynamicSegment {
  constructor(name: string, optional: boolean);
  eachChar(callback: ((spec: CharSpec) => void)): void;
  regex(): string;
  generate(params: Object, consumed: Object): string;
}
export declare class StarSegment {
  constructor(name: string);
  eachChar(callback: ((spec: CharSpec) => void)): void;
  regex(): string;
  generate(params: Object, consumed: Object): string;
}
export declare class EpsilonSegment {
  eachChar(): void;
  regex(): string;
  generate(): string;
}

/**
* Class that parses route patterns and matches path strings.
*
* @class RouteRecognizer
* @constructor
*/
/**
* Class that parses route patterns and matches path strings.
*
* @class RouteRecognizer
* @constructor
*/
export declare class RouteRecognizer {
  constructor();
  
  /**
    * Parse a route pattern and add it to the collection of recognized routes.
    *
    * @param route The route to add.
    */
  add(route: ConfigurableRoute | ConfigurableRoute[]): State;
  
  /**
    * Retrieve a RouteGenerator for a route by name or RouteConfig (RouteHandler).
    *
    * @param nameOrRoute The name of the route or RouteConfig object.
    * @returns The RouteGenerator for that route.
    */
  getRoute(nameOrRoute: string | RouteHandler): RouteGenerator;
  
  /**
    * Retrieve the handlers registered for the route by name or RouteConfig (RouteHandler).
    *
    * @param nameOrRoute The name of the route or RouteConfig object.
    * @returns The handlers.
    */
  handlersFor(nameOrRoute: string | RouteHandler): HandlerEntry[];
  
  /**
    * Check if this RouteRecognizer recognizes a route by name or RouteConfig (RouteHandler).
    *
    * @param nameOrRoute The name of the route or RouteConfig object.
    * @returns True if the named route is recognized.
    */
  hasRoute(nameOrRoute: string | RouteHandler): boolean;
  
  /**
    * Generate a path and query string from a route name or RouteConfig (RouteHandler) and params object.
    *
    * @param nameOrRoute The name of the route or RouteConfig object.
    * @param params The route params to use when populating the pattern.
    *  Properties not required by the pattern will be appended to the query string.
    * @returns The generated absolute path and query string.
    */
  generate(nameOrRoute: string | RouteHandler, params: object): string;
  
  /**
    * Match a path string against registered route patterns.
    *
    * @param path The path to attempt to match.
    * @returns Array of objects containing `handler`, `params`, and
    *  `isDynanic` values for the matched route(s), or undefined if no match
    *  was found.
    */
  recognize(path: string): RecognizedRoute[] | void;
}