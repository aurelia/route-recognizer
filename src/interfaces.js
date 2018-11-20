import { StaticSegment, DynamicSegment, StarSegment, EpsilonSegment } from './segments';

/*
* An object that is indexed and used for route generation, particularly for dynamic routes.
*/
interface RouteGenerator {
  segments: Array<StaticSegment | DynamicSegment | StarSegment | EpsilonSegment>;
  handlers: HandlerEntry[];
}

interface RouteHandler {
  name: string;
}

interface ConfigurableRoute {
  path: string;
  handler: RouteHandler;
  caseSensitive: boolean;
}

interface HandlerEntry {
  handler: RouteHandler;
  names: string[];
}

interface RecognizedRoute {
  handler: RouteHandler;
  params: Object;
  isDynamic: boolean;
}

interface CharSpec {
  invalidChars?: string;
  validChars?: string;
  repeat?: boolean;
}
