# auto-build

gulp 前端自动化构建规则 demo


##集成工具
* 即时编译Less为Css
* 自动优化css浏览器前缀
* jlint 脚本检查
* js、css、image静态资源压缩
* 文件合并
* 生成css sprite 图片和样式映射
* requirejsBuild 合并模块


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
