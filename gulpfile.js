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


gulp.task('clean', function() {
  // We indicate to gulp that this task is async by returning
  // the stream - gulp can then wait for the stream to close before
  // starting dependent tasks - see 'default' task below
  return gulp.src('build', { read: false })
  .pipe(rimraf());
});

// LiveReload listening server
gulp.task('livereload', function(){
    server.listen(35722, function(err){
        if(err) return console.log(err);
    });
});

function srcFiles() {
  // Rather than using gulp-ignore we can just provide multiple
  // glob patterns, where the ! indicates that we should exclude
  // the matching files
  return ['scripts/**/*.js', '!scripts/lib/**/*.js'];
}

// Check the code for jshint errors
gulp.task('jshint', function() {
  gulp.src(srcFiles())
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

// Concat the files into a single app.js
gulp.task('js', function() {
  return gulp.src(srcFiles())
  .pipe(concat('app.js'))
  .pipe(gulp.dest('build/scripts'));
});

// Concat and minify the files into app.js
gulp.task('minify', function() {
  return gulp.src(srcFiles())
  .pipe(uglify())
  .pipe(concat('app.js'))
  .pipe(gulp.dest('build/scripts'));
});

// Copy all the static assets to the build folder 
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

// LiveReload listening server
gulp.task('livereload', function(){
    server.listen(35721, function(err){
        if(err) return console.log(err);
    });
});


gulp.task('refresh_html',function(){
    gulp.src('index.html')
        .pipe(footer('<script src="http://localhost:35721/livereload.js?snipver=1"></script>'))
        .pipe(gulp.dest('build'))
        .pipe(refresh(server));
});

gulp.task('test', function(cb) {
  var karma = path.resolve('node_modules', '.bin', 'karma');
  var configFile = path.resolve('karma.conf.js');

  var child = childProcess.spawn(karma, ['start', configFile]);
    //on windows, use that command instead
  if(process.env.comspec)   {
    child = childProcess.spawn(process.env.comspec, ['/c', 'karma', 'start', configFile]);
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

gulp.task('serve', function(cb) {
    var child = childProcess.spawn('node', ['server.js']);
    //on windows, use that command instead
    if(process.env.comspec)   {
        child = childProcess.spawn(process.env.comspec, ['/c', 'node', 'server.js']);
    }

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', function(exitCode) {
        if ( exitCode ) {
            gUtil.log('error with local static server');
        }
        cb();
    });
});


// We put 'clean' as a dependency so that it completes before
// the other tasks are started
gulp.task('default', ['clean'], function() {
  // gulp.run will execute tasks concurrently
  gulp.run( 'jshint', 'js', 'assets');
});

// Build a release (minified version of the code)
gulp.task('release', ['clean'], function() {
  gulp.run('minify', 'assets');
});


gulp.task('watch', function() {
    gulp.run('default','test','serve','livereload');

      gulp.watch(['scripts/**', 'assets/**', 'views/**', 'index.html', 'tests/**'], function() {
        gulp.run('default', 'test','refresh_html');
      });
});


gulp.task('info',function(){
   gUtil.log(process.env);
});