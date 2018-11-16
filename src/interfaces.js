import { StaticSegment, DynamicSegment, StarSegment, EpsilonSegment } from './segments';

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

type Segment = StaticSegment | DynamicSegment | StarSegment | EpsilonSegment;
/**
 * An object that is indexed and used for route generation, particularly for dynamic routes.
 */
interface RouteGenerator {
  segments: Segment[];
  handlers: HandlerEntry[];
}
