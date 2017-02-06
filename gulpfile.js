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
imagemin = require('gulp-imagemin'),
injectPartials = require('gulp-inject-Partials');


// PATHS
var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*.html',
  htmlPartialSource : 'src/partial/*.html',
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
  return gulp.src(APPPATH.root + '/*.html', {read: false, force: true })
    .pipe(clean());
});


// Clean - Remove JS files deleted in "src" from "app" folder also
gulp.task('clean-scripts', function() {
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true })
    .pipe(clean());
});


//SASS Task - Compile SCSS Files to CSS Files
gulp.task('sass', function() {
  var bootstrapCSS  = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  // var sassFiles;
  var sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 2
    }).on('error', sass.logError))
    return merge(bootstrapCSS, sassFiles)
    // app.css => styles.css
      .pipe(concat('styles.css'))
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


//Scripts Tasks
gulp.task('scripts', ['clean-scripts'], function() {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(APPPATH.js))
});


// Inject Partials Task
gulp.task('html', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(APPPATH.root))
})

/*
// Copy Task - Copy HTML Filese from src to app
gulp.task('copy', ['clean-html'], function() {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});
*/


// browserSync Server Task
// serve => browserSync
gulp.task('browserSync', ['sass'], function() {
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


gulp.task('watch', ['browserSync', 'sass', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts', 'images', 'html'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  //gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html', 'clean-html']);
});


gulp.task('default', ['watch']);
