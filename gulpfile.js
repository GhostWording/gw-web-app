var gulp = require('gulp');
var http = require('http');
var gUtil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var install = require('gulp-install');
var path = require('path');
var rename = require('gulp-rename');
var gProtractor = require('gulp-protractor');
var runSequence = require('run-sequence');
var childProcess = require('child_process');
//var karma = require('gulp-karma');
//var refresh = require('gulp-livereload');
//var footer = require('gulp-footer');
//var lr = require('tiny-lr');
var inject = require('gulp-inject');
//var server = lr();
var shelljs = require('shelljs');
var bower = require('bower'); // fails because Olivier cannot reinstall it on his machine

var definitions = [];
var columnSpace = '            ';

var define = function(name, desc){
    definitions.push({name:name , description:desc});
};

function srcFiles() {
    // Rather than using gulp-ignore we can just provide multiple
    // glob patterns, where the ! indicates that we should exclude
    // the matching files
    return [
      'scripts/**/*.js',
      '!scripts/old/**/*.js',
      '!scripts/lib/**/*.js'
    ];
}



/*  *   *   *   *   *   *   *   *   *

    T   A   S   K   S

 *  *   *   *   *   *   *   *   *   */

/*************************************************************/
define('serve','run a a simple express server with built files');
/*************************************************************/
var serveChildProcess = null;
gulp.task('serve', function(cb) {
	// Spawn server as a child process
	serveChildProcess = childProcess.spawn('node', ['build/server.js'], {stdio:'inherit', stderr:'inherit'});
	serveChildProcess.on('close', function (code) {
		console.log('server exited');
	});
	// Kill child process on gulp exit
	process.on('exit', function() {
		serveChildProcess.kill();
	});
	// Done 
	cb();
});

/*************************************************************/
define('clean','clean up build folder by removing all files');
/*************************************************************/
gulp.task('clean', function() {
  // We indicate to gulp that this task is async by returning
  // the stream - gulp can then wait for the stream to close before
  // starting dependent tasks - see 'default' task below
  return gulp.src('build', { read: false })
  .pipe(rimraf());
});

/*************************************************************/
define('jshint','Check the code for jshint errors');
/*************************************************************/
gulp.task('jshint', function() {
  gulp.src(srcFiles())
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

/*************************************************************/
define('js','Concat the files into a single app.js');
/*************************************************************/
gulp.task('js', function() {
  return gulp.src(srcFiles())
  //.pipe(concat('build.js'))
  .pipe(gulp.dest('build/scripts'));
});

/*************************************************************/
define('minify','Concat and minify the files into app.js');
/*************************************************************/
gulp.task('minify', function() {
  return gulp.src(srcFiles())
  .pipe(uglify())
  .pipe(concat('build.js'))
  .pipe(gulp.dest('build/scripts'));
});

/*************************************************************/
define('assets','Copy all the static assets to the build folder');
/*************************************************************/
gulp.task('assets', function() {
  gulp.src(['assets/**/*', 'bower_components/**/*'])
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

/*************************************************************/
define('inject-script-dev','inject one script tag for every script file unminified');
/*************************************************************/
gulp.task('inject-scripts-dev', ['js'],function() {
    var conf =  {
        addRootSlash: false,  // ensures proper relative paths
        ignorePath: '/build/' // ensures proper relative paths
    };
    var rootFile = 'index.html';

    return gulp.src(srcFiles(),{read: false})
        .pipe(inject(rootFile,conf)).pipe(gulp.dest('build'));
});

/*************************************************************/
define('install','install npm/bower dependencies');
/*************************************************************/
gulp.task('install', function() {
	return gulp.src(['./bower.json', './package.json'])
		.pipe(install());
});

/*************************************************************/
define('test','run karma unit tests (as defined in karma.conf)');
/*************************************************************/
gulp.task('test', function(cb) {
  var karma = path.resolve('node_modules', '.bin', 'karma');
  var configFile = path.resolve('karma.conf.js');

  var result = shelljs.exec(karma + ' start ' + configFile);
  if ( result.code ) {
    gUtil.beep();
		gUtil.log(gUtil.colors.red('Karma tests failed'));
  }
});

/*************************************************************/
define('e2etest:run','ensure all dependencies, start the server and run the e2e tests');
/*************************************************************/
gulp.task('e2etest:run', ['default'], function(cb) {
	runSequence('e2etest', cb);
});

/*************************************************************/
define('e2etest:webdriver_update','updates the selenium server standalone jar file');
/*************************************************************/
gulp.task('e2etest:webdriver_update', gProtractor.webdriver_update);

/*************************************************************/
define('e2etest','run the e2e tests (assumes app built and \'serve\' running)');
/*************************************************************/
gulp.task('e2etest', ['e2etest:webdriver_update'], function(cb) {
	gUtil.log(gUtil.colors.yellow('E2E TEST RUN -----------------------------------------'));
	gulp.src(['./e2etests/**/*.scenario.js'])
		.pipe(gProtractor.protractor({
			configFile: 'protractor.conf.js',
			args: ['--baseUrl', 'http://localhost:3000']
		}))
		.on('error', function(e) {
			if(serveChildProcess) serveChildProcess.kill();
			gUtil.beep();
			cb();
		}).on('end', function() {
			if(serveChildProcess) serveChildProcess.kill();
			cb();
		});
});

/*************************************************************/
define('build','build the app');
/*************************************************************/
gulp.task('build', function(cb) {
	runSequence(['clean', 'jshint'], ['js', 'assets'], 'inject-scripts-dev', cb);
});

/*************************************************************/
define('default','install, build and run the app');
/*************************************************************/
gulp.task('default', function(cb) {
	runSequence('install', 'build', 'serve', cb);
});

/*************************************************************/
define('release','prepares the build for production');
/*************************************************************/
// Build a release (minified version of the code)
gulp.task('release', ['clean'], function() {
  gulp.run('minify', 'assets');
});

/*************************************************************/
define('watch','activate watch mode to run tests and serve on file changes');
/*************************************************************/
gulp.task('watch', ['install', 'build'], function() {
	gulp.watch(['scripts/**', 'assets/**', 'views/**', 'index.html', 'tests/**'], function() {
		gulp.run('build');
	});
});

gulp.task('env',function(){
   gUtil.log(process.env);
});

/*************************************************************/
define('help','show this help');
/*************************************************************/
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
