'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/}
    ],
    postLoaders: [{
      test: /.wrk\.js$/,
      include: path.join(__dirname, 'src'),
      loaders: ['worker-loader'],
    }]
  },
  output: {
    library: 'ReduxLunr',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  ]
};