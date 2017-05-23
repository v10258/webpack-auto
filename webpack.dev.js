const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: {
    vendor: ['lodash']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.ejs$/,
      use: 'ejs-compiled-loader'
    }, {
      test: /\.js$/,
      use: 'babel-loader'
    }, {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]'
        }
      }]
    },{
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: 'font/[name].[ext]'
        }
      }]
    }]
  },
  plugins: [
    // 页面集成
    new HtmlWebpackPlugin(),
    // 抽出公共文件vendor依赖，manifest运行时信息
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    // 模块热更新
    new webpack.HotModuleReplacementPlugin()
  ],
  // 本地开发服务配置，代理配置
  devServer: {
    hot: true,
    inline: true,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};

// 构建目录，构建入口
var submodule = process.argv[5] || 'index';
var entryFileName = submodule;

// 输入输出设置
config.entry[entryFileName] = path.resolve(__dirname, 'src/', submodule, entryFileName + '.js');
config.output.path = path.resolve(__dirname, 'dist/', submodule);
config.plugins[0] = new HtmlWebpackPlugin({
  template: path.resolve('src/', submodule, entryFileName + '.ejs')
})

module.exports = config;