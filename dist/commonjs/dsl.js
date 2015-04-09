'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.map = map;

var _core = require('core-js');

var _core2 = _interopRequireWildcard(_core);

var Target = (function () {
  function Target(path, matcher, delegate) {
    _classCallCheck(this, Target);

    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
  }

  _createClass(Target, [{
    key: 'to',
    value: function to(target, callback) {
      var delegate = this.delegate;

      if (delegate && delegate.willAddRoute) {
        target = delegate.willAddRoute(this.matcher.target, target);
      }

      this.matcher.add(this.path, target);

      if (callback) {
        if (callback.length === 0) {
          throw new Error('You must have an argument in the function passed to `to`');
        }
        this.matcher.addChild(this.path, target, callback, this.delegate);
      }
      return this;
    }
  }]);

  return Target;
})();

var Matcher = (function () {
  function Matcher(target) {
    _classCallCheck(this, Matcher);

    this.routes = {};
    this.children = {};
    this.target = target;
  }

  _createClass(Matcher, [{
    key: 'add',
    value: function add(path, handler) {
      this.routes[path] = handler;
    }
  }, {
    key: 'addChild',
    value: function addChild(path, target, callback, delegate) {
      var matcher = new Matcher(target);
      this.children[path] = matcher;

      var match = generateMatch(path, matcher, delegate);

      if (delegate && delegate.contextEntered) {
        delegate.contextEntered(target, match);
      }

      callback(match);
    }
  }]);

  return Matcher;
})();

function generateMatch(startingPath, matcher, delegate) {
  return function (path, nestedCallback) {
    var fullPath = startingPath + path;

    if (nestedCallback) {
      nestedCallback(generateMatch(fullPath, matcher, delegate));
    } else {
      return new Target(startingPath + path, matcher, delegate);
    }
  };
}

function addRoute(routeArray, path, handler) {
  var len = 0;
  for (var i = 0, l = routeArray.length; i < l; i++) {
    len += routeArray[i].path.length;
  }

  path = path.substr(len);
  var route = { path: path, handler: handler };
  routeArray.push(route);
}

function eachRoute(baseRoute, matcher, callback, binding) {
  var routes = matcher.routes;

  for (var path in routes) {
    if (routes.hasOwnProperty(path)) {
      var routeArray = baseRoute.slice();
      addRoute(routeArray, path, routes[path]);

      if (matcher.children[path]) {
        eachRoute(routeArray, matcher.children[path], callback, binding);
      } else {
        callback.call(binding, routeArray);
      }
    }
  }
}

function map(callback, addRouteCallback) {
  var matcher = new Matcher();

  callback(generateMatch('', matcher, this.delegate));

  eachRoute([], matcher, function (route) {
    if (addRouteCallback) {
      addRouteCallback(this, route);
    } else {
      this.add(route);
    }
  }, this);
}