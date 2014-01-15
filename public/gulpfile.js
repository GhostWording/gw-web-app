var gulp = require('gulp');
var gUtil = require('gulp-util');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var ignore = require('gulp-ignore');

gulp.task('clean', function() {
  return gulp.src('build', { read: false })
  .pipe(rimraf());
});

gulp.task('js', function() {
  gulp.src(['scripts/**/*.js'])
  .pipe(ignore('scripts/wp8viewport.js'))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('build/scripts'));

  gulp.src(['scripts/wp8viewport.js'])
  .pipe(gulp.dest('build/scripts'));
});

gulp.task('assets', function() {
  gulp.src(['assets/**/*'])
  .pipe(gulp.dest('build/assets'));

  gulp.src(['views/**/*'])
  .pipe(gulp.dest('build/views'));
});

gulp.task('index', function() {
  gulp.src(['index.html'])
  .pipe(gulp.dest('build'));
});

gulp.task('default', ['clean'], function() {
  gulp.run('js');
  gulp.run('assets');
  gulp.run('index');
});