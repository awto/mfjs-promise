# @mfjs/promise

This is a tiny wrapper converting Promise ES compatible API to mfjs interface,
embedding direct  asynchronous programming into JavaScript. 

## Usage

    $ npm install --save-dev @mfjs/compiler
    $ npm install --save @mfjs/core @mfjs/promise
    $ mfjsc input-file.js -o dist

    # or for browser
    $ npm install --save-dev browserify @mfjs/compiler
    $ npm install --save @mfjs/core @mfjs/promise
    $ browserify -t @mfjs/compiler/monadify input.js -o index.js

Here is an example ported from [yield-on-promise](https://www.npmjs.com/package/yield-on-promise),
but can work in browser too.

```javascript
var M = require('@dmjs/core');
var QM = require('@dmjs/promise');
var Q = require('q');
QM.setCtor(Q.Promise);
M.profile('defaultMinimal');

QM.run(function() {
  var result = M(addLater(1, 2));
  console.log(result); // outputs 3
});

function addLater(a, b) {
  var deferred = Q.defer();
  process.nextTick(function() {
    deferred.resolve(a + b);
  });
  return deferred.promise;
}

```

## License

Copyright © 2016 Vitaliy Akimov

Distributed under the terms of the [The MIT License (MIT)](LICENSE). 

