'use strict';
var path = require('path');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var concat = require('gulp-concat');
var $ = require('gulp-load-plugins')({ lazy: true });
var runSequence = require('run-sequence');
var config = {
    src:'src',
    dist:'dist'
};
var fileinclude = require('gulp-file-include');

var reload = browserSync.reload;
function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}
//main
gulp.task('default', function () {
    runSequence(
        'clean',
        'js',
        ['fonts','img', 'css',],
        'html',
        'web-server',
        'watch'
    );
});

gulp.task('clean', function () {
    return del([
        '!' + config.dist + '/',
        config.dist + '/*'
    ]);
});

gulp.task('web-server', function () {
    browserSync.init({
        server: {
            baseDir: config.dist
        }
    });

});

gulp.task('watch', function () {
    gulp.watch([config.src + '/img/**/**'], ['img', reload]);
    gulp.watch([config.src + '/fonts/**/**'], ['fonts', reload]);

    gulp.watch([config.src + '/css/**/*.css'], ['css', reload]);
    gulp.watch([config.src + '/view/**/*.html'], ['html', reload]);
    gulp.watch([config.src + '/js/**/**'], ['js', reload]);
});


gulp.task('js', function () {
    return gulp
        .src([
            config.src + '/js/**/**'
        ])
        .pipe($.plumber({ errorHandler: swallowError }))
        // .pipe(gulp.dest(config.dist + '/js'))
        //.pipe($.uglify())
        // .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dist + '/js'))
});

gulp.task('html', function () {
    return gulp
        .src([
            config.src + '/view/**/**'
        ]).pipe(fileinclude({
            context:{
                "highLigh":""
            }
        }))
        .on('error',function(error){
            console.log(error);
            this.emit('end');
        })
        .pipe($.plumber({ errorHandler: swallowError }))
        .pipe(gulp.dest(config.dist))
});

gulp.task('css', function () {
    gulp
        .src(config.src+'/css/**/**')
        //.pipe($.less())
        // .pipe($.autoprefixer([//浏览器兼容，自动css前缀
        //     'ie >= 8',
        //     'ff >= 30',
        //     'chrome >= 34',
        //     'safari >= 7',
        //     'opera >= 23',
        //     'ios >= 6',
        //     'android >= 2.2',
        //     'bb >= 10'
        // ]))
        // .pipe(gulp.dest(config.dist + '/css'))
        //.pipe($.cssnano())
        // .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dist + '/css'))
});

gulp.task('img', function () {
    return gulp
        .src([
            config.src + '/img/**/**'
        ])
        .pipe($.plumber({ errorHandler: swallowError }))
        //todo 
        .pipe(gulp.dest(config.dist + '/img'));
});

gulp.task('fonts', function () {
    return gulp
        .src([
            config.src + '/fonts/**/**'
        ], { base: config.src + '/fonts' })
        .pipe($.plumber({ errorHandler: swallowError }))
        .pipe(gulp.dest(config.dist + '/fonts'));
});