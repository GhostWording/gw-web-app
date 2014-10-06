var gulp = require('gulp');
var http = require('http');
var gUtil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var install = require('gulp-install');
var cssmin = require('gulp-cssmin');
var rev = require('gulp-rev');
var templateCache = require('gulp-angular-templatecache');
var gIf = require('gulp-if');
var path = require('path');
var rename = require('gulp-rename');
var gProtractor = require('gulp-protractor');
var runSequence = require('run-sequence');
var childProcess = require('child_process');
var inject = require('gulp-inject');
var merge = require('merge-stream');
var glob = require('glob');
var shelljs = require('shelljs');

var config = require('./config.js');

// Release mode switch
var release = gUtil.env.release?true:false;

// Deploy mode switch
var deploy = false;

// For gulp help
var definitions = [];
var columnSpace = '            ';
var define = function(name, desc){
    definitions.push({name:name , description:desc});
};

// App javascript glob patterns
function appJSGlobs() {	
	return [
		'scripts/**/*.js',
		'!scripts/old/**/*.js',
		'!scripts/lib/**/*.js'
	];
}

// Vendor javascript paths
function vendorJSFiles(release) {
	return [
		'bower_components/angular/angular' + (release?'.min':'') + '.js',
		'bower_components/angular-ui-router/release/angular-ui-router' + (release?'.min':'') + '.js',
		'bower_components/angular-cookies/angular-cookies' + (release?'.min':'') + '.js',
		'bower_components/angular-sanitize/angular-sanitize' + (release?'.min':'') + '.js',
		'bower_components/angular-spinkit/build/angular-spinkit' + (release?'.min':'') + '.js',
		'bower_components/angular-promise-tracker/promise-tracker.js',
		'bower_components/angular-promise-tracker/promise-tracker-http-interceptor.js',
		'bower_components/angular-translate/angular-translate' + (release?'.min':'') + '.js',
		'bower_components/angular-easyfb/angular-easyfb' + (release?'.min':'') + '.js',
		'scripts/lib/bootstrap-custom/ui-bootstrap-custom-tpls-0.10.0' + (release?'.min':'') + '.js',
    'scripts/lib/fastclick.js'
	];
}

// CSS file paths
function cssFiles(release) {	
	return [
		'bower_components/bootstrap/dist/css/bootstrap' + (release?'.min':'') + '.css',
		'bower_components/components-font-awesome/css/font-awesome' + (release?'.min':'') + '.css',
		'assets/app.css'
	];
}

// Font file paths
function fontFiles() {	
	return [
		'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
		'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
		'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
		'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
		'bower_components/components-font-awesome/fonts/fontawesome-webfont.woff',
		'bower_components/components-font-awesome/fonts/fontawesome-webfont.svg',
		'bower_components/components-font-awesome/fonts/fontawesome-webfont.eot',
		'bower_components/components-font-awesome/fonts/fontawesome-webfont.ttf'
	];
}

/*************************************************************/
define('serve','run a simple express server with built files');
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
  return gulp.src('build', { read: false })
		.pipe(rimraf());
});

