'use strict';
var M = require('@mfjs/core'), defs, ctor;

function isPromise(v) {
  if (v == null)
    return false;
  if (typeof v !== 'object')
    return false;
  return typeof v.then === 'function';
}

function pure(v) {
  return defs.ctor(function(r) {
    return r(v);
  });
}

function coerce(v) {
  if (isPromise(v))
    return v;
  return pure(v);
}

defs = {
  pure: pure,
  coerce: coerce,
  bind: function(a, f) {
    return a.then(f);
  },
  raise: function(v) {
    return defs.ctor(function(r, e) {
      return e(v);
    });
  },
  handle: function(a, f) {
    return a.then(null, f);
  }
};


function PromiseWrap(inner) {
  this.inner = inner;
}
defs = M.defaults(defs, {control:"token",wrap:PromiseWrap})
defs.setCtor = function(ctor) {
  return defs.ctor = ctor;
}

if(typeof(Promise) !== "undefined")
  defs.ctor = Promise

module.exports = defs;

