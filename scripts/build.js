var webpack = require('webpack');
var config = require('../webpack/webpack.config.prod');

if (process.env.NODE_ENV !== 'production') {
	process.exit(0);
}

webpack(config, function(err, stats) {
	var exitCode = 0;
	if (err) {
		console.log(err);
		exitCode = 1;
	}

	if (stats.hasErrors() || stats.hasWarnings()) {
		exitCode = 1;
	}

	console.log(stats.toString({chunks: false}));
	process.exit(exitCode);
});