/*************************************************************/
define('jshint','check the code for jshint errors');
/*************************************************************/
gulp.task('jshint', function() {
  return gulp.src(appJSGlobs())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

/*************************************************************/
define('appjs','process application javascript');
/*************************************************************/
gulp.task('appjs', function() {
	// TODO: we can get rid of this function when gulp-replace supports regex replacement on streams (soon!)
	function injectConfigStream(stream) {
		var configValues = config.getAll(release?(deploy?'deploy':'release'):'debug'); 
		for(var configValueKey in configValues) {
			if (configValues.hasOwnProperty(configValueKey)) {
				stream.pipe(replace('<<<' + configValueKey + '>>>', configValues[configValueKey]));
			}
		}
	}
	var jsStream;
	if(release) {
		jsStream = gulp.src(appJSGlobs());
		// inject config values 
		injectConfigStream(jsStream);
		// Minify
		jsStream.pipe(uglify());
		// Convert views to js so they can be injected into angular templatecache on startup
		var viewStream = gulp.src('views/**/*.html')
			// Rewrite asset url's in deploy builds
			.pipe(gIf(deploy, replace('./assets/', config.get('CDN_URL') + 'assets/')))
			.pipe(templateCache('templates.js', {root:'views', module:'cherryApp'}));
		return merge(jsStream, viewStream)
			.pipe(concat('app.js'))
			.pipe(rev())
			.pipe(gulp.dest('build/assets'));
	} else {
		jsStream = gulp.src(appJSGlobs());
		// inject config values 
		injectConfigStream(jsStream);
		jsStream.pipe(gulp.dest('build/scripts'));
	}
});

/*************************************************************/
define('vendorjs','process vendor javascript');
/*************************************************************/
gulp.task('vendorjs', function() {
	if(release) {
		return gulp.src(vendorJSFiles())
			.pipe(uglify())
			.pipe(concat('vendor.js'))
			.pipe(rev())
			.pipe(gulp.dest('build/assets'));
	} else {
		return gulp.src(vendorJSFiles(), {base: '.'})
			.pipe(gulp.dest('build'));
	}
});

/*************************************************************/
define('styles','process styles');
/*************************************************************/
gulp.task('styles', function() {
	if(release) {
		return gulp.src(cssFiles(true))
			.pipe(cssmin({keepSpecialComments:0}))
			// Rewrite asset url's in deploy builds
			.pipe(gIf(deploy, replace('/assets/', config.get('CDN_URL') + 'assets/')))
			// Rewrite font paths
			.pipe(replace('../fonts', '/assets/fonts'))
			.pipe(concat('style.css'))
			.pipe(rev())
			.pipe(gulp.dest('build/assets'));
	} else {
		return gulp.src(cssFiles(false), {base: '.'})
			// Rewrite font paths
			.pipe(replace('../fonts', '/assets/fonts'))
			.pipe(gulp.dest('build'));
	}
});

/*************************************************************/
define('fonts','process fonts');
/*************************************************************/
gulp.task('fonts', function() {
	return gulp.src(fontFiles())
		.pipe(gulp.dest('build/assets/fonts'));
});

/*************************************************************/
define('maps','process maps');
/*************************************************************/
gulp.task('maps', function(cb) {
	if(release) { cb(); return; }
	return gulp.src(['./bower_components/**/*.map','./scripts/lib/**/*.map'], {base: '.'})
		.pipe(gulp.dest('build'));
});

/*************************************************************/
define('views','process views');
/*************************************************************/
gulp.task('views', function(cb) {
	// Dont copy views in release since we are bundling them into app.js
	if(release) { cb(); return; }
	return gulp.src(['views/**/*'])
		.pipe(gulp.dest('build/views'));
});

/*************************************************************/
define('server','process server');
/*************************************************************/
gulp.task('server', function() {
  return gulp.src(['server.js'])
		.pipe(gulp.dest('build'));
});

/*************************************************************/
define('assets','process assets');
/*************************************************************/
gulp.task('assets', function() {
  return gulp.src(['assets/**/*'])
		.pipe(gulp.dest('build/assets'));
});

/*************************************************************/
define('index','process index');
/*************************************************************/
gulp.task('index', function(cb) {
	if(release) {
		// Find bundles (with their correct revision hashes)
		var appBundle = glob.sync('build/assets/app-*.js')[0];
		var vendorBundle = glob.sync('build/assets/vendor-*.js')[0];
		var styleBundle = glob.sync('build/assets/style-*.css')[0];
		if(!appBundle) { cb('app bundle not found'); return; } 
		if(!vendorBundle) { cb('vendor bundle not found'); return; } 
		if(!styleBundle) { cb('style bundle not found'); return; } 
		appBundle = appBundle.replace('build/','');
		vendorBundle = vendorBundle.replace('build/','');
		styleBundle = styleBundle.replace('build/','');
		if(deploy) {
			var cdnUrl = config.get('CDN_URL'); 
			appBundle = cdnUrl + appBundle;
			vendorBundle = cdnUrl + vendorBundle;
			styleBundle = cdnUrl + styleBundle;
		}
		return gulp.src('index.html')
			// Replace app injection point with app bundle include
			.pipe(replace('<!-- app:js --><!-- endinject -->','<script src="' + appBundle + '"></script>'))
			// Replace vendor injection point with vendor bundle include
			.pipe(replace('<!-- vendor:js --><!-- endinject -->','<script src="' + vendorBundle + '"></script>'))
			// Replace style injection point with style bundle include
			.pipe(replace('<!-- style:css --><!-- endinject -->','<link rel="stylesheet" href="' + styleBundle + '">'))
			.pipe(gulp.dest('./build'));
	} else {
		return gulp.src('index.html')
			// Inject app js files
			.pipe(inject(gulp.src(appJSGlobs(), {read: false}), {name: 'app'}))
			// Inject vendor js files
			.pipe(inject(gulp.src(vendorJSFiles(), {read: false}), {name: 'vendor'}))
			// Inject style css files
			.pipe(inject(gulp.src(cssFiles(), {read: false}), {name: 'style'}))
			.pipe(gulp.dest('./build'));
		}
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
define('build','create a local development build (unbundled/unminified)');
/*************************************************************/
gulp.task('build', function(cb) {
	runSequence(['clean', 'jshint'], ['appjs', 'vendorjs', 'assets', 'server', 'views', 'styles', 'fonts', 'maps'], 'index', cb);
});

/*************************************************************/
define('release','create a local release build for pre-deployment testing');
/*************************************************************/
gulp.task('release', function(cb) {
	release = true;
	runSequence('build', cb);
});

/*************************************************************/
define('deploy','create a deployment build');
/*************************************************************/
gulp.task('deploy', function(cb) {
	release = true;
	deploy = true;
	// TODO: Bump package.json/bower.json versions
	// TODO: Git tag release
	// TODO: Upload build to server?
	// TODO: Copy assets to CDN?
	runSequence('build', cb);
});

/*************************************************************/
define('watch','activate watch mode to run tests and serve on file changes');
/*************************************************************/
gulp.task('watch', ['install', 'build'], function() {
	gulp.watch(['scripts/**', 'assets/**', 'views/**', 'index.html', 'tests/**'], function() {
		runSequence('build');
	});
});

/*************************************************************/
define('env','show environment');
/*************************************************************/
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

/*************************************************************/
define('default','install, build and run the app');
/*************************************************************/
gulp.task('default', function(cb) {
	runSequence('install', 'build', 'serve', cb);
});

// Self validation
gulp.src('gulpfile.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
