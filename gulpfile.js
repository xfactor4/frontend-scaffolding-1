var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');

var browserSync = require('browser-sync');
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(plumber(onError))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe($.wrapCommonjs({
      relativePath: 'app/scripts',
      pathModifier: function (path) {
        return path.replace(/.js$/, '');
      }
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(reload({stream: true}));
});

gulp.task('templates', function(){
  gulp.src('app/templates/**/*.hbs')
    .pipe(plumber())
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'JST',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(reload({stream: true}));
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function() {
  del('dist');
  return cache.clearAll(callback);
});

gulp.task('clean:dist', function(callback){
  del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

gulp.task('useref', function(){
  var assets = useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', minifyCSS()))
    // Uglifies only if it's a Javascript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

gulp.task('browserSync', function() {
  browserSync({
    open: false,
    server: {
      baseDir: 'app'
    },
  })
});

// gulp.task('build', ['scripts', 'templates', 'styles'], function(){});
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
//   gulp.watch('templates/**/*.hbs', ['templates']);
//   gulp.watch('scripts/**/*.js', ['scripts']);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'], callback);
});

function onError(error){
  gutil.log(gutil.colors.red(error.message));
  this.emit('end');
}
