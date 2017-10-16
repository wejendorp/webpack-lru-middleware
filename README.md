[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]

# Webpack LRU middleware

Stop building entrypoints you don't need!

Webpack configurations with a lot of entrypoints will often build a lot of
unnecessary code, taking up valuable build time.

It's a wrapper around [webpack-dev-middleware][webpackdevmiddleware], mounting
entrypoints as they are needed.

* Specify a set of initial entrypoints on startup
* Build more entrypoints based on trigger requests

---
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
  // defaultEntry: ...,
  // initialEntry: [],
  // mapToEntry: () => 'entry',
});
const compiler = webpack(lru.configure(webpackConfig));
const devMiddleware = webpackDevMiddleware(compiler);

app.use(lru.createMiddleware(devMiddleware));
```


## LICENSE

#### [MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/webpack-lru-middleware.svg
[npm-url]: https://npmjs.com/package/webpack-lru-middleware

[node]: https://img.shields.io/node/v/webpack-lru-middleware.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/wejendorp/webpack-dev-middleware.svg
[deps-url]: https://david-dm.org/wejendorp/webpack-dev-middleware

[tests]: http://img.shields.io/travis/wejendorp/webpack-lru-middleware.svg
[tests-url]: https://travis-ci.org/wejendorp/webpack-lru-middleware

[cover]: https://codecov.io/gh/wejendorp/webpack-lru-middleware/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/wejendorp/webpack-lru-middleware

[webpackdevmiddleware]: https://github.com/
