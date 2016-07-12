'use strict';

System.register(['aurelia-path'], function (_export, _context) {
  "use strict";

  var buildQueryString, parseQueryString, State, specials, escapeRegex, StaticSegment, DynamicSegment, StarSegment, EpsilonSegment, RouteRecognizer, RecognizeResults;

  

  function parse(route, names, types, caseSensitive) {
    var normalizedRoute = route;
    if (route.charAt(0) === '/') {
      normalizedRoute = route.substr(1);
    }

    var results = [];

    var splitRoute = normalizedRoute.split('/');
    for (var i = 0, ii = splitRoute.length; i < ii; ++i) {
      var segment = splitRoute[i];
      var match = segment.match(/^:([^\/]+)$/);
      if (match) {
        results.push(new DynamicSegment(match[1]));
        names.push(match[1]);
        types.dynamics++;
        continue;
      }

      match = segment.match(/^\*([^\/]+)$/);
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
    return states.sort(function (a, b) {
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
    var nextStates = [];

    for (var i = 0, l = states.length; i < l; i++) {
      var state = states[i];
      nextStates.push.apply(nextStates, state.match(ch));
    }

    return nextStates;
  }

  function findHandler(state, path, queryParams) {
    var handlers = state.handlers;
    var regex = state.regex;
    var captures = path.match(regex);
    var currentCapture = 1;
    var result = new RecognizeResults(queryParams);

    for (var i = 0, l = handlers.length; i < l; i++) {
      var _handler = handlers[i];
      var _names = _handler.names;
      var _params = {};

      for (var j = 0, m = _names.length; j < m; j++) {
        _params[_names[j]] = captures[currentCapture++];
      }

      result.push({ handler: _handler.handler, params: _params, isDynamic: !!_names.length });
    }

    return result;
  }

  function addSegment(currentState, segment) {
    var state = currentState;
    segment.eachChar(function (ch) {
      state = state.put(ch);
    });

    return state;
  }
  return {
    setters: [function (_aureliaPath) {
      buildQueryString = _aureliaPath.buildQueryString;
      parseQueryString = _aureliaPath.parseQueryString;
    }],
    execute: function () {
      _export('State', State = function () {
        function State(charSpec) {
          

          this.charSpec = charSpec;
          this.nextStates = [];
        }

        State.prototype.get = function get(charSpec) {
          for (var _iterator = this.nextStates, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref = _i.value;
            }

            var child = _ref;

            var isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;

            if (isEqual) {
              return child;
            }
          }

          return undefined;
        };

        State.prototype.put = function put(charSpec) {
          var state = this.get(charSpec);

          if (state) {
            return state;
          }

          state = new State(charSpec);

          this.nextStates.push(state);

          if (charSpec.repeat) {
            state.nextStates.push(state);
          }

          return state;
        };

        State.prototype.match = function match(ch) {
          var nextStates = this.nextStates;
          var results = [];

          for (var i = 0, l = nextStates.length; i < l; i++) {
            var child = nextStates[i];
            var charSpec = child.charSpec;

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
        };

        return State;
      }());

      _export('State', State);

      specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
      escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

      _export('StaticSegment', StaticSegment = function () {
        function StaticSegment(string, caseSensitive) {
          

          this.string = string;
          this.caseSensitive = caseSensitive;
        }

        StaticSegment.prototype.eachChar = function eachChar(callback) {
          var s = this.string;
          for (var i = 0, ii = s.length; i < ii; ++i) {
            var ch = s[i];
            callback({ validChars: this.caseSensitive ? ch : ch.toUpperCase() + ch.toLowerCase() });
          }
        };

        StaticSegment.prototype.regex = function regex() {
          return this.string.replace(escapeRegex, '\\$1');
        };

        StaticSegment.prototype.generate = function generate() {
          return this.string;
        };

        return StaticSegment;
      }());

      _export('StaticSegment', StaticSegment);

      _export('DynamicSegment', DynamicSegment = function () {
        function DynamicSegment(name) {
          

          this.name = name;
        }

        DynamicSegment.prototype.eachChar = function eachChar(callback) {
          callback({ invalidChars: '/', repeat: true });
        };

        DynamicSegment.prototype.regex = function regex() {
          return '([^/]+)';
        };

        DynamicSegment.prototype.generate = function generate(params, consumed) {
          consumed[this.name] = true;
          return params[this.name];
        };

        return DynamicSegment;
      }());

      _export('DynamicSegment', DynamicSegment);

      _export('StarSegment', StarSegment = function () {
        function StarSegment(name) {
          

          this.name = name;
        }

        StarSegment.prototype.eachChar = function eachChar(callback) {
          callback({ invalidChars: '', repeat: true });
        };

        StarSegment.prototype.regex = function regex() {
          return '(.+)';
        };

        StarSegment.prototype.generate = function generate(params, consumed) {
          consumed[this.name] = true;
          return params[this.name];
        };

        return StarSegment;
      }());

      _export('StarSegment', StarSegment);

      _export('EpsilonSegment', EpsilonSegment = function () {
        function EpsilonSegment() {
          
        }

        EpsilonSegment.prototype.eachChar = function eachChar() {};

        EpsilonSegment.prototype.regex = function regex() {
          return '';
        };

        EpsilonSegment.prototype.generate = function generate() {
          return '';
        };

        return EpsilonSegment;
      }());

      _export('EpsilonSegment', EpsilonSegment);

      _export('RouteRecognizer', RouteRecognizer = function () {
        function RouteRecognizer() {
          

          this.rootState = new State();
          this.names = {};
        }

        RouteRecognizer.prototype.add = function add(route) {
          var _this = this;

          if (Array.isArray(route)) {
            route.forEach(function (r) {
              return _this.add(r);
            });
            return undefined;
          }

          var currentState = this.rootState;
          var regex = '^';
          var types = { statics: 0, dynamics: 0, stars: 0 };
          var names = [];
          var routeName = route.handler.name;
          var isEmpty = true;
          var segments = parse(route.path, names, types, route.caseSensitive);

          for (var i = 0, ii = segments.length; i < ii; i++) {
            var segment = segments[i];
            if (segment instanceof EpsilonSegment) {
              continue;
            }

            isEmpty = false;

            currentState = currentState.put({ validChars: '/' });
            regex += '/';

            currentState = addSegment(currentState, segment);
            regex += segment.regex();
          }

          if (isEmpty) {
            currentState = currentState.put({ validChars: '/' });
            regex += '/';
          }

          var handlers = [{ handler: route.handler, names: names }];

          if (routeName) {
            var routeNames = Array.isArray(routeName) ? routeName : [routeName];
            for (var _i2 = 0; _i2 < routeNames.length; _i2++) {
              this.names[routeNames[_i2]] = {
                segments: segments,
                handlers: handlers
              };
            }
          }

          currentState.handlers = handlers;
          currentState.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
          currentState.types = types;

          return currentState;
        };

        RouteRecognizer.prototype.handlersFor = function handlersFor(name) {
          var route = this.names[name];
          if (!route) {
            throw new Error('There is no route named ' + name);
          }

          return [].concat(route.handlers);
        };

        RouteRecognizer.prototype.hasRoute = function hasRoute(name) {
          return !!this.names[name];
        };

        RouteRecognizer.prototype.generate = function generate(name, params) {
          var route = this.names[name];
          if (!route) {
            throw new Error('There is no route named ' + name);
          }

          var handler = route.handlers[0].handler;
          if (handler.href) {
            return handler.href;
          }

          var routeParams = Object.assign({}, params);
          var segments = route.segments;
          var consumed = {};
          var output = '';

          for (var i = 0, l = segments.length; i < l; i++) {
            var segment = segments[i];

            if (segment instanceof EpsilonSegment) {
              continue;
            }

            output += '/';
            var segmentValue = segment.generate(routeParams, consumed);
            if (segmentValue === null || segmentValue === undefined) {
              throw new Error('A value is required for route parameter \'' + segment.name + '\' in route \'' + name + '\'.');
            }

            output += segmentValue;
          }

          if (output.charAt(0) !== '/') {
            output = '/' + output;
          }

          for (var param in consumed) {
            delete routeParams[param];
          }

          var queryString = buildQueryString(routeParams);
          output += queryString ? '?' + queryString : '';

          return output;
        };

        RouteRecognizer.prototype.recognize = function recognize(path) {
          var states = [this.rootState];
          var queryParams = {};
          var isSlashDropped = false;
          var normalizedPath = path;

          var queryStart = normalizedPath.indexOf('?');
          if (queryStart !== -1) {
            var queryString = normalizedPath.substr(queryStart + 1, normalizedPath.length);
            normalizedPath = normalizedPath.substr(0, queryStart);
            queryParams = parseQueryString(queryString);
          }

          normalizedPath = decodeURI(normalizedPath);

          if (normalizedPath.charAt(0) !== '/') {
            normalizedPath = '/' + normalizedPath;
          }

          var pathLen = normalizedPath.length;
          if (pathLen > 1 && normalizedPath.charAt(pathLen - 1) === '/') {
            normalizedPath = normalizedPath.substr(0, pathLen - 1);
            isSlashDropped = true;
          }

          for (var i = 0, l = normalizedPath.length; i < l; i++) {
            states = recognizeChar(states, normalizedPath.charAt(i));
            if (!states.length) {
              break;
            }
          }

          var solutions = [];
          for (var _i3 = 0, _l = states.length; _i3 < _l; _i3++) {
            if (states[_i3].handlers) {
              solutions.push(states[_i3]);
            }
          }

          states = sortSolutions(solutions);

          var state = solutions[0];
          if (state && state.handlers) {
            if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
              normalizedPath = normalizedPath + '/';
            }

            return findHandler(state, normalizedPath, queryParams);
          }

          return undefined;
        };

        return RouteRecognizer;
      }());

      _export('RouteRecognizer', RouteRecognizer);

      RecognizeResults = function RecognizeResults(queryParams) {
        

        this.splice = Array.prototype.splice;
        this.slice = Array.prototype.slice;
        this.push = Array.prototype.push;
        this.length = 0;
        this.queryParams = queryParams || {};
      };
    }
  };
});