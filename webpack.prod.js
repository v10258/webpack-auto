const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: {
    vendor: ['lodash']
  },
  output: {
    filename: 'js/[name]-[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
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
          name: 'img/[name]-[hash:8].[ext]'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'font/[name]-[hash:8].[ext]'
        }
      }]
    }]
  },
  plugins: [
    // 页面集成
    new HtmlWebpackPlugin(),
    // 抽出样式
    new ExtractTextPlugin('[name].[chunkhash:8].css'),
    // 抽出公共文件vendor依赖，manifest运行时信息
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    // 定义组件内环境变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // 代码压缩优化        
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    }),
    // 文件清单
    new ManifestPlugin()
  ]
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
config.plugins[1] = new ExtractTextPlugin('css/' + entryFileName + '-[chunkhash:8].css')

module.exports = config;
