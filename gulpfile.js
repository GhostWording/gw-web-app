var gulp = require('gulp');
var http = require('http');
var gUtil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var path = require('path');
var childProcess = require('child_process');
var karma = require('gulp-karma');
var refresh = require('gulp-livereload');
var footer = require('gulp-footer');
var lr = require('tiny-lr');
var server = lr();

var testFiles = ['scripts/**/*.js','tests/**/*.js'];

var definitions = [];
var columnSpace = "            ";

var define = function(name, desc){
    definitions.push({name:name , description:desc});
};

function srcFiles() {
    // Rather than using gulp-ignore we can just provide multiple
    // glob patterns, where the ! indicates that we should exclude
    // the matching files
    return ['scripts/**/*.js', '!scripts/lib/**/*.js'];
}



/*  *   *   *   *   *   *   *   *   *

    T   A   S   K   S

 *  *   *   *   *   *   *   *   *   */

define('clean','clean up build folder by removing all files');
gulp.task('clean', function() {
  // We indicate to gulp that this task is async by returning
  // the stream - gulp can then wait for the stream to close before
  // starting dependent tasks - see 'default' task below
  return gulp.src('build', { read: false })
  .pipe(rimraf());
});


define('jshint','Check the code for jshint errors');
gulp.task('jshint', function() {
  gulp.src(srcFiles())
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});


define('js','Concat the files into a single app.js');
gulp.task('js', function() {
  return gulp.src(srcFiles())
  .pipe(concat('build.js'))
  .pipe(gulp.dest('build/scripts'));
});


define('minify','Concat and minify the files into app.js');
gulp.task('minify', function() {
  return gulp.src(srcFiles())
  .pipe(uglify())
  .pipe(concat('build.js'))
  .pipe(gulp.dest('build/scripts'));
});

define('assets','Copy all the static assets to the build folder');
gulp.task('assets', function() {
  gulp.src(['assets/**/*'])
  .pipe(gulp.dest('build/assets'));

  gulp.src(['scripts/lib/**/*.js'])
  .pipe(gulp.dest('build/scripts/lib'));

  gulp.src(['views/**/*'])
  .pipe(gulp.dest('build/views'));

  gulp.src(['index.html'])
  .pipe(gulp.dest('build'));

  gulp.src(['server.js'])
  .pipe(gulp.dest('build'));
});


define('test','run karma unit tests (as defined in karma.conf)');
gulp.task('test', function(cb) {
  var karma = path.resolve('node_modules', '.bin', 'karma');
  var configFile = path.resolve('karma.conf.js');

    //on windows, use that command instead
  if(process.env.comspec)   {
    child = childProcess.spawn(process.env.comspec, ['/c', 'karma', 'start', configFile]);
  }     else
  {
      var child = childProcess.spawn(karma, ['start', configFile]);
  }

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on('exit', function(exitCode) {
    if ( exitCode ) {
      gUtil.log('Karma tests failed');
      gUtil.beep();
    }
    cb();
  });
});

define('serve','run a a simple express server with builded files');
gulp.task('serve', function(cb) {

    //on windows, use that command instead
    if(process.env.comspec)   {
        child = childProcess.spawn(process.env.comspec, ['/c', 'node', './build/server.js']);
    }   else
    {
        var child = childProcess.spawn('node', ['./build/server.js']);
    }

    gUtil.log('local server in build configuration started');

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', function(exitCode) {
        if ( exitCode ) {
            gUtil.log('error with local static server');
        }
        cb();
    });
});

define('serve-dev','run a simple node serve with development files');
gulp.task('serve-dev', function(cb) {

    //on windows, use that command instead
    if(process.env.comspec)   {
        child = childProcess.spawn(process.env.comspec, ['/c', 'node', 'server.js']);
    }   else
    {
        var child = childProcess.spawn('node', ['server.js']);
    }
    gUtil.log('local server in build configuration started');

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', function(exitCode) {
        if ( exitCode ) {
            gUtil.log('error with local static server');
        }
        cb();
    });
});

define('default','run when gulp is call without argument, it calls clean,jshint, js, assets tasks');
// We put 'clean' as a dependency so that it completes before
// the other tasks are started
gulp.task('default', ['clean'], function() {
  // gulp.run will execute tasks concurrently
  gulp.run( 'jshint', 'js', 'assets');
});

define('release','prepares the build for production');
// Build a release (minified version of the code)
gulp.task('release', ['clean'], function() {
  gulp.run('minify', 'assets');
});

define('watch','activate watch mode to run tests and serve on file changes');
gulp.task('watch', function() {
    gulp.run('default','test','serve');

      gulp.watch(['scripts/**', 'assets/**', 'views/**', 'index.html', 'tests/**'], function() {
        gulp.run('default', 'test');
      });
});

gulp.task('env',function(){
   gUtil.log(process.env);
});

define('help','show this help');
gulp.task('help',function(){
    gUtil.log('----------------------------------------');
    gUtil.log('GULP Tasks: ');
    gUtil.log('----------------------------------------');

    Object.keys(definitions).map(function(key){
        var def = definitions[key];
        var name = gUtil.colors.yellow(def.name + columnSpace.substring(0,10 - def.name.length));
        var description = gUtil.colors.white(def.description);
        gUtil.log(name + ' : ' + description);
    });
});

