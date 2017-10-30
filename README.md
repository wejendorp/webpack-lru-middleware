[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]

# Webpack LRU middleware

Stop building entrypoints you don't need!

## The problem
Webpack configurations with a lot of entrypoints will often build a lot of
unnecessary modules, taking up valuable build time.

## This solution
This module is a wrapper around
[webpack-dev-middleware][webpackdevmiddleware], replacing the webpack entry with
a cache and mounting entrypoints as they are requested.

* Specify a set of entrypoints on startup
* Build more entrypoints based on trigger requests
* Limit number of active entrypoints to build
* Remove entrypoints when they have not been used for a while

## Table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Usage](#usage)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```
npm install webpack-lru-middleware --save-dev
```

## Usage

``` javascript
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackLRU = require('webpack-lru-middleware');

const lru = webpackLRU({
  // Load this file to make webpack happy
  defaultEntry: { __empty__: path.resolve(__dirname, './empty.js') },
  // Preload these entries on startup
  initialEntry: [],
  // configure how requests get mapped to entrypoint names:
  mapToEntry: req => path.basename(req.path, '.js'),
  // lifecycle hooks for logging / debugging purposes:
  onAdd: entryName => {},
  onRemove: entryName => {},
  // LRU Options to configure caching behavior
  // passed straight to https://github.com/chriso/lru
  lru: {
    max: undefined,
    maxAge: undefined
  }
});
// Pass a modified webpack config with LRU entries to webpack:
const compiler = webpack(lru.configure(webpackConfig));
const middleware = webpackDevMiddleware(compiler);

// Wrap and mount the middlewares:
app.use(lru.createMiddleware(devMiddleware));
```

## LICENSE

#### MIT

[npm]: https://img.shields.io/npm/v/webpack-lru-middleware.svg
[npm-url]: https://npmjs.com/package/webpack-lru-middleware

[deps]: https://david-dm.org/wejendorp/webpack-lru-middleware.svg
[deps-url]: https://david-dm.org/wejendorp/webpack-lru-middleware

[tests]: http://img.shields.io/travis/wejendorp/webpack-lru-middleware.svg
[tests-url]: https://travis-ci.org/wejendorp/webpack-lru-middleware

[cover]: https://codecov.io/gh/wejendorp/webpack-lru-middleware/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/wejendorp/webpack-lru-middleware

[webpackdevmiddleware]: https://github.com/webpack/webpack-dev-middleware
