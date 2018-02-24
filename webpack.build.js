const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const argv = require('yargs').argv;
let isProduction = process.env.NODE_ENV === 'production';

// 构建目录，构建入口, 如果没有指定模块则默认全部模块
var submodule = argv.define || 'all';
var entryFileName = submodule;
var modules = ['find'];
var submoduleSet;


var outputPath = path.resolve(__dirname, 'public/');

var config = {
  entry: {
    vendor: ['vue', 'vuex', 'axios']
  },
  output: {
    filename: 'js/[name].js',
    path: outputPath
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'sass-loader']
      })
    }, {
      test: /\.ejs$/,
      use: 'ejs-compiled-loader'
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
          name: '[name].[ext]',
          publicPath: '../',
          outputPath: 'img/'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name].[ext]',
          publicPath: '../',
          outputPath: 'font/'
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
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   //Popper: ['popper.js', 'default']
    // }),
    new CopyWebpackPlugin([
      { from: 'node_modules/bootstrap/dist/css', to: 'vendor/bootstrap/css/' }
    ]),
    // 抽出样式
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    }),
    // 抽出公共文件vendor依赖，manifest运行时信息
    new webpack.optimize.CommonsChunkPlugin({
      //name: ['vendor', 'manifest']
      name: 'vendor',
      minChunks: Infinity,
    }),
    // 定义组件内环境变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};

console.log('submodule', submodule)
if (submodule === 'all') {

  modules.forEach((n, i) => {
    submoduleSet = n.split('-');
    submodule = submoduleSet.length === 2 ? submoduleSet[0] : n;
    entryFileName = n;

    config.entry[entryFileName] = path.resolve(__dirname, 'src/', submodule, entryFileName + '.js');

    // //页面集成
    config.plugins.push(new HtmlWebpackPlugin({
      chunks: ['vendor', entryFileName],
      template: path.resolve(__dirname, 'src/', submodule, entryFileName + '.ejs'),
      filename: 'template/' + entryFileName + '.html'
    }));

    console.log('entry', path.resolve(__dirname, 'src/', submodule, entryFileName + '.js'));
  })
} else {
  submoduleSet = submodule.split('-');
  entryFileName = submodule;
  submodule = submoduleSet.length === 2 ? submoduleSet[0] : submodule;

  config.entry[entryFileName] = path.resolve(__dirname, 'src/', submodule, entryFileName + '.js');

  //页面集成
  config.plugins.push(new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/', submodule, entryFileName + '.ejs'),
    filename: 'template/' + entryFileName + '.html'
  }));
  console.log('entry', path.resolve(__dirname, 'src/', submodule, entryFileName + '.js'));
}

module.exports = config;
