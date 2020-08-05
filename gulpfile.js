const gulp = require('gulp');
const useref = require('gulp-useref');
const cssnano = require('gulp-cssnano');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');

const server = browserSync.create();

gulp.task('build', function () {
    return gulp.src('./src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('build'))
        .pipe(server.reload({
            stream: true,
        }));
});

gulp.task('images', function () {
    return gulp.src('./src/assets/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('build/assets/'));
});

gulp.task('browserSync', function () {
    server.init({
        server: {
            baseDir: './build/',
        },
    });
});

function reload(done) {
    server.reload();
    done();
}
 
gulp.task('watch', gulp.series('images', 'build', function () {
    gulp.watch('./src/**/*.html', gulp.series('build', 'images', reload));
    gulp.watch('./src/scripts/**/*.js', gulp.series('build', reload));
    gulp.watch('./src/styles/**/*.css', gulp.series('build', 'images', reload));
}));

gulp.task('default', gulp.parallel('browserSync', 'watch'));
