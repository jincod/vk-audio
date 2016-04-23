require('babel-register');
var app = require('./server/app.js');

var webpack = require('webpack');
var config = require('./webpack.config');

var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));