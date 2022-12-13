const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 方式一： resolve获得当前路径
// console.log(path.resolve());
// 方式二： join拼接路径
// console.log(path.join(__dirname, './dist'))

module.exports = {
  mode: 'development',  // development 开发环境，没压缩体积更大，production 生产环境，体积更小
  entry: './src/index.js',
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, './dist')
  },
  experiments: {
    asyncWebAssembly: true,
  },
  module: {
    rules: [
      // {
      //   test: /.css$/,
      //   use: [
      //     // { loader: "style-loader" },
      //     // {
      //     //   loader: "css-loader",
      //     //   options: {
      //     //     modules: true,
      //     //   }
      //     // },
      //     // { loader: "sass-loader" }
      //     'style-loader', 'css-loader'
      //   ]
      // },
      {
        test: /(.scss|.sass)$/,
        // use: ['style-loader', 'css-loader', 'sass-loader']
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000, // 小于limit字节的文件会被转换为datauri，大于limit的文件还会用file-loader进行复制
              name: '[name].[ext]',
              outputPath: 'imgs/'
            }
          }
        ]
      },
      // 解决 file-loader默认使用esmodule 导致
      // {
      //   test: /.(jpe?g|png|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         esModule: false
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource',
        generator: {
            filename: 'images/[name][ext]',
        },
      },
      {
        test: /.js$/,
        // use: ['babel-loader']
        loader: "babel-loader",
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async',
      },

    ]
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [ // // v5.0版本无需patterns包裹，v6.0需要加一层patterns
        {
          from: path.join(__dirname, 'assets'),
          to: 'assets'
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  devServer: {
    hot: true,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],  // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
    },
    name: 'pc',  // 配置以name为隔离，创建不同的缓存文件，如生成不同终端的配置缓存
  },
}
