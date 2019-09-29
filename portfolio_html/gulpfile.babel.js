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
    return gulp.src(paths.images.src, { since: gulp.lastRun(images) })
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
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
    gulp.watch(paths.html.src, gulp.series('html'));
    gulp.watch(paths.styles.src, gulp.series('styles'));
    gulp.watch(paths.scripts.src, gulp.series('scripts'));
    gulp.watch(paths.images.src, gulp.series('images'));
}
//  production
export function watchFiles_prod() {
    gulp.watch(paths.html.src, gulp.series('html'));
    gulp.watch(paths.styles.src, gulp.series('styles_prod'));
    gulp.watch(paths.scripts.src, gulp.series('scripts_prod'));
    gulp.watch(paths.images.src, gulp.series('images'));
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
export default gulp.series(clean, gulp.parallel(html, styles, scripts, images), gulp.parallel(watchFiles, browsersync));
export const prod = gulp.series(clean, gulp.parallel(html, styles_prod, scripts_prod, images), gulp.parallel(watchFiles_prod, browsersync));
export const build = gulp.parallel(styles,scripts,images);
export const build_prod =  gulp.parallel(styles_prod,scripts_prod,images);