const express = require('express');
const webpack = require('webpack');

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackLRU = require('.');

const app = express();

const webpackConfig = {
	entry: () => ({
		test0: './src/empty',
		test1: './src/empty',
		test2: './src/empty'
	})
};
const lru = webpackLRU({
	// defaultEntry:
	lru: {
		max: 1
	}
});

const compiler = webpack(lru.configure(webpackConfig));
const devMiddleware = webpackDevMiddleware(compiler);

app.use(lru.createMiddleware(devMiddleware));

app.listen(3000, err => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log('listening on 3000');
});
