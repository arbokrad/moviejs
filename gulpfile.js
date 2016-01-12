var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['watch']);

gulp.task( 'test', function(){
  return gulp.src('spec/*.js').pipe(jasmine());
});

gulp.task('watch', function(){
  gulp.watch( 'js/*.js', ['test','build']);
});

gulp.task('build', function(){
  return gulp.src('./js/*.js')
    .pipe(concat('movieapp.js'))
    .pipe(gulp.dest('./js/dist'))
    .pipe(rename('movieapp.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist'));
});
