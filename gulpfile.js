var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
reload = browserSync.reload,
autoprefixer = require('gulp-autoprefixer'),
browserify = require('gulp-browserify'),
clean = require('gulp-clean'),
concat = require('gulp-concat'),
merge = require('merge-stream'),
newer = require('gulp-newer'),
imagemin = require('gulp-imagemin');

// PATHS
var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*.html',
  jsSource : 'src/js/**',
  imgSource : 'src/img/**'
}

var APPPATH = {
  root: 'app/',
  css : 'app/css',
  js : 'app/js',
  fonts : 'app/fonts',
  img : 'app/img'
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
  var bootstrapCSS  = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  // var sassFiles;
  var sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({ outputStyle: 'expanded' })
    .on('error', sass.logError))
    return merge(bootstrapCSS, sassFiles)
      .pipe(concat('app.css'))
      .pipe(gulp.dest(APPPATH.css));
});

// Image Tasks
gulp.task('images', function() {
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img))
});

// Move BootStrap Fonts
gulp.task('moveFonts', function() {
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('scripts', ['clean-scripts'], function() {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
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

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts', 'images'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

gulp.task('default', ['watch']);
