

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();


var path = require('path');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var paths = {
    css: 'assets/css/**/*.css',             // css 开发文件
    js: 'assets/js/**/*.js',            // js 开发文件
    less: 'less/**/*.less',             // less 开发文件
    html: '*.html',                     // html 开发文件
    lessLib: 'less/lib',                // less @import目录
    build: 'build',                     // release 构建目录
    devCss: 'assets/css'                // less 生成指向css开发目录
};


// 检查脚本
gulp.task('lint', function(){
	return gulp.src(paths.js)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'));
});



// 压缩脚本
gulp.task('minify-js', function(){
    gulp.src(paths.js)
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.build + '/js'));
});

// 压缩css
gulp.task('minify-css', function(e) {
    console.log(e, 'Minify css to ' + paths.build);

    return gulp.src(paths.css)
        .pipe(plugins.minifyCss({
            compatibility: 'ie7'
        }))
        .pipe(gulp.dest(paths.build + '/css'));
});

// 压缩图片

// 编译Less
gulp.task('less', function() {
    console.log('Compile less into CSS');

    return gulp.src(paths.less)
        .pipe(plugins.less({
            paths: [ path.join(__dirname, paths.lessLib)]
        }))
        .pipe(gulp.dest(paths.devCss))
        .pipe(reload({stream: true}));
});

// 发布
gulp.task('release', function(){
    gulp.src(paths.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.build));
});


// 静态服务器 + 监视 less/html 文件
gulp.task('serve', ['less'], function() {

    browserSync({
        server: './'
    });

    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.html).on('change', reload);
});


// 默认任务
gulp.task('default', ['serve']);