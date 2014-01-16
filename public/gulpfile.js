var gulp = require('gulp');
var gUtil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var path = require('path');
var childProcess = require('child_process');

gulp.task('clean', function() {
  // We indicate to gulp that this task is async by returning
  // the stream - gulp can then wait for the stream to close before
  // starting dependent tasks - see 'default' task below
  return gulp.src('build', { read: false })
  .pipe(rimraf());
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
});

gulp.task('test', function(cb) {
  var karma = path.resolve('node_modules', '.bin', 'karma');
  var configFile = path.resolve('karma.conf.js');

  child = childProcess.spawn(karma, ['start', configFile]);
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

// We put 'clean' as a dependency so that it completes before
// the other tasks are started
gulp.task('default', ['clean'], function() {
  // gulp.run will execute tasks concurrently
  gulp.run('test', 'jshint', 'js', 'assets');
});

// Build a release (minified version of the code)
gulp.task('release', ['clean'], function() {
  gulp.run('minify', 'assets');
});


gulp.task('watch', function() {
  gulp.watch(['scripts/**', 'assets/**', 'views/**', 'index.html', 'tests/**'], function() {
    gulp.run('default', 'test');
  });
});
