var _ = require('underscore'),
    assert = require("assert"),
    SO = require('../SplitOutside-0.2.js'),
    testSuite = function(testType) {
        return new Promise(function(resolve) {
           

            describe(testType + ' Functional tests', function() {
                
                describe('splitOutside method', function() {
                   it('should split a string with ignoring delimiting string in quotes', function(done) {
                    assert.strictEqual((SO ? SO.splitOutside("3,4,'test, part',unseen hole",',',{}) : "3,4,'test, part',unseen hole".splitOutside(',', {}))[2], 'test, part');
                    done();

                   });
                   it('should split a string with ignoring delimiting string in (),{},[]', function(done) {
                    assert.strictEqual((SO ? SO.splitOutside("3,4,(test, part),unseen hole",',') : "3,4,(test, part),unseen hole".splitOutside(','))[2], '(test, part)');
                    assert.strictEqual((SO ? SO.splitOutside("3,4,[test, part],unseen hole",',') : "3,4,[test, part],unseen hole".splitOutside(','))[2], '[test, part]');
                    assert.strictEqual((SO ? SO.splitOutside("3,4,{test, part},unseen hole",',') : "3,4,{test, part},unseen hole".splitOutside(','))[2], '{test, part}');
                    done();

                   });
                    it('should interpret an array [test,part] between delimiters', function(done) {
                    assert.strictEqual((SO ? SO.splitOutside("3,4,[test, part],unseen hole",',',{}) : "3,4,[test, part],unseen hole".splitOutside(',',{}))[2][0], "test");
                    assert.strictEqual((SO ? SO.splitOutside("[3,4,5],[test, part],unseen hole",',',{}) : "[3,4],[test, part],unseen hole".splitOutside(',',{}))[0][2], 5);
                    done();

                   });
                    it('should interpret attributes and methods from a passed context between delimiters', function(done) {
                    assert.strictEqual((SO ? SO.splitOutside("3,4,[test, part],unseen hole",',',{test:'world', part:42}) : "3,4,[test, part],unseen hole".splitOutside(',',{test:'world', part:42}))[2][0], "world");
                    assert.strictEqual((SO ? SO.splitOutside("[3,4,5],[test, part],unseen hole",',',{test:'world', part:42}) : "[3,4],[test, part],unseen hole".splitOutside(',',{test:'world', part:42}))[1][1], 42);
                    done();

                   });
                });
                describe('parseExpression method', function() {
                   it('should evaluate simple arithmetic expressions', function(done) {
                    assert.strictEqual(SO ? SO.parseExpression('4 * (5 - 6)') : '4 * (5 - 6)'.parseExpression(','), -4);
                    done();

                   });
                 it('should evaluate simple boolean expressions', function(done) {
                    assert.strictEqual(SO ? SO.parseExpression('2 < 5') : '2 < 5'.parseExpression(), true);
                    assert.strictEqual(SO ? SO.parseExpression('Math.floor(1.9)>2') : 'Math.floor(1.9)>2'.parseExpression(), false);
                    assert.strictEqual(SO ? SO.parseExpression('(true && false) && (true || false)') : '(true && false) && (true || false)'.parseExpression(), false);
                    
                    done();

                   });
                 it('should evaluate methods', function(done) {
                    assert.strictEqual(SO ? SO.parseExpression('Math.floor(3.9)', null) : 'Math.floor(3.9)'.parseExpression(null), 3);
                    done();

                   });
                  it('should evaluate simple objects', function(done) {
                    assert.strictEqual(SO ? SO.parseExpression('{a:Math.round(8.95),b:{c:hello}}', null).a : '{a:Math.round(8.95),b:{c:hello}}'.parseExpression(null).a, 9);
                     assert.strictEqual(SO ? SO.parseExpression('{a:Math.round(8.95),b:{c:hello}}', null).b.c : '{a:Math.round(8.95),b:{c:hello}}'.parseExpression(null).b.c, 'hello');
                    done();
                   });
                it('should evaluate attributes and methods of a passed context', function(done) {
                    assert.strictEqual(SO ? SO.parseExpression('a/b()', {a:14,b:function(){return 7;}}): 'a/b()'.parseExpression({a:14,b:function(){return 7;}}), 2);
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

            SO = require('../SplitOutside-0.2.min.js');

            // run test suite against Minified JS Object Methods
            return testSuite('Minified JS Object Methods');
        });
    });
