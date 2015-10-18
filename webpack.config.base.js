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
      exclude: /node_modules/,
      //include: path.join(__dirname, 'src'),
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
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};