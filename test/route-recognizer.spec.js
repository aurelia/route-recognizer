import { RouteRecognizer } from '../src/index';

const staticRoute = {'path': 'static','handler': {'name': 'static'}};

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
    route: {'path': 'dynamic/:id','handler': {'name': 'dynamic'}},
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
