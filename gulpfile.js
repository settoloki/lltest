const gulp = require('gulp');
const gutil = require('gulp-util');
const bower = require('bower');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const sh = require('shelljs');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const pump = require('pump');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const strip = require('gulp-strip-comments');


const paths = {
    sass: ['./scss/**/*.scss'],
    js:
        [
            './js/app.js',
            './js/services/*.js',
            './js/filters/*.js',
            './www/templates/directives/*.js',
            './js/controllers/*.js'
        ],
    lib:
        [
            './www/lib/ionic/js/ionic.bundle.js',
            './www/lib/ngCordova/dist/ng-cordova.js',
            './www/lib/slick-carousel/slick/slick.js',
            './www/lib/angular-slick/dist/slick.js',
            './www/lib/ng-dialog/js/ngDialog.js',
            './www/lib/angular-messages/angular-messages.js',
            './www/lib/angular-scroll-glue/src/scrollglue.js',
            './www/lib/angulartics/src/angulartics.js',
            './www/lib/angulartics/src/angulartics-debug.js',
            './js/vendors/angulartics-quantcast/angulartics-quantcast.js',
            './js/vendors/angulartic-google/angulartics-ga.js',
            './js/vendors/angulartics-facebook-pixel/angulartics-facebook-pixel.js',
            './js/vendors/angulartic-google/angulartics-ga-cordova-google-analytics-plugin.js',
            './www/lib/photon-chat/Photon/3rdparty/swfobject.js',
            './www/lib/photon-chat/Photon/3rdparty/web_socket.js',
            './www/lib/photon-chat/Photon/Photon-Javascript_SDK.js',
            './www/lib/howler.js/dist/howler.js',
            './js/facebookConnectPlugin.js',
            './www/lib/angular-upload/angular-upload.js',
            './www/lib/angular-facebook/lib/angular-facebook.js',
            './www/lib/angular-facebook/lib/angular-facebook-phonegap.js'
        ]
};

gulp.task('default', ['install', 'sass', 'js', 'lib']);


gulp.task('watch-js', function () {
    gulp.watch(paths.js, ['js']);
});

gulp.task('watch-sass', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('watch', ['watch-js', 'watch-sass']);

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});


gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(rename({basename: 'live-lotto', extname: '.min.css'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass())
        .pipe(gulp.dest('./www/dist/css/'))
        .on('error', sass.logError)
        // .pipe(minifyCss({
        //     keepSpecialComments: 0
        // }))
        .pipe(sourcemaps.write('../maps'))
        .on('end', done);
});

gulp.task('js', function (done) {
        gulp.src(paths.js, {base: 'src'})
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(concat('live-lotto.js'))
        .pipe(gulp.dest('./www/build/js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./www/dist/js/'))
        .on('end', done);
});

gulp.task('lib', function (done) {
        gulp.src(paths.lib, {base: 'src'})
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./www/build/js'))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./www/dist/js/'))
        .on('end', done);
});

gulp.task('serve:before', ['watch']);
