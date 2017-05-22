const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('argv', process.argv);

var config = {
  entry: {
    vendor: ['lodash']
  },
  output: {
    filename: '[name]-[chunkhash:8].js',
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
      test: /\.(ttf|woff|woff2|svg|svgz)(\?.+)?$/,
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
    new ExtractTextPlugin('styles.[chunkhash:8].css'),
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

var activeModule = process.argv[5] || 'index';

// 输入输出设置
config.entry[activeModule] = path.resolve(__dirname, 'src/', activeModule, activeModule + '.js');
config.output.path = path.resolve(__dirname, 'dist/', activeModule);
config.plugins[0] = new HtmlWebpackPlugin({
  template: path.resolve('src/', activeModule, activeModule + '.ejs')
})
config.plugins[1] = new ExtractTextPlugin(activeModule + '-[chunkhash:8].css')

module.exports = config;