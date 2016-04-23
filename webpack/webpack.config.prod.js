'use strict';

var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'source-map',
  entry: ['./src/app.js'],

  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: "bundle.js"
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('styles.css')
  ],
  module: {
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
      loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')
    }, {
      test: /\.svg$/,
      loader: "svg-inline",
      include: path.join(__dirname, '..', 'src', 'images')
    }]
  }
};