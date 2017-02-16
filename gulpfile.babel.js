/**
 * tasks - dev, prod, sprite
 * 詳しくはREADME.mdを参照
 */
// todo: svg、iconfontタスクのパスをconigに移植
// todo: eslintの調整
// todo: stylelintの調整

/* js plugin */
import gulp    from 'gulp';

/* css plugin */
import sass         from 'gulp-sass';
import postcss      from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import reporter     from 'postcss-reporter'; // ログ整形

/* img plugin */
import path from 'path';

/* common plugin */
import rename     from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import plumber    from 'gulp-plumber';
import notify     from 'gulp-notify';

gulp.task('cssDev', () => {
  const processors = [
    // stylelint(stylelintrc),
    // doiuse({browsers: conf.browsers, ignore: conf.ignores}),
    autoprefixer(),
    reporter()
  ];

  return gulp.src('app/assets_dev/src/scss/entry/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(rename(path => {
       path.extname = '.css';
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/assets_dev/build/css/'))
    .pipe(notify('Scss Finished'));
});

gulp.task('watchCss', () => {
  gulp.watch('app/assets_dev/src/scss/**/*.scss', ['cssDev']);
});
