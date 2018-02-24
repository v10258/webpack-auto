const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const argv = require('yargs').argv;
let isProduction = process.env.NODE_ENV === 'production';

// 构建目录，构建入口, 如果没有子目录 index 改为空字符串即可
var submodule = argv.define || 'index';
var entryFileName = submodule;

// 子目录下有多个文件，入口为 centre-question 时
var submoduleSet = submodule.split('-');
if (submoduleSet.length === 2) {
  submodule = submoduleSet[0];
}

var outputPath = path.resolve(__dirname, 'public/', submodule);
var entryPath = path.resolve(__dirname, 'src/', submodule, entryFileName + '.js');

var config = {
  entry: {
    vendor: ['vue', 'vuex', 'axios', 'mock']
  },
  output: {
    filename: 'js/[name].js',
    path: outputPath
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }, {
      test: /\.ejs$/,
      use: ['ejs-compiled-loader']
    },
    {
      test: /\.vue$/,
      use: 'vue-loader'
    },
    {
      test: /\.js$/,
      use: 'babel-loader'
    }, {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]'//,
          //useRelativePath: isProduction
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name].[ext]'//,
          //useRelativePath: isProduction
        }
      }]
    }]
  },
  resolve: {
    alias: {
      mock: path.resolve(__dirname, 'src/common/js/mock/mock.js'),
      vue: 'vue/dist/vue.js'
    }
  },
  // externals: {
  //   '$': 'window.$',
  //   'jQuery': 'window.jQuery'
  // },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   //Popper: ['popper.js', 'default']
    // }),
    new CopyWebpackPlugin([
      { from: 'node_modules/bootstrap/dist/css', to: 'vendor/bootstrap/css/' }
    ]),
    // 页面集成
    new HtmlWebpackPlugin({
      template: path.resolve('src/', submodule, entryFileName + '.ejs')
    }),
    // 抽出公共文件vendor依赖，manifest运行时信息
    new webpack.optimize.CommonsChunkPlugin({
      //name: ['vendor', 'manifest']
      name: 'vendor'
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

config.entry[entryFileName] = entryPath;

console.log('entry', path.resolve(__dirname, 'src/', submodule, entryFileName + '.js'));
console.log('template', path.resolve('src/', submodule, entryFileName + '.ejs'));

module.exports = config;
