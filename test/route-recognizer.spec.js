import { RouteRecognizer } from '../src/route-recognizer';
import core from 'core-js';

const staticRoute = {'path': 'static', 'handler': {'name': 'static'}};
const dynamicRoute = {'path': 'dynamic/:id', 'handler': {'name': 'dynamic'}};
const optionalRoute = {'path': 'optional/:id?', 'handler': {'name': 'optional'}};
const multiNameRoute = {'path': 'static', 'handler': {'name': ['static-multiple', 'static-multiple-alias']}};

const routeTestData = [{
  title: 'empty path routes',
  route: {'path': '', 'handler': {'name': 'static'}},
  isDynamic: false,
  path: '/',
  params: {}
}, {
  title: 'static routes',
  route: staticRoute,
  isDynamic: false,
  path: '/static',
  params: {}
}, {
  title: 'dynamic routes',
  route: dynamicRoute,
  isDynamic: true,
  path: '/dynamic/test',
  params: { id: 'test' }
}, {
  title: 'multi-segment dynamic routes',
  route: { 'path': 'dynamic/:id/:other', 'handler': { 'name': 'dynamic' }},
  isDynamic: true,
  path: '/dynamic/foo/bar',
  params: { id: 'foo', other: 'bar' }
}, {
  title: 'duplicate dynamic routes',
  route: { 'path': 'dynamic/:id/:id', 'handler': { 'name': 'dynamic' }},
  isDynamic: true,
  path: '/dynamic/foo/foo',
  params: { id: 'foo' }
}, {
  title: 'star routes',
  route: { 'path': 'star/*path', 'handler': { 'name': 'star' }},
  isDynamic: true,
  path: '/star/test/path',
  params: { path: 'test/path' }
}, {
  title: 'dynamic star routes',
  route: { 'path': 'dynamic/:id/star/*path', 'handler': { 'name': 'star' }},
  isDynamic: true,
  path: '/dynamic/foo/star/test/path',
  params: { id: 'foo', path: 'test/path' }
}, {
  title: 'optional parameter routes',
  route: { 'path': 'param/:id?/edit', 'handler': { 'name': 'dynamic' }},
  isDynamic: true,
  path: '/param/42/edit',
  params: { id: '42' }
}, {
  title: 'missing optional parameter routes',
  route: { 'path': 'param/:id?/edit', 'handler': { 'name': 'dynamic' }},
  isDynamic: true,
  path: '/param/edit',
  params: { id: undefined }
}, {
  title: 'multiple optional parameters routes',
  route: { 'path': 'param/:x?/edit/:y?', 'handler': { 'name': 'dynamic' }},
  isDynamic: true,
  path: '/param/edit/42',
  params: { x: undefined, y: '42' }
}, {
  title: 'ambiguous optional parameters routes',
  route: { 'path': 'pt/:x?/:y?', 'handler': { 'name': 'dynamic' }},
  isDynamic: true,
  path: '/pt/7',
  params: { x: '7', y: undefined }
}, {
  title: 'empty optional parameters routes',
  route: { 'path': ':x?/:y?', 'handler': { 'name': 'dynamic' }},
  isDynamic: true,
  path: '/',
  params: { x: undefined, y: undefined }
}, {
  title: 'almost empty optional parameter routes',
  route: { 'path': ':x?', 'handler': { 'name': 'dynamic' }},
  isDynamic: true,
  path: '/42',
  params: { x: '42' }
}];

describe('route recognizer', () => {
  it('should reject unknown routes', () => {
    let recognizer = new RouteRecognizer();

    expect(recognizer.hasRoute('static')).toBe(false);
    expect(() => recognizer.handlersFor('static')).toThrow();
    expect(() => recognizer.generate('static')).toThrow();
    expect(recognizer.recognize('/notfound')).toBeUndefined();
  });

  it('should reject default parameter values', () => {
    let recognizer = new RouteRecognizer();

    expect(() => recognizer.add([{'path': 'user/:id=1', 'handler': {}}])).toThrow();
  });

  it('should register unnamed routes', () => {
    let recognizer = new RouteRecognizer();
    recognizer.add([{'path': 'b', 'handler': {}}]);

    expect(recognizer.names).toEqual({});
    expect(recognizer.recognize('/b')).toBeTruthy();
  });

  for (let i = routeTestData.length - 1; i >= 0; i--) {
    let routeTest = routeTestData[i];

    it(`should recognize ${routeTest.title}`, () => {
      let recognizer = new RouteRecognizer();
      recognizer.add([routeTest.route]);

      let result = recognizer.recognize(routeTest.path);
      expect(result).toBeTruthy();
      expect(result.length).toBe(1);
      expect(result[0].handler).toEqual(routeTest.route.handler);
      expect(result[0].isDynamic).toBe(routeTest.isDynamic);
      expect(result[0].params).toEqual(routeTest.params);
    });

    it(`its case insensitive by default ${routeTest.title}`, () => {
      let recognizer = new RouteRecognizer();
      recognizer.add([routeTest.route]);

      let result = recognizer.recognize(routeTest.path.toUpperCase());
      expect(result).toBeTruthy();
      expect(result.length).toBe(1);
      expect(result[0].handler).toEqual(routeTest.route.handler);
      expect(result[0].isDynamic).toBe(routeTest.isDynamic);
      Object.keys(result[0].params).forEach((property) => {
        if (routeTest.params[property] === undefined) {
          return;
        }
        expect(result[0].params[property].toUpperCase()).toEqual(routeTest.params[property].toUpperCase());
      });
    });

    it(`should generate ${routeTest.title}`, () => {
      let recognizer = new RouteRecognizer();
      recognizer.add([routeTest.route]);

      expect(recognizer.generate(routeTest.route.handler.name, routeTest.params))
        .toBe(routeTest.path);
    });
  }

  it('should require dynamic segment parameters when generating', () => {
    let recognizer = new RouteRecognizer();
    recognizer.add([dynamicRoute]);

    expect(() => recognizer.generate('dynamic')).toThrow();
    expect(() => recognizer.generate('dynamic', {})).toThrow();
    expect(() => recognizer.generate('dynamic', { id: null })).toThrow();
  });

  it('should generate URIs with extra parameters added to the query string', () => {
    let recognizer = new RouteRecognizer();
    recognizer.add([staticRoute]);
    recognizer.add([dynamicRoute]);

    expect(recognizer.generate('static')).toBe('/static');
    expect(recognizer.generate('static', {})).toBe('/static');
    expect(recognizer.generate('static', { id: 1 })).toBe('/static?id=1');

    expect(recognizer.generate('dynamic', { id: 1 })).toBe('/dynamic/1');
    expect(recognizer.generate('dynamic', { id: 1, test: 2 })).toBe('/dynamic/1?test=2');
  });

  it('should find handlers by route name', () => {
    let recognizer = new RouteRecognizer();
    recognizer.add([staticRoute]);

    expect(recognizer.hasRoute('static')).toBe(true);
    expect(recognizer.handlersFor('static')[0].handler).toEqual(staticRoute.handler);
  });

  it('should find a handler by multiple names', () => {
    let recognizer = new RouteRecognizer();
    recognizer.add([multiNameRoute]);

    expect(recognizer.handlersFor('static-multiple')[0].handler)
      .toEqual(recognizer.handlersFor('static-multiple-alias')[0].handler);
  });

  it('should distinguish between dynamic and static parts', () => {
    let recognizer = new RouteRecognizer();
    let similarRoute = { 'path': 'optionalToo/:id?', 'handler': { 'name': 'similar' }};
    recognizer.add([optionalRoute, similarRoute]);

    let result = recognizer.recognize('optionalToo');
    expect(result.length).toEqual(1);
    expect(result[0].handler.name).toEqual('similar');
  });

  it('can set case sensitive route and fails', () => {
    let recognizer = new RouteRecognizer();
    const routeTest = {
      title: 'case sensitive route',
      route: { 'path': 'CasE/InSeNsItIvE', 'handler': { 'name': 'static' }, 'caseSensitive': true },
      isDynamic: false,
      path: 'CasE/iNsEnSiTiVe',
      params: {}
    };
    recognizer.add([routeTest.route]);

    let result = recognizer.recognize(routeTest.path);
    expect(result).toBeUndefined();
  });
});
