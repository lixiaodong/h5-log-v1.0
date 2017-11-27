var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var connect = require("gulp-connect");
var less = require("gulp-less");
var autoprefixer = require('gulp-autoprefixer');
var ejs = require("gulp-ejs");
var uglify = require('gulp-uglify');
var ext_replace = require('gulp-ext-replace');
var cssmin = require('gulp-cssmin');

var pkg = require("./package.json");

var banner = 
"/** \n\
* jQuery mgui V" + pkg.version + " \n\
* By 蘑菇云前端团队\n\
* http://lihongxun945.github.io/jquery-mgui/\n \
*/\n";

gulp.task('js', function(cb) {

  count = 0;
  var end = function(){
    count ++;
    if(count >= 3) cb();
  };
  gulp.src([
    './src/js/extend.js',
    './src/js/main.js',

  ])
    .pipe(concat({ path: 'h5-log.js'}))
    .pipe(header(banner))
    .pipe(gulp.dest('./dist/js/'))
    .on("end", end);

  
});

gulp.task('uglify', ["js"], function() {
  return gulp.src(['./dist/js/*.js', '!./dist/js/*.min.js'])
    .pipe(uglify({
      preserveComments: "license"
    }))
    .pipe(ext_replace('.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('less', function () {
  return gulp.src(['./src/less/h5-log.less'])
  .pipe(less())
  .pipe(autoprefixer())
  .pipe(header(banner))
  .pipe(gulp.dest('./dist/css/'));
});

gulp.task('cssmin', ["less"], function () {
  gulp.src(['./dist/css/*.css', '!./dist/css/*.min.css'])
    .pipe(cssmin())
    .pipe(header(banner))
    .pipe(ext_replace('.min.css'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('ejs', function () {
  return gulp.src(["./demos/*.html", "!./demos/_*.html"])
    .pipe(ejs({}))
    .pipe(gulp.dest("./dist/demos/"));
});

gulp.task('copy', function() {
  gulp.src(['./src/lib/**/*'])
    .pipe(gulp.dest('./dist/lib/'));

  gulp.src(['./demos/images/*.*'])
    .pipe(gulp.dest('./dist/demos/images/'));

  gulp.src(['./demos/css/*.css'])
    .pipe(gulp.dest('./dist/demos/css/'));
});

gulp.task('watch', function () {
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/less/**/*.less', ['less']);
  gulp.watch('demos/*.html', ['ejs']);
  gulp.watch('demos/css/*.css', ['copy']);
});

gulp.task('server', function () {
  connect.server();
});
gulp.task("default", ['watch', 'server']);
gulp.task("build", ['uglify', 'cssmin', 'copy', 'ejs']);