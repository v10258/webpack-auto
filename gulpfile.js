var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var spritesmith = require('gulp.spritesmith');
var pngquant = require('imagemin-pngquant');

var paths = {
    src: 'assets', // css js img 开发目录
    less: 'less', // less 开发目录
    dist: 'dist', // release 发行目录
    html: '*.html' // html 页面
};

// 检查脚本
gulp.task('lint', function() {
    console.log(plugins.util.colors.green('Linting'));

    return gulp.src(paths.src + '/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'));
});


// 压缩脚本
gulp.task('minify-js', function() {
    console.log(plugins.util.colors.green('Minify js'));

    return gulp.src(paths.src + '/**/*.js')
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.dist));
});


// 合并脚本 ['minify-js']
gulp.task('concat', ['minify-js'], function() {
    console.log(plugins.util.colors.green('Concat files'));

    return gulp.src([paths.dist + '/**/*.js', '!' + paths.dist + '/js/all.js'])
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest(paths.dist + '/js'));
});


// 编译Less
gulp.task('less', function() {
    console.log(plugins.util.colors.green('Compile less into CSS'));

    gulp.src([paths.less + '/**/*.less', '!' + paths.less + '/lib/*.less'])
        .pipe(plugins.plumber())
        .pipe(plugins.less({
            paths: paths.less + '/lib'
        }))
        .pipe(gulp.dest(paths.src + '/css'))
        .pipe(reload({
            stream: true
        }));
});


// 解析CSS文件并且添加浏览器前缀到CSS规则里
gulp.task('autoprefixer', function() {
    console.log(plugins.util.colors.green('Autoprefixer'));

    return gulp.src(paths.src + '/**/*.css')
        .pipe(plugins.autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
        .pipe(paths.src);
});

// 压缩css
gulp.task('minify-css', ['autoprefixer'], function(e) {
    console.log(plugins.util.colors.green('Minify css to ' + paths.dist));

    return gulp.src(paths.src + '/**/*.css')
        .pipe(plugins.minifyCss({
            compatibility: 'ie7'
        }))
        .pipe(gulp.dest(paths.dist));
});

// 生成css sprite 图片和样式表
gulp.task('sprite', function() {
    console.log(plugins.util.colors.green('Sprite generation'));

    var spriteData = gulp.src(paths.src + '/**/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));
    return spriteData.pipe(gulp.dest(paths.dist + '/css'));
});

// 压缩图片
gulp.task('images', function() {
    console.log(plugins.util.colors.green('Minify images'));

    gulp.src(paths.src + '/**/*.+(png|jpg|gif)')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.dist));
});


// requirejs 本地合并
gulp.task('requirejsBuild', function() {
    plugins.requirejs({
        name: 'main',
        baseUrl: './assets/js',
        out: 'main-built.js'
    })
    .pipe(gulp.dest(paths.dist + '/delpoy'));
});



// 发布
gulp.task('release', function() {
    console.log(plugins.util.colors.green('Project release'));

    // js检查压缩
    gulp.src(paths.src + '/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.dist));

    // css前缀处理 压缩
    gulp.src(paths.src + '/**/*.css')
        .pipe(plugins.autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
        .pipe(plugins.minifyCss({
            compatibility: 'ie7'
        }))
        .pipe(gulp.dest(paths.dist));

    // css 图片压缩优化
    gulp.src(paths.src + '/**/*.+(png|jpg|gif)')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.dist));

});


// 静态服务器 + 监视 less/html 文件
gulp.task('serve', ['less'], function() {

    browserSync({
        server: './'
    });

    gulp.watch('less/**/*.less', ['less']);
    gulp.watch(paths.html).on('change', reload);
});


// 默认任务
gulp.task('default', ['serve']);