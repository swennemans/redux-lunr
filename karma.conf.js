var webpack = require('webpack');
var path = require('path');

module.exports = function(config) {
  config.set({
    plugins: [
      require('karma-webpack'),
      require('karma-tap'),
      require('karma-chrome-launcher'),
    ],

    basePath: '',
    frameworks: ['tap'],
    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': ['webpack']
    },

    webpack: {
      node : {
        fs: 'empty'
      },
      module: {
        loaders: [
          {test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader'},
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
};