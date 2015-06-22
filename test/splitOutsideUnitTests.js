var nativePromise = Promise,
    assert = require("assert"),
    testSuite = function(promiseType) {
        describe(promiseType + ' Unit tests', function() {
            describe('instantiation', function() {
                it('should throw error if argument is not a function', function() {
                  /*  assert.throws(
                        function() {
                            new Promise();
                        },
                        Error
                    );*/
                });
                it('should have a constructor with name Promise', function() {
                    //assert.equal(new Promise(function() {}).constructor.name, 'Promise');
                });
                it('should have a methods all, race, resolve and reject', function() {
                    /*assert.equal(typeof Promise.reject, 'function');
                    assert.equal(typeof Promise.resolve, 'function');
                    assert.equal(typeof Promise.all, 'function');
                    assert.equal(typeof Promise.race, 'function');*/
                });
                it('instantiated object should have a methods then and catch', function() {
                   /* assert.equal(typeof new Promise(function() {})['catch'], 'function');
                    assert.equal(typeof new Promise(function() {}).then, 'function');*/

                });
            });
        });
    };

/*    // run test suite against native Promise
    testSuite('Native');
    root.Promise = undefined;
}

// remove Native Promise

root.Promise = require('../polyfillPromise-0.1.js');

// run test suite against polyfillPromise
testSuite('Polyfill');

root.Promise = undefined;
root.Promise = require('../polyfillPromise-0.1.min.js');

// run test suite against polyfillPromise.min
testSuite('Minified Polyfill');*/

