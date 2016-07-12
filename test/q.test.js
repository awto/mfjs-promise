'use strict';
var M = require('@mfjs/core');
var Q = require('Q');
var QM = require('../');
QM.setCtor(Q.Promise);
M.profile('defaultMinimal');
var KM = require('@mfjs/core/test/kit/dist/noeff');
KM(
  M,
  function (txt, f) {
    var args = KM.defaultItArgs(QM);
    args.heavy = true
    args.run = function(f) {
      return f();
    };
    return it(txt, function(done) {
      if (done.async)
        done = done.async();
      args.done = done;
      QM.run(function() { return f(args) });
    });
  }
);

describe('Q monad', function() {
  it('should handle loop iterations in sequence', function(done) {
    if (done.async)
      done = done.async();
    QM.run(function() {
      var result = 0, i;
      for (i = 0; i < 10; i++) {
        result = M(addLater(result,i));
      }
      expect(result).to.equal(45);
		  done();
	  });
	  
	  function addLater(a, b) {
	    var deferred = Q.defer();
	    process.nextTick(function() {
		    deferred.resolve(a + b);
	    });
	    return deferred.promise;
	  }
  });
});


