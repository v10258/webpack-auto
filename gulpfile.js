var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var spritesmith = require('gulp.spritesmith');

var paths = {
    dev: 'assets',
    css: 'assets/css/**/*.css',             // css 开发文件
    js: 'assets/js/**/*.js',                // js 开发文件
    img: 'assets/img/**/*.+(png|jpg|gif)',  // img 开发文件
    sprite: 'assets/img/**/**.png',         // 背景图片用于spritesheet转换
    less: 'less/**/*.less',                 // less 开发文件
    html: '*.html',                         // html 开发文件
    lessLib: 'less/lib',                    // less @import目录
    build: 'build',                         // release 构建目录
    devCss: 'assets/css'                    // less 生成指向css开发目录
};


// 检查脚本
gulp.task('lint', function() {
    console.log(plugins.util.colors.green('Linting'));

    return gulp.src(paths.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'));
});



// 压缩脚本
gulp.task('minify-js', function() {
    console.log(plugins.util.colors.green('Minify js'));

    return gulp.src(paths.js)
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.build + '/js'));
});


// 编译Less
gulp.task('less', function() {
    console.log(plugins.util.colors.green('Compile less into CSS'));

    return gulp.src(paths.less)
        .pipe(plugins.less({
            paths: paths.lessLib
        }))
        .pipe(gulp.dest(paths.devCss))
        .pipe(reload({
            stream: true
        }));
});

// 解析CSS文件并且添加浏览器前缀到CSS规则里
gulp.task('default', function() {
    console.log(plugins.util.colors.green('Autoprefixer'));

    return gulp.src(paths.css)
        .pipe(plugins.autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
        .pipe(paths.dev + '/css');
});

// 生成css sprite 图片和样式表
gulp.task('sprite', function() {
    console.log(plugins.util.colors.green('Sprite generation'));

    var spriteData = gulp.src(paths.sprite)
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));
    return spriteData.pipe(gulp.dest(paths.build));
});


// 压缩css
gulp.task('minify-css', function(e) {
    console.log(plugins.util.colors.green('Minify css to ' + paths.build));

    return gulp.src(paths.css)
        .pipe(plugins.minifyCss({
            compatibility: 'ie7'
        }))
        .pipe(gulp.dest(paths.build + '/css'));
});

// 压缩图片
gulp.task('images', function() {
    console.log(plugins.util.colors.green('Minify images'));

    gulp.src(paths.img)
        .pipe(plugins.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(paths.build + '/img'));
});


// 发布
gulp.task('release', function() {
    console.log(plugins.util.colors.green('Project release'));

    // js检查压缩
    gulp.src(paths.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.build + '/js'));

    // css前缀处理 压缩
    gulp.src(paths.css)
        .pipe(plugins.autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
        .pipe(plugins.minifyCss({
            compatibility: 'ie7'
        }))
        .pipe(gulp.dest(paths.build + '/css'));

    // css 图片压缩优化
    gulp.src(paths.img)
        .pipe(plugins.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(paths.build + '/img'));

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