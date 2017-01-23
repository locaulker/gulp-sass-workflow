var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
reload = browserSync.reload,
autoprefixer = require('gulp-autoprefixer'),
clean = require('gulp-clean'),
concat = require('gulp-concat');

// PATHS
var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*.html',
  jsSource : 'src/js/**/*.js'
}

var APPPATH = {
  root: 'app/',
  css : 'app/css',
  js : 'app/js'
}

// Clean - Remove html files deleted in "src" from "app" folder also
gulp.task('clean-html', function() {
  return gulp.src(APPPATH.root + '/*.html', { read: false, force: true })
    .pipe(clean());
});

// Clean - Remove JS files deleted in "src" from "app" folder also
gulp.task('clean-scripts', function() {
  return gulp.src(APPPATH.js + '/*.js', { read: false, force: true })
    .pipe(clean());
});

//SASS Task - Compile SCSS Files to CSS Files
gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass(
        {
          outputStyle: 'expanded'
        }).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));
});

gulp.task('scripts', ['clean-scripts'], function() {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(APPPATH.js))
});

// Copy Task - Copy HTML Filese from src to app
gulp.task('copy', ['clean-html'], function() {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});

// Server Task
gulp.task('serve', ['sass'], function() {
  browserSync.init(
    [ APPPATH.css + '/*.css',
      APPPATH.root + '/*.html',
      APPPATH.js + '/*.js' ],
  {
    notify: false,
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

gulp.task('default', ['watch']);
