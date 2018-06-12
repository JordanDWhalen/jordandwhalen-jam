let gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    globbing = require('gulp-css-globbing'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    flatten = require('gulp-flatten'),
    newer = require('gulp-newer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    open = require('gulp-open'),
    browserSync = require('browser-sync')
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    child = require('child_process'),
    util = require('gulp-util'),
    devTasks = ['styles', 'vendor-js', 'js', 'images', 'resources', 'browser-sync', 'watch'],
    prodTasks = ['prod-styles', 'prod-vendor-js', 'prod-js', 'prod-images', 'prod-resources'];

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: blue">Running:</span> $ jekyll build'
};

// Dev tasks

gulp.task('styles', function() {
    return gulp.src('_styles/application.scss')
      .pipe(flatten())
      .pipe(sourcemaps.init())
      .pipe(globbing({extensions: '.scss'}))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer({cascade: false}))
      .pipe(sourcemaps.write())
      .on('error', handleError)
      .pipe(gulp.dest('assets/styles'))
});

gulp.task('vendor-js', () => {
  return gulp.src([
    '_js/vendor/**/*.js',
  ])
  .pipe(concat('application-vendor.js'))
  .pipe(uglify())
  .on('error', handleError)
  .pipe(gulp.dest('assets/js'))
});

gulp.task('js', () => {
  return gulp.src([
    '_js/scripts/**/*.js',
  ])
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
  .on('error', handleError)
  .pipe(concat('application.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('assets/js'))
});

gulp.task('images', () => {
  return gulp.src('_raw-assets/images/**/*.{jpg,jpeg,png,gif,ico,svg}')
    .pipe(flatten())
    .pipe(newer('assets/images'))
    .pipe(imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true,
        svgoPlugins: []
    }))
    .on('error', handleError)
    .pipe(gulp.dest('assets/images'))
});

gulp.task('resources', () => {
  return gulp.src('_raw-assets/resources/**/*')
    .pipe(flatten())
    .pipe(newer('assets/resources'))
    .on('error', handleError)
    .pipe(gulp.dest('assets/resources'))
});

gulp.task('jekyll-build', function (done) {

    browserSync.notify(messages.jekyllBuild);
    return child.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);

});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['styles', 'vendor-js', 'js', 'images', 'resources', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

gulp.task('watch', function() {
    gulp.watch(['_styles/**/*.scss'], ['styles']);
    gulp.watch(['_js/scripts/**/*.js'], ['js']);
    gulp.watch(['_js/vendor/**/*.js'], ['vendor-js']);
    gulp.watch(['_raw-assets/resources/**/*.{jpg,jpeg,png,gif,ico,svg}'], ['images']);
    gulp.watch(['_raw-assets/resources/**/*', '!src/assets/resources/**/*.{jpg,jpeg,png,gif,ico,svg}'], ['resources']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});


// Production Tasks

gulp.task('prod-styles', () => {
    return gulp.src('_styles/application.scss') // IMPORT ANY OTHER VENDOR LIBS FROM THAT SRC FILE
      .pipe(flatten())
      .pipe(globbing({extensions: '.scss'}))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer({cascade: false}))
      .on('error', handleError)
      .pipe(gulp.dest('assets/styles'))
});

gulp.task('prod-vendor-js', () => {
  return gulp.src([
    '_js/vendor/**/*.js',
  ])
  .pipe(concat('application-vendor.js'))
  .pipe(uglify())
  .on('error', handleError)
  .pipe(gulp.dest('assets/js'))
});

gulp.task('prod-js', () => {
  return gulp.src([
    '_js/scripts/**/*.js',
  ])
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
  .on('error', handleError)
  .pipe(concat('application.js'))
  .pipe(gulp.dest('assets/js'))
});

gulp.task('prod-images', () => {
  return gulp.src('_raw-assets/images/**/*.{jpg,jpeg,png,gif,ico,svg}')
    .pipe(flatten())
    .pipe(newer('assets/images'))
    .pipe(imagemin({
        optimizationLevel: 10,
        progressive: true,
        interlaced: true,
        svgoPlugins: []
    }))
    .on('error', handleError)
    .pipe(gulp.dest('assets/images'))
});

gulp.task('prod-resources', () => {
  return gulp.src('_raw-assets/resources/**/*')
    .pipe(flatten())
    .pipe(newer('assets/resources'))
    .on('error', handleError)
    .pipe(gulp.dest('assets/resources'))
});

// Error reporting function
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('default', devTasks);
gulp.task('prod', prodTasks);