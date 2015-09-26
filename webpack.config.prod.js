'use strict';

var webpack = require("webpack");
var path = require("path");

module.exports = {
  devtool: 'source-map',
  entry: ['./src/app.js'],

  output: {
    path: __dirname + '/public',
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
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }]
  }
};