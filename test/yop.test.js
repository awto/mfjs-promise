'use strict';
/// derived from https://github.com/willconant/yield-on-promise
var M = require('@mfjs/core');
M.profile('defaultMinimal');
var Q = require('Q');
var QM = require('../');
QM.setCtor(Q.Promise);

describe('yop', function() {
  it('should yield fiber until promise is resolved', function(done) {
    if (done.async)
      done = done.async();
    QM.run(function() {
      var result = M( addLater(1, 2) );
      try {
        expect(result).to.equal(3);
        done();
      } catch (err) {
	      done(err);
      }
    });
    function addLater(a, b) {
      var deferred = Q.defer();
      process.nextTick(function() {
	      deferred.resolve(a + b);
      });
      return deferred.promise;
    }
  });

  it('should throw reasons from rejected promises into fiber', function(done) {
    if (done.async)   
      done = done.async();
    QM.run(function() {
      try {          
	      M( throwErrorLater() );   
	    } catch (err) {    
	      try {     
	        expect(err.message).to.equal('promise rejected');
	        done();
	      } catch (expectErr) {
	        done(expectErr);
	      }
	      return;
	    }
      done(new Error('yop should have thrown reason from rejected promise'));
    });
	  
    function throwErrorLater() {
      var deferred = Q.defer();
      process.nextTick(function() {
	      deferred.reject(new Error('promise rejected'));
      });
      return deferred.promise;
    }
  });
  
  it('should work just fine with passed a value instead of a promise', function(done) {		
    if (done.async)
      done = done.async();
	  QM.run(function() {
	    var result = M( 1 + 2 );
	    try {
		    expect(result).to.equal(3);
		    done();
	    } catch (err) {
		    done(err);
	    }
	  });
  });
});
