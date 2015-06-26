# auto-build

gulp 前端自动化构建规则 demo


##配置资源路径
    {
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
    }
##命令工具
#####静态服务器 + 监视 less/html 文件
    gulp
    
#####发布
    gulp release
    
#####编译Less
    gulp less
    
#####压缩图片
    gulp images

#####生成css sprite 图片和样式表
    gulp sprite
