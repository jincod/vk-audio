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
    preLoaders: [{
      test: /\.js$/,
      loader: "eslint-loader",
      include: path.join(__dirname, '..', 'src')
    }],
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, '..', 'src')
    }]
  }
};