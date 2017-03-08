module.exports = {
    gulp: {
        sassPath: ['./public/**/**/*.scss', './public/**/*.scss', '!./public/reset.scss'],
        imgPath: ['./public/**/img/*.*', './public/**/img/**/*.*'],
        spriteImgPath: ['./public/**/img/*.png', './public/**/img/**/*.png'],
        bowerDir: './bower_components',
        jsPath: ['./public/**/**/*.js', './public/**/**/**/*.js', '!./public/*.min.js', '!./public/**/**/*.min.js'],
        htmlPath: ['./views/**/*.html', './views/**/**/*.html'],
        destCssPath: ['./dest/**/**/*.css'],
        destPath: './dest/'
    }
}