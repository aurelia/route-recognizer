'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaRouteRecognizer = require('./aurelia-route-recognizer');

Object.keys(_aureliaRouteRecognizer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaRouteRecognizer[key];
    }
  });
});