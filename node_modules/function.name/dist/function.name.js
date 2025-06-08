"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (e) {
  return typeof e === "undefined" ? "undefined" : _typeof2(e);
} : function (e) {
  return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof2(e);
};!function (e) {
  if ("object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if ("function" == typeof define && define.amd) define([], e);else {
    var n;n = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, n.functionName = e();
  }
}(function () {
  return function e(n, t, o) {
    function r(i, u) {
      if (!t[i]) {
        if (!n[i]) {
          var c = "function" == typeof require && require;if (!u && c) return c(i, !0);if (f) return f(i, !0);var p = new Error("Cannot find module '" + i + "'");throw p.code = "MODULE_NOT_FOUND", p;
        }var d = t[i] = { exports: {} };n[i][0].call(d.exports, function (e) {
          var t = n[i][1][e];return r(t ? t : e);
        }, d, d.exports, e, n, t, o);
      }return t[i].exports;
    }for (var f = "function" == typeof require && require, i = 0; i < o.length; i++) {
      r(o[i]);
    }return r;
  }({ 1: [function (e, n) {
      !function () {
        var e = "name";(function () {}).name || Object.defineProperty(Function.prototype, e, { get: function get() {
            var n = this.toString().trim().match(/^function\s*([^\s(]+)/)[1];return Object.defineProperty(this, e, { value: n }), n;
          } });
      }(), n.exports = function (e) {
        return e.name;
      };
    }, {}] }, {}, [1])(1);
});