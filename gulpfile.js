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
var buffer = require('gulp-buffer');
var rename = require('gulp-rename');
var tap = require('gulp-tap');
var gProtractor = require('gulp-protractor');
var templateCache = require('gulp-angular-templatecache');
var naturalSort = require('gulp-natural-sort');
var gIf = require('gulp-if');
var inject = require('gulp-inject');
var debug = require('gulp-debug');
var path = require('path');
var runSequence = require('run-sequence');
var childProcess = require('child_process');
var merge = require('merge-stream');
var sortStream = require('sort-stream');
var streamQueue = require('streamqueue');
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
    '!scripts/**/*.spec.js',
		'!scripts/old/**/*.js',
		'!scripts/lib/**/*.js'
	];
}

// Common javascript glob patterns
function commonJSGlobs() {	
	return [
		'bower_components/gw-common/**/*.js',
    '!bower_components/gw-common/**/*.spec.js'
	];
}

// Vendor pre-minifed javascript file paths
function vendorJSFilesMinified(release) {
	return [
		'bower_components/angular/angular' + (release?'.min':'') + '.js',
		'bower_components/angular-ui-router/release/angular-ui-router' + (release?'.min':'') + '.js',
		'bower_components/angular-cookies/angular-cookies' + (release?'.min':'') + '.js',
		'bower_components/angular-sanitize/angular-sanitize' + (release?'.min':'') + '.js',
		'bower_components/angular-spinkit/build/angular-spinkit' + (release?'.min':'') + '.js',
		'bower_components/angular-translate/angular-translate' + (release?'.min':'') + '.js',
		'bower_components/angular-easyfb/angular-easyfb' + (release?'.min':'') + '.js',
		'scripts/lib/bootstrap-custom/ui-bootstrap-custom-tpls-0.10.0' + (release?'.min':'') + '.js'
	];
}

// Vendor un-minified javascript file paths
function vendorJSFiles() {
	return [
		'bower_components/angular-promise-tracker/promise-tracker.js',
		'bower_components/angular-promise-tracker/promise-tracker-http-interceptor.js',
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
define('copyappjs','copy application javascript to build folder');
/*************************************************************/
gulp.task('copyappjs', function() {
  return gulp.src(appJSGlobs())
    .pipe(gulp.dest('build/scripts/app'));
});

/*************************************************************/
define('copycommonjs','copy common javascript to build folder');
/*************************************************************/
gulp.task('copycommonjs', function() {
  return gulp.src(commonJSGlobs())
    .pipe(gulp.dest('build/scripts/common'));
});

/*************************************************************/
define('appjs','process application javascript');
/*************************************************************/
gulp.task('appjs', function(cb) {
	if(release) {
    var appAndCommonJSGlobs = appJSGlobs().concat(commonJSGlobs());
		generateRevisionHash(appAndCommonJSGlobs, function(revision) {
			// Appplication javascript stream
			var jsStream = gulp.src(appAndCommonJSGlobs)
				// Inject configuration values 
				.pipe(replace('http://api.cvd.io/', config.get('API_URL', deploy?'deploy':'release')))
				.pipe(uglify());
			// Convert views to js so they can be injected into angular templatecache on startup
			var viewStream = gulp.src('views/**/*.html')
				// Rewrite asset url's in deploy builds
				.pipe(gIf(deploy, replace('./assets/', config.get('CDN_URL') + 'assets/')))
				.pipe(templateCache('templates.js', {root:'views', module:'cherryApp'}));
			// Merge the app js and view streams and concatinate
			merge(jsStream, viewStream)
				.pipe(concat('app-' + revision + '.js'))
				.pipe(gulp.dest('build/assets'))
				.pipe(tap(function() {
					cb();
				}));
		});
	} else {
    // Copy app/common javascript to build folder in development mode
    runSequence(['copyappjs', 'copycommonjs'], cb);
	}
});

/*************************************************************/
define('vendorjs','process vendor javascript');
/*************************************************************/
gulp.task('vendorjs', function(cb) {
	if(release) {
		generateRevisionHash(vendorJSFilesMinified(true).concat(vendorJSFiles()), function(revision) {
			// Minify the vendor js that doesn't come with minifed versions
			var minifyStream = gulp.src(vendorJSFiles())
				.pipe(uglify());
			// Dont minify the vendor js that comes with minifed versions (just use them)
			// TODO: could strip out the comment blocks at the top of the angular minifed versions here
			var minifiedStream = gulp.src(vendorJSFilesMinified(true));
			// Prepend the streams
			streamQueue({objectMode: true}, minifiedStream, minifyStream)
				.pipe(concat('vendor-' + revision + '.js'))
				.pipe(gulp.dest('build/assets'))
				.pipe(tap(function() {
					cb();
				}));
		});
	} else {
		// Just copy the files over while preserving folder structure in development mode
		return gulp.src(vendorJSFilesMinified(false).concat(vendorJSFiles()), {base: '.'})
			.pipe(gulp.dest('build'));
	}
});

/*************************************************************/
define('styles','process styles');
/*************************************************************/
gulp.task('styles', function(cb) {
	if(release) {
		generateRevisionHash(cssFiles(true), function(revision) {
			gulp.src(cssFiles(true))
				.pipe(cssmin({keepSpecialComments:0}))
				// Rewrite asset url's in deploy builds
				.pipe(gIf(deploy, replace('/assets/', config.get('CDN_URL') + 'assets/')))
				// Rewrite font paths
				.pipe(replace('../fonts', '/assets/fonts'))
				.pipe(concat('style-' + revision + '.css'))
				.pipe(gulp.dest('build/assets'))
				.pipe(tap(function() {
					cb();
				}));
		});
	} else {
		// Just copy the files over while preserving folder structure in development mode
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
  return gulp.src(['assets/**/*', '!assets/app.css'])
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
			.pipe(inject(gulp.src('scripts/app/**/*.js', {cwd:'build', read: false}), {name: 'app'}))
			// Inject common js files
			.pipe(inject(gulp.src('scripts/common/**/*.js', {cwd:'build', read: false}), {name: 'common'}))
			// Inject vendor js files
			.pipe(inject(gulp.src(vendorJSFilesMinified().concat(vendorJSFiles()), {read: false}), {name: 'vendor'}))
			// Inject style css files
			.pipe(inject(gulp.src(cssFiles(), {read: false}), {name: 'style'}))
      // Output to build folder
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
define('watch','activate watch mode to run tests and serve on file changes');
/*************************************************************/
gulp.task('watch', ['install', 'build'], function() {
	gulp.watch(['scripts/**','bower_components/gw-common/**', 'assets/**', 'views/**', 'index.html', 'tests/**'], function() {
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

// Compute a revision hash from a set of globbed file contents
function generateRevisionHash(globs, cb) {
	var jsStream = gulp.src(globs)
		// Required because globbing file order is non-deterministic, which is not good for revision hashing..
		.pipe(naturalSort())
		.pipe(concat('rev'))
		// Need to convert stream to buffer because gulp-rev doesn't work with streams
		.pipe(buffer())
		.pipe(rev())
		.pipe(tap(function(file) {
			var revision = path.basename(file.path);
			revision = revision.replace('rev-','');
			cb(revision);
		}));
}
