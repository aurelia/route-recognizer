'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _core = require('core-js');

var _core2 = _interopRequireWildcard(_core);

var _map = require('./dsl');

var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

var StaticSegment = (function () {
  function StaticSegment(string) {
    _classCallCheck(this, StaticSegment);

    this.string = string;
  }

  _createClass(StaticSegment, [{
    key: 'eachChar',
    value: function eachChar(callback) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.string[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var ch = _step.value;

          callback({ validChars: ch });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'regex',
    value: function regex() {
      return this.string.replace(escapeRegex, '\\$1');
    }
  }, {
    key: 'generate',
    value: function generate() {
      return this.string;
    }
  }]);

  return StaticSegment;
})();

var DynamicSegment = (function () {
  function DynamicSegment(name) {
    _classCallCheck(this, DynamicSegment);

    this.name = name;
  }

  _createClass(DynamicSegment, [{
    key: 'eachChar',
    value: function eachChar(callback) {
      callback({ invalidChars: '/', repeat: true });
    }
  }, {
    key: 'regex',
    value: function regex() {
      return '([^/]+)';
    }
  }, {
    key: 'generate',
    value: function generate(params, consumed) {
      consumed[this.name] = true;
      return params[this.name];
    }
  }]);

  return DynamicSegment;
})();

var StarSegment = (function () {
  function StarSegment(name) {
    _classCallCheck(this, StarSegment);

    this.name = name;
  }

  _createClass(StarSegment, [{
    key: 'eachChar',
    value: function eachChar(callback) {
      callback({ invalidChars: '', repeat: true });
    }
  }, {
    key: 'regex',
    value: function regex() {
      return '(.+)';
    }
  }, {
    key: 'generate',
    value: function generate(params, consumed) {
      consumed[this.name] = true;
      return params[this.name];
    }
  }]);

  return StarSegment;
})();

var EpsilonSegment = (function () {
  function EpsilonSegment() {
    _classCallCheck(this, EpsilonSegment);
  }

  _createClass(EpsilonSegment, [{
    key: 'eachChar',
    value: function eachChar() {}
  }, {
    key: 'regex',
    value: function regex() {
      return '';
    }
  }, {
    key: 'generate',
    value: function generate() {
      return '';
    }
  }]);

  return EpsilonSegment;
})();

function parse(route, names, types) {
  if (route.charAt(0) === '/') {
    route = route.substr(1);
  }

  var results = [];

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = route.split('/')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var segment = _step2.value;

      var match = undefined;

      if (match = segment.match(/^:([^\/]+)$/)) {
        results.push(new DynamicSegment(match[1]));
        names.push(match[1]);
        types.dynamics++;
      } else if (match = segment.match(/^\*([^\/]+)$/)) {
        results.push(new StarSegment(match[1]));
        names.push(match[1]);
        types.stars++;
      } else if (segment === '') {
        results.push(new EpsilonSegment());
      } else {
        results.push(new StaticSegment(segment));
        types.statics++;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return results;
}

var State = (function () {
  function State(charSpec) {
    _classCallCheck(this, State);

    this.charSpec = charSpec;
    this.nextStates = [];
  }

  _createClass(State, [{
    key: 'get',
    value: function get(charSpec) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.nextStates[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var child = _step3.value;

          var isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;

          if (isEqual) {
            return child;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'put',
    value: function put(charSpec) {
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
    }
  }, {
    key: 'match',
    value: function match(ch) {
      var nextStates = this.nextStates,
          results = [],
          child,
          charSpec,
          chars;

      for (var i = 0, l = nextStates.length; i < l; i++) {
        child = nextStates[i];

        charSpec = child.charSpec;

        if (typeof (chars = charSpec.validChars) !== 'undefined') {
          if (chars.indexOf(ch) !== -1) {
            results.push(child);
          }
        } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
          if (chars.indexOf(ch) === -1) {
            results.push(child);
          }
        }
      }

      return results;
    }
  }]);

  return State;
})();

;

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

    nextStates = nextStates.concat(state.match(ch));
  }

  return nextStates;
}

var RecognizeResults = function RecognizeResults(queryParams) {
  _classCallCheck(this, RecognizeResults);

  this.splice = Array.prototype.splice;
  this.slice = Array.prototype.slice;
  this.push = Array.prototype.push;
  this.length = 0;
  this.queryParams = queryParams || {};
};

function findHandler(state, path, queryParams) {
  var handlers = state.handlers,
      regex = state.regex;
  var captures = path.match(regex),
      currentCapture = 1;
  var result = new RecognizeResults(queryParams);

  for (var i = 0, l = handlers.length; i < l; i++) {
    var handler = handlers[i],
        names = handler.names,
        params = {};

    for (var j = 0, m = names.length; j < m; j++) {
      params[names[j]] = captures[currentCapture++];
    }

    result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
  }

  return result;
}

function addSegment(currentState, segment) {
  segment.eachChar(function (ch) {
    currentState = currentState.put(ch);
  });

  return currentState;
}

var RouteRecognizer = (function () {
  function RouteRecognizer() {
    _classCallCheck(this, RouteRecognizer);

    this.map = _map.map;
    this.rootState = new State();
    this.names = {};
  }

  _createClass(RouteRecognizer, [{
    key: 'add',
    value: function add(route) {
      if (Array.isArray(route)) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = route[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var r = _step4.value;

            this.add(r);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
              _iterator4['return']();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return;
      }

      var currentState = this.rootState,
          regex = '^',
          types = { statics: 0, dynamics: 0, stars: 0 },
          names = [],
          routeName = route.handler.name,
          isEmpty = true;

      var segments = parse(route.path, names, types);
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = segments[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var segment = _step5.value;

          if (segment instanceof EpsilonSegment) {
            continue;
          }

          isEmpty = false;

          currentState = currentState.put({ validChars: '/' });
          regex += '/';

          currentState = addSegment(currentState, segment);
          regex += segment.regex();
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5['return']) {
            _iterator5['return']();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (isEmpty) {
        currentState = currentState.put({ validChars: '/' });
        regex += '/';
      }

      var handlers = [{ handler: route.handler, names: names }];

      if (routeName) {
        this.names[routeName] = {
          segments: segments,
          handlers: handlers
        };
      }

      currentState.handlers = handlers;
      currentState.regex = new RegExp(regex + '$');
      currentState.types = types;

      return currentState;
    }
  }, {
    key: 'handlersFor',
    value: function handlersFor(name) {
      var route = this.names[name],
          result = [];

      if (!route) {
        throw new Error('There is no route named ' + name);
      }

      for (var i = 0, l = route.handlers.length; i < l; i++) {
        result.push(route.handlers[i]);
      }

      return result;
    }
  }, {
    key: 'hasRoute',
    value: function hasRoute(name) {
      return !!this.names[name];
    }
  }, {
    key: 'generate',
    value: function generate(name, params) {
      params = Object.assign({}, params);

      var route = this.names[name],
          consumed = {},
          output = '';

      if (!route) {
        throw new Error('There is no route named ' + name);
      }

      var segments = route.segments;

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i];

        if (segment instanceof EpsilonSegment) {
          continue;
        }

        output += '/';
        var segmentValue = segment.generate(params, consumed);
        if (segmentValue === null || segmentValue === undefined) {
          throw new Error('A value is required for route parameter \'' + segment.name + '\' in route \'' + name + '\'.');
        }

        output += segmentValue;
      }

      if (output.charAt(0) !== '/') {
        output = '/' + output;
      }

      for (var param in consumed) {
        delete params[param];
      }

      output += this.generateQueryString(params);

      return output;
    }
  }, {
    key: 'generateQueryString',
    value: function generateQueryString(params) {
      var pairs = [],
          keys = [],
          encode = encodeURIComponent;

      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          keys.push(key);
        }
      }

      keys.sort();
      for (var i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        var value = params[key];
        if (value === null || value === undefined) {
          continue;
        }

        if (Array.isArray(value)) {
          var arrayKey = '' + encode(key) + '[]';
          for (var j = 0, l = value.length; j < l; j++) {
            pairs.push('' + arrayKey + '=' + encode(value[j]));
          }
        } else {
          pairs.push('' + encode(key) + '=' + encode(value));
        }
      }

      if (pairs.length === 0) {
        return '';
      }

      return '?' + pairs.join('&');
    }
  }, {
    key: 'parseQueryString',
    value: function parseQueryString(queryString) {
      var queryParams = {};
      if (!queryString || typeof queryString !== 'string') {
        return queryParams;
      }

      if (queryString.charAt(0) === '?') {
        queryString = queryString.substr(1);
      }

      var pairs = queryString.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('='),
            key = decodeURIComponent(pair[0]),
            keyLength = key.length,
            isArray = false,
            value;

        if (!key) {
          continue;
        } else if (pair.length === 1) {
          value = true;
        } else {
          if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
            isArray = true;
            key = key.slice(0, keyLength - 2);
            if (!queryParams[key]) {
              queryParams[key] = [];
            }
          }
          value = pair[1] ? decodeURIComponent(pair[1]) : '';
        }
        if (isArray) {
          queryParams[key].push(value);
        } else {
          queryParams[key] = value;
        }
      }
      return queryParams;
    }
  }, {
    key: 'recognize',
    value: function recognize(path) {
      var states = [this.rootState],
          pathLen,
          i,
          l,
          queryStart,
          queryParams = {},
          isSlashDropped = false;

      queryStart = path.indexOf('?');
      if (queryStart !== -1) {
        var queryString = path.substr(queryStart + 1, path.length);
        path = path.substr(0, queryStart);
        queryParams = this.parseQueryString(queryString);
      }

      path = decodeURI(path);

      if (path.charAt(0) !== '/') {
        path = '/' + path;
      }

      pathLen = path.length;
      if (pathLen > 1 && path.charAt(pathLen - 1) === '/') {
        path = path.substr(0, pathLen - 1);
        isSlashDropped = true;
      }

      for (i = 0, l = path.length; i < l; i++) {
        states = recognizeChar(states, path.charAt(i));
        if (!states.length) {
          break;
        }
      }

      var solutions = [];
      for (i = 0, l = states.length; i < l; i++) {
        if (states[i].handlers) {
          solutions.push(states[i]);
        }
      }

      states = sortSolutions(solutions);

      var state = solutions[0];
      if (state && state.handlers) {
        if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
          path = path + '/';
        }
        return findHandler(state, path, queryParams);
      }
    }
  }]);

  return RouteRecognizer;
})();

exports.RouteRecognizer = RouteRecognizer;