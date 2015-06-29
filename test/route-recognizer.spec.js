import { RouteRecognizer } from '../src/route-recognizer';
import core from 'core-js';

const staticRoute = {'path': 'static','handler': {'name': 'static'}};
const dynamicRoute = {'path': 'dynamic/:id','handler': {'name': 'dynamic'}};

const routeTestData = [{
    title: 'empty path routes',
    route: {'path': '','handler': {'name': 'static'}},
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
    route: { 'path': 'dynamic/:id/:other','handler': { 'name': 'dynamic' }},
    isDynamic: true,
    path: '/dynamic/foo/bar',
    params: { id: 'foo', other: 'bar' }
  }, {
    title: 'duplicate dynamic routes',
    route: { 'path': 'dynamic/:id/:id','handler': { 'name': 'dynamic' }},
    isDynamic: true,
    path: '/dynamic/foo/foo',
    params: { id: 'foo' }
  }, {
    title: 'star routes',
    route: { 'path': 'star/*path','handler': { 'name': 'star' }},
    isDynamic: true,
    path: '/star/test/path',
    params: { path: 'test/path' }
  }, {
    title: 'dynamic star routes',
    route: { 'path': 'dynamic/:id/star/*path','handler': { 'name': 'star' }},
    isDynamic: true,
    path: '/dynamic/foo/star/test/path',
    params: { id: 'foo', path: 'test/path' }
  }];

describe('route recognizer', () => {
  it('should reject unknown routes', () => {
    let recognizer = new RouteRecognizer();

    expect(recognizer.hasRoute('static')).toBe(false);
    expect(() => recognizer.handlersFor('static')).toThrow();
    expect(() => recognizer.generate('static')).toThrow();
    expect(recognizer.recognize('/notfound')).toBeUndefined();
  });

  it('should register unnamed routes', () => {
    let recognizer = new RouteRecognizer();
    recognizer.add([{'path': 'b','handler': {}}]);

    expect(recognizer.names).toEqual({});
    expect(recognizer.recognize('/b')).toBeTruthy();
  });

  for (let routeTest of routeTestData) {
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

  it('should generate query strings', () => {
    let recognizer = new RouteRecognizer();
    let gen = recognizer.generateQueryString.bind(recognizer);

    expect(gen()).toBe('');
    expect(gen(null)).toBe('');
    expect(gen({})).toBe('');
    expect(gen({ a: null })).toBe('');

    expect(gen({ '': 'a' })).toBe('?=a');
    expect(gen({ a: 'b' })).toBe('?a=b');
    expect(gen({ a: 'b', c: 'd' })).toBe('?a=b&c=d');
    expect(gen({ a: 'b', c: null })).toBe('?a=b');

    expect(gen({ a: [ 'b', 'c' ]})).toBe('?a[]=b&a[]=c');
    expect(gen({ '&': [ 'b', 'c' ]})).toBe('?%26[]=b&%26[]=c');

    expect(gen({ a: '&' })).toBe('?a=%26');
    expect(gen({ '&': 'a' })).toBe('?%26=a');
    expect(gen({ a: true })).toBe('?a=true');
    expect(gen({ '$test': true })).toBe('?$test=true');
  });

  it('should parse query strings', () => {
    let recognizer = new RouteRecognizer();
    let parse = recognizer.parseQueryString.bind(recognizer);

    expect(parse('')).toEqual({});
    expect(parse('=')).toEqual({});
    expect(parse('&')).toEqual({});
    expect(parse('?')).toEqual({});

    expect(parse('a')).toEqual({ a: true });
    expect(parse('a&b')).toEqual({ a: true, b: true });
    expect(parse('a=')).toEqual({ a: '' });
    expect(parse('a=&b=')).toEqual({ a: '', b: '' });

    expect(parse('a=b')).toEqual({ a: 'b' });
    expect(parse('a=b&c=d')).toEqual({ a: 'b', c: 'd' });
    expect(parse('a=b&&c=d')).toEqual({ a: 'b', c: 'd' });
    expect(parse('a=b&a=c')).toEqual({ a: 'c' });

    expect(parse('a=%26')).toEqual({ a: '&' });
    expect(parse('%26=a')).toEqual({ '&': 'a' });
    expect(parse('%26[]=b&%26[]=c')).toEqual({ '&': [ 'b', 'c' ]});
  });
});
