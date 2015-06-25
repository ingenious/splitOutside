var _ = require('underscore'),
    assert = require("assert"),
    SO = require('../SplitOutside-0.2.js'),
    testSuite = function(testType) {
        return new Promise(function(resolve) {
           
            describe(testType + ' Unit tests', function() {
                it('should be an Object with two methods', function(done) {
                    if (SO) {
                        assert.strictEqual(typeof SO, 'object');
                    }
                    assert.strictEqual(typeof(SO ? SO.parseExpression : "".parseExpression), 'function');
                    assert.strictEqual(typeof(SO ? SO.splitOutside : "".splitOutside), 'function');
                    done();
                });
                describe('splitOutside method', function() {
                    it('should throw error if not applied to string', function(done) {
                        assert.throws(
                            function() {
                                if (SO) {
                                    SO.splitOutside();
                                } else {
                                    (456).splitOutside();
                                }
                            },
                            Error
                        );
                        assert.throws(
                            function() {
                                if (SO) {
                                    SO.splitOutside([]);
                                } else {
                                    ([]).splitOutside();
                                }
                            },
                            Error
                        );
                        assert.throws(
                            function() {
                                if (SO) {
                                    SO.splitOutside(null);
                                } else {
                                    (null).splitOutside(',');
                                }
                            },
                            Error
                        );
                        done();
                    });
                    it('.splitOutside() should return array', function(done) {
                        assert.strictEqual(SO ? typeof SO.splitOutside("a,b", ',') : typeof 'a,b'.splitOutside(','), 'object');
                        assert.notEqual(SO ? SO.splitOutside("a,b", ',')[0] : typeof 'a,b'.splitOutside(',')[0], undefined);
                        done();
                    });
                    it('should return array with original string if `delimiting_string` is not a string', function(done) {
                        assert.strictEqual(typeof(SO ? SO.splitOutside("a,b", ',') : 'a,b'.splitOutside(',')), 'object');
                        assert.strictEqual(SO ? SO.splitOutside("a,b")[0] : "a,b".splitOutside()[0], "a,b");
                        done();
                    });
                });
                describe('parseExpression method', function() {
                    it('should throw error if not applied to string', function(done) {
                        assert.throws(
                            function() {
                                if (SO) {
                                    SO.parseExpression();
                                } else {
                                    (456).parseExpression();
                                }
                            },
                            Error
                        );
                        assert.throws(
                            function() {
                                if (SO) {
                                    SO.parseExpression([]);
                                } else {
                                    ([]).parseExpression();
                                }
                            },
                            Error
                        );
                        assert.throws(
                            function() {
                                if (SO) {
                                    SO.parseExpression(null);
                                } else {
                                    (null).parseExpression(',');
                                }
                            },
                            Error
                        );
                        done();
                    });
                    it('.parseExpression() should return boolean if expression resolves to boolean', function(done) {
                        assert.strictEqual(typeof(SO ? SO.parseExpression("50<2") : '50<2'.parseExpression()), 'boolean');
                        assert.strictEqual((SO ? SO.parseExpression('(true || false) && (true && false)') : '(true || false) && (true && false)'.parseExpression()), false);
                    done();});
                    it('.parseExpression() should return number if expression resolves to number', function(done) {
                        assert.strictEqual(typeof(SO ? SO.parseExpression("50-2") : '50-2'.parseExpression()), 'number');
                        assert.strictEqual(typeof(SO ? SO.parseExpression('50 * 2') : '50 * 2'.parseExpression()), 'number');
                    done();});
                    it('.parseExpression() should return array if expression resolves to array', function(done) {
                        assert.strictEqual(typeof(SO ? SO.parseExpression('[50,2,25]') : '[50,2,25]'.parseExpression()), 'object');
                        assert.notEqual(typeof(SO ? SO.parseExpression('[50,2,25]')[0] : '[50,2,25]'.parseExpression()[0]), undefined);
                    done();});
                    it('.parseExpression() should return object if expression resolves to object', function(done) {
                        assert.strictEqual(typeof(SO ? SO.parseExpression('{a:23,b:45}') : '{a:23,b:45}'.parseExpression()), 'object');
                    done();});
                    it('.parseExpression() should return null if expression resolves to null', function(done) {
                        assert.strictEqual((SO ? SO.parseExpression('null') : 'null'.parseExpression()), null);
                    done();});
                    it('.parseExpression() should return a function if expression resolves to a function', function(done) {
                        assert.strictEqual(typeof(SO ? SO.parseExpression('a', {
                            a: function() {
                                var e = 34;
                            }
                        }) : 'a'.parseExpression({
                            a: function() {
                                var e = 34;
                            }
                        })), 'function');
                        done();
                    });
                    it('.parseExpression() should return a string if expression resolves to a string', function(done) {
                        assert.strictEqual(typeof(SO ? SO.parseExpression('abc') : 'abc'), 'string');
                        done();
                    });
                 
                    resolve();
                });
            });
        });
    };



// run test suite against Object methods
testSuite('Object Methods')
    .then(function() {

        _.extend(String.prototype, SO);
        SO = null;

        // run test suite against String methods
        return testSuite('String Methods').then(function() {

            SO = require('../SplitOutside-0.2.js');

            // run test suite against Minified JS Object Methods
            return testSuite('Minified JS Object Methods');
        });
    });
