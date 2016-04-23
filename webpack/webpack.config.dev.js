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
    }, {
      test: /\.css$/,
      loader: "style!css",
      include: path.join(__dirname, '..', 'src', 'styles')
    }, {
      test: /\.less$/,
      loader: "style!css!less",
      include: path.join(__dirname, '..', 'src', 'styles')
    }, {
      test: /\.svg$/,
      loader: "svg-inline",
      include: path.join(__dirname, '..', 'src', 'images')
    }]
  }
};