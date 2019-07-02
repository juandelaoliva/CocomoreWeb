'use strict';

/*
 install the latest Gulp 4 CLI tools globally
 $ sudo npm install gulpjs/gulp-cli -g

 install Gulp 4 into your project
 $ sudo npm install gulpjs/gulp.git#4.0 --save-dev

 Install the rest:

 $ sudo npm install gulp-sass gulp-autoprefixer gulp-css-globbing gulp-imagemin imagemin-pngquant gulp-group-css-media-queries gulp-plumber gulp-concat gulp-uglify gulp-clean-css browser-sync --save-dev

 and then you can start the gulp process in the theme folder with: $ gulp
 */

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    autoprefixer = require('gulp-autoprefixer'),
    cmq = require('gulp-group-css-media-queries'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    hb = require('gulp-hb'),
    del = require('del'),
    frontMatter = require('gulp-front-matter'),
    data = require('gulp-data'),
    sourcemaps = require('gulp-sourcemaps'),
    serve = require('gulp-serve');


/* Campaign Setting */
let dev_flag = true,
    img_url_dev = '',
    img_url_prod = '';


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

gulp.task('serve',serve('app'));


gulp.task('copy_images', function () {
    return gulp.src('./app' + img_url_dev + '**/*.{png,jpg,svg}')
        .pipe(plumber())
        .pipe(gulp.dest('./dist' + img_url_prod));
});

gulp.task('sass', function () {
    return gulp
        .src('./app/sass/*.scss', {base: './app/sass/'})
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(globbing({
            extensions: ['.scss']
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 3 versions', 'ie 11']
        }))
        .pipe(cmq())
        .pipe(cleanCSS({processImport: false, advanced: false, mediaMerging: false, restructuring: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function () {
    return gulp
        .src([
            './app/sass/**/fonts/*.eot',
            './app/sass/**/fonts/*.svg',
            './app/sass/**/fonts/*.ttf',
            './app/sass/**/fonts/*.woff'
        ])
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('scripts', function () {
    // getting the scripts by the order, if there are dependencies, order with numbers: 00_dependency, 01_script.
    return gulp.src(['./app/js/**/*.js'])
        .pipe(concat('cocomore_customs.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.stream());
});

gulp.task('hb', function () {
    return gulp.src('./app/hb/*.html')
    // Load an associated JSON file per post.
        .pipe(data((file) => {
            return require(file.path.replace('.html', '.json'));
        }))    // Parse front matter from post file.
        .pipe(frontMatter({
            property: 'data.frontMatter'
        }))
        .pipe(hb({debug: dev_flag})
            .data('./app/hb/data/**/*.json')
            .helpers('./app/hb/helpers/**/*.js')
            .helpers({
                img_url: function (img_name) {
                    if (dev_flag) {
                        return img_url_dev + img_name + "?cachebuster=" + getRandomInt("00000000", "99999999");
                    }
                    else {
                        return img_url_prod + img_name + "?cachebuster=" + getRandomInt("00000000", "99999999");
                    }

                }
            })
            .helpers({
                cachebuster: function (linkurl) {
                    return linkurl + "?cachebuster=" + getRandomInt("00000000", "99999999");
                }
            })
            .partials('./app/hb/partials/**/*.hbs')
        )
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
});

function watch() {
    browserSync.init({
        server: './dist/'
    });
    gulp.watch('./app/hb/**/*.{html,json,js,hbs}', gulp.series('clean', 'hb'));
    gulp.watch('./app/sass/**/*.scss', gulp.series('cleancss', 'sass'));
    gulp.watch(['./app/js/**/*.js'], gulp.series('scripts'));
    gulp.watch('./app/**/*.html').on('change', browserSync.reload);
}



gulp.task('clean', function () {
    return del([
        './dist/*.html'
    ]);
});
gulp.task('cleancss', function () {
    return del([
        './dist/css/*.css'
    ]);
});

gulp.task('build', gulp.series('clean', 'fonts', 'sass', 'hb', 'scripts', 'copy_images'));
gulp.task('images', gulp.series('copy_images'));

gulp.task('watch', watch);
gulp.task('default', gulp.series('hb', ['build', 'watch']));
