interface RouteHandler {
  name: string;
}

interface ConfigurableRoute {
  path: string;
  handler: RouteHandler;
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
