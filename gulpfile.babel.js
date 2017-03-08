'use strict'

import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import jshint from 'gulp-jshint';
import imagemin from 'gulp-imagemin';
//import clean from 'gulp-clean';
import cache from 'gulp-cache';
//import cleancss from 'gulp-clean-css';
import cssnano from 'gulp-cssnano';
import notify from "gulp-notify";
import bower from 'gulp-bower';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import rev from 'gulp-rev';
import del from 'del';
import revCollector from 'gulp-rev-collector';
import minifyHTML from 'gulp-minify-html';
import runSequence from 'run-sequence';
import spritesmith from 'gulp.spritesmith';
import gutil from 'gulp-util';
import webpack from 'webpack-stream';
import replace from 'gulp-replace';
import { gulp as config } from './config';

//清理导出项目的文件
gulp.task('clean', (cb) => {
    var delPaths = config.destPath;
    del(delPaths).then((path) => {
        cb();
    })
})

//检查js语法并压缩js
gulp.task('js', () => {
    return gulp.src(config.jsPath)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', function(err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
            this.emit('end');
        }))
        .pipe(gulp.dest(config.destPath))
});

gulp.task('js-dev', () => {
    return gulp.src(config.jsPath)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserSync.stream());
});

//编译scss并自动添加前缀、压缩css，
gulp.task('css', () => {
    return gulp.src(config.sassPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }))
        .pipe(cssnano())
        .pipe(gulp.dest(config.destPath))
        .pipe(browserSync.stream());
});

gulp.task('css-dev', () => {
    return gulp.src(config.sassPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'] }))
        .pipe(cssnano())
        .pipe(gulp.dest(config.destPath))
        .pipe(browserSync.stream());
});

//生成雪碧图
gulp.task('sprite', () => {
    var spriteData = gulp.src(config.spriteImgPath)
        .on('data', function(file) {
            console.log(file.history[0])
        })
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss'
        }));
    return spriteData.pipe(gulp.dest('./'));
});

gulp.task('replace', () => {
    var repPath = config.htmlPath.concat(config.destCssPath)
    gulp.src(repPath)
        .pipe(replace('/public/', '/dest/'))
        .pipe(gulp.dest(config.destPath));
})

// 图片压缩
gulp.task('images', ['sprite'], () => {
    return gulp.src(config.imgPath)
        .pipe(imagemin({ optimizationLevel: 4, progressive: true, interlaced: true })) //压缩图片
        // 如果想对变动过的文件进行压缩，则使用下面一句代码
        // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))) 
        .pipe(gulp.dest(config.destPath));
});

//默认任务
gulp.task('build', function(done) {
    if (process.env.NODE_ENV == "prod") {
        runSequence(
            ['clean'], ['css'], ['js'], ['images'], ['replace'], ['serve'], done);
    } else {
        runSequence(
            ['clean'], ['css-dev'], ['js-dev'], ['serve-dev'], done);
    }

});

gulp.task('serve-dev', () => {
    browserSync({
        server: {
            baseDir: './',
        },
        port: 8888,
        open: false
    });
    gulp.watch(config.sassPath, ['css-dev']);
    gulp.watch(config.jsPath, ['js-dev']).on('change', browserSync.reload);
    gulp.watch("./views/**/*.html").on('change', browserSync.reload);
});

gulp.task('serve', () => {
    browserSync({
        server: {
            baseDir: './',
        },
        port: 8888,
        open: false
    });
});

gulp.task('default', ['build']);