'use strict';

var webpack = require("webpack");
var path = require("path");

module.exports = {
  devtool: 'eval',
  entry: ['webpack-hot-middleware/client', './src/app.js'],

  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: "bundle.js"
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, '..', 'src')
    }]
  }
};