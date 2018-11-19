// webpack.config.js
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }],
                'react',
                'stage-2'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name: 'assets/icons/[name].[ext]'
              }
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                }
              }
            }
          }]
      },
      {
        test: /\.json$/,
        use: [{
          loader: 'json-loader'
        }]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),
    // new ManifestPlugin({
    //   gcm_sender_id: '103953800507'
    // })
  ],
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    historyApiFallback: {
      index: 'index.html'
    }
  },
  resolve: {
    modules: [
      path.join(__dirname, 'dist'),
      'node_modules'
    ]
  }
}

module.exports = config
