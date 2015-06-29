var gulp = require("gulp"),
    mocha = require('gulp-mocha'),
    closureCompiler = require('gulp-closure-compiler'),
    replace = require('gulp-replace'),
      runSequence   = require('run-sequence');


gulp.task('minify', function() {
    return gulp.src('splitOutside-0.2.js')
        .pipe(closureCompiler({
            compilerPath: 'closure_compiler/compiler.jar',
            fileName: 'splitOutside-0.2.min.js'
        }))
        .pipe(gulp.dest('./'));
        
});

gulp.task('string-tests', function() {
    return gulp.src('tests/string-method/*.js', {
        read: false
    })
    .pipe(mocha());
});

gulp.task('object-tests', function() {
    return gulp.src('tests/object-method/*.js', {
        read: false
    })
    .pipe(mocha());
});

gulp.task('minified-tests', function() {
    return gulp.src('tests/minified/*.js', {
        read: false
    })
    .pipe(mocha());
});

gulp.task('tests',function(callback){
	runSequence( 'object-tests', 'minified-tests', 'string-tests', callback);
});


gulp.task('default', function(callback) {
    runSequence('minify',  'tests', callback);
});