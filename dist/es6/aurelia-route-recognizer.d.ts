declare module 'aurelia-route-recognizer/../dist/index' {
  import core from 'core-js';
  export interface RouteHandler {
    name: string;
  }
  export interface ConfigurableRoute {
    path: string;
    handler: RouteHandler;
  }
  export interface HandlerEntry {
    handler: RouteHandler;
    names: string[];
  }
  export interface RecognizedRoute {
    handler: RouteHandler;
    params: Object;
    isDynamic: boolean;
  }
  export interface CharSpec {
    invalidChars: string;
    validChars: string;
    repeat: boolean;
  }
  export class RouteRecognizer {
    constructor();
    add(route: ConfigurableRoute | ConfigurableRoute[]): State;
    handlersFor(name: string): HandlerEntry[];
    hasRoute(name: string): boolean;
    generate(name: string, params: Object): string;
    generateQueryString(params: Object): string;
    parseQueryString(queryString: string): Object;
    recognize(path: string): RecognizedRoute[];
  }
  class RecognizeResults {
    constructor(queryParams: Object);
  }
  export class StaticSegment {
    constructor(string: string);
    eachChar(callback: (spec: CharSpec) => void): any;
    regex(): string;
    generate(params: Object, consumed: Object): string;
  }
  export class DynamicSegment {
    constructor(name: string);
    eachChar(callback: (spec: CharSpec) => void): any;
    regex(): string;
    generate(params: Object, consumed: Object): string;
  }
  export class StarSegment {
    constructor(name: string);
    eachChar(callback: (spec: CharSpec) => void): any;
    regex(): string;
    generate(params: Object, consumed: Object): string;
  }
  export class EpsilonSegment {
    eachChar(callback: (spec: CharSpec) => void): any;
    regex(): string;
    generate(params: Object, consumed: Object): string;
  }
  export class State {
    constructor(charSpec: CharSpec);
    get(charSpec: CharSpec): State;
    put(charSpec: CharSpec): State;
    match(ch: string): State[];
  }
}