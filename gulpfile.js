/*
 * Gulp plugins
 */
var gulp         = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var babel        = require('gulp-babel');
var browserSync  = require('browser-sync');
var cache        = require('gulp-cache');
var concat       = require('gulp-concat');
var declare      = require('gulp-declare');
var del          = require('del');
var ghPages      = require('gulp-gh-pages');
var gulpIf       = require('gulp-if');
var gutil        = require('gulp-util');
var handlebars   = require('gulp-handlebars');
var imagemin     = require('gulp-imagemin');
var minifyCSS    = require('gulp-minify-css');
var plumber      = require('gulp-plumber');
var runSequence  = require('run-sequence');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var useref       = require('gulp-useref');
var wiredep      = require('wiredep').stream;
var wrap         = require('gulp-wrap');
var wrapCommonjs = require('gulp-wrap-commonjs');

gulp.task('styles', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(plumber(onError))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(wrapCommonjs({
      relativePath: 'app/scripts',
      pathModifier: function (path) {
        return path.replace(/.js$/, '');
      }
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('.tmp/scripts/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('templates', function() {
  gulp.src('app/templates/**/*.hbs')
    .pipe(plumber())
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'JST',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('.tmp/scripts/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(plumber())
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function(done) {
  del('dist').then(function(paths){
    console.log('Deleted files/folders:\n', paths.join('\n'));
    cache.clearAll(done);
  });
});

gulp.task('clean:dist', function(done){
  del(['dist/**/*', '!dist/images', '!dist/images/**/*']).then(function (paths) {
    console.log('Deleted files/folders:\n', paths.join('\n'));
    done();
  });
});

gulp.task('useref', function(){
  var assets = useref.assets({searchPath: ['.tmp', 'app', '.']});

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

// inject bower components
gulp.task('wiredep', function() {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/,
      exclude: [ 'bower_components/modernizr/modernizr.js' ]
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('browserSync', function() {
  browserSync({
    open: false,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
  });
});

gulp.task('watch', ['browserSync', 'styles'], function(){
  gulp.watch('app/scss/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/templates/**/*.hbs', ['templates']);
  gulp.watch('app/images/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/*.html', ['useref']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['styles', 'scripts', 'templates', 'wiredep', 'useref', 'images', 'fonts'],
    callback
  );
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', function (callback) {
  runSequence(['styles', 'scripts', 'templates', 'wiredep', 'useref', 'browserSync', 'watch'], callback);
});

function onError(error){
  gutil.log(gutil.colors.red(error.message));
  this.emit('end');
}
