'use strict';
var M = require('@mfjs/core'), defs;

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

function PromiseDefs() {}

PromiseDefs.prototype = new M.MonadDict();
PromiseDefs.prototype.pure = pure;
PromiseDefs.prototype.raise = function(v) {
  return defs.ctor(function(r, e) {
    return e(v);
  });
};
PromiseDefs.prototype.handle = function(a, f) {
  return coerce(a).then(null, f);
};
PromiseDefs.prototype.bind = function(a, f) {
  return coerce(a).then(f);
};
PromiseDefs.prototype.coerce = coerce;
PromiseDefs.prototype.run = function(f) {
  return coerce(f()).done();
};
PromiseDefs.prototype.reify = function(v) {
  return v;
};
PromiseDefs.prototype.ctor = Promise;

function PromiseWrap(inner) {
  this.inner = inner;
}

defs = M.addContext(M.wrap(M.withControlByToken(new PromiseDefs()), PromiseWrap));

M.completePrototype(defs, PromiseWrap.prototype);

module.exports = defs;

defs.setCtor = function(ctor) {
  return defs.ctor = ctor;
};
