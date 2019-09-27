//**************************************************
//  Plugin
//**************************************************
import gulp from 'gulp';
import babel from 'gulp-babel';

import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css';

import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackDev from './webpack.dev';
import webpackProd from './webpack.Prod';

import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';

import browserSync  from 'browser-sync';
import del from 'del';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import debug from 'gulp-debug';
sass.compiler = require('node-sass');

const paths = {
    html: {
        src: './src/**/*.html',
        dest: './dist',
    },
    styles: {
        src: './src/sass/**/*.scss',
        dest: './dist/assets/css'
    },
    scripts: {
        src: './src/js/**/*.js',
        dest: './dist/assets/js'
    },
    images: {
        src: './src/images/*.{jpg,jpeg,png,svg,gif}',
        dest: './dist/assets/images'
    }
};

//**************************************************
//  del
//**************************************************
const clean = () => del([ 'dist/assets' ]);
export { clean };
//**************************************************
//  HTML
//**************************************************
export function html() {
    return gulp.src(paths.html.src)
    .pipe(browserSync.stream())
    .pipe(gulp.dest(paths.html.dest));
}
//**************************************************
//  Styles
//**************************************************
export function styles() {
    return gulp.src(paths.styles.src, { sourcemaps: true })
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest(paths.styles.dest, { sourcemaps: './map'}))
        .pipe(browserSync.stream());
}
//  Production
export function styles_prod() {
    return gulp.src(paths.styles.src)
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}
//**************************************************
//  Scripts
//**************************************************
export function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(webpackStream(webpackDev, webpack))
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
        .pipe(gulp.dest(paths.scripts.dest, { sourcemaps: './map'}))
        .pipe(browserSync.stream());
}
//  Production
export function scripts_prod() {
    return gulp.src(paths.scripts.src)
        .pipe(webpackStream(webpackProd, webpack))
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}
//**************************************************
//  images
//**************************************************
export function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin([
            pngquant({
                quality: [.65, .8]
            }),
            mozjpeg({
                quality: 85
            }),
            imagemin.svgo(),
            imagemin.optipng(),
            imagemin.gifsicle()
        ]
        ))
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
}
//**************************************************
//  Watch
//**************************************************
export function watchFiles() {
    gulp.watch(paths.html.src, gulp.task('html'));
    gulp.watch(paths.styles.src, gulp.task('styles'));
    gulp.watch(paths.scripts.src, gulp.task('scripts'));
    gulp.watch(paths.images.src, gulp.task('images'));
}

export function watchFiles_prod() {
    gulp.watch(paths.html.src, gulp.task('html'));
    gulp.watch(paths.styles.src, gulp.task('styles_prod'));
    gulp.watch(paths.scripts.src, gulp.task('scripts_prod'));
    gulp.watch(paths.images.src, gulp.task('images'));
}
//**************************************************
//  Browawer-sync
//**************************************************
export function browsersync() {
    browserSync({
        server: {
            baseDir: "./dist",
        }
    });
}
//**************************************************
//  Task
//**************************************************
gulp.task('dev', gulp.series(clean, gulp.parallel(html, styles, scripts, images, watchFiles, browsersync)));
gulp.task('prod', gulp.series(clean, gulp.parallel(html, styles_prod, scripts_prod, images, watchFiles_prod, browsersync)));
gulp.task('clean', gulp.series(clean));
gulp.task('build', gulp.parallel(styles,scripts,images));
gulp.task('build_prod', gulp.parallel(styles_prod,scripts_prod,images));
gulp.task('styles',gulp.series(styles));
gulp.task('styles_prod',gulp.series(styles_prod));
gulp.task('scripts', gulp.series(scripts));
gulp.task('scripts_prod', gulp.series(scripts_prod));
gulp.task('images', gulp.series(images));