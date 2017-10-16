const path = require('path');
const LRU = require('lru');

module.exports = function(options) {
	const opts = Object.assign(
		{
			defaultEntry: { __empty__: path.resolve(__dirname, './empty.js') },
			initialEntry: [],
			mapToEntry: req => path.basename(req.path, '.js'),
			lru: {
				max: undefined,
				maxAge: undefined
			}
		},
		options || {}
	);

	const lru = {
		options: opts,
		getEntrypoints: null,
		active: new LRU(opts.lru),
		configure(webpackConfig) {
			// normalize entry as a function, and cache it:
			lru.getEntrypoints =
				typeof webpackConfig.entry === 'function' ? webpackConfig.entry : () => webpackConfig.entry;

			return Object.assign({}, webpackConfig, {
				entry() {
					// Never return empty entry object, webpack will complain
					if (!lru.active.length) {
						return lru.options.defaultEntry;
					}

					const entries = lru.getEntrypoints();
					return lru.active.keys.reduce(
						(agg, entry) =>
							Object.assign(agg, {
								[entry]: entries[entry]
							}),
						{}
					);
				}
			});
		},
		createMiddleware(devMiddleware) {
			return [
				(req, res, next) => {
					const entryName = lru.options.mapToEntry(req);

					const entries = lru.getEntrypoints();
					const entrypoint = entries[entryName];
					const shouldMount = lru.active.get(entryName) === undefined;

					if (entrypoint && shouldMount) {
						lru.active.set(entryName, true);
						devMiddleware.invalidate();
					}
					next();
				},
				devMiddleware
			];
		}
	};

	// Initialize before returning:
	opts.initialEntry.forEach(entry => lru.active.set(entry, true));

	return lru;
};
