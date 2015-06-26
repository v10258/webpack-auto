# auto-build

gulp 前端自动化构建规则 demo


##配置资源路径
    paths = {
        src: 'assets',          // css js img 开发目录
        less: 'less',           // less 开发目录
        dist: 'dist',           // release 发行目录
        html: '*.html'          // html 页面
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
