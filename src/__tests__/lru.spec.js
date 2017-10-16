const webpackLRU = require('..');

describe('lru middleware', () => {
	let context;

	const configure = options => {
		context = {};
		const devMiddleware = (context.devMiddleware = {
			invalidate: jest.fn()
		});
		const webpackConfig = (context.webpackConfig = {
			entry: () => ({
				test0: './src/empty',
				test1: './src/empty',
				test2: './src/empty'
			})
		});
		const lru = (context.lru = webpackLRU(options));
		context.config = lru.configure(webpackConfig);
		context.middleware = lru.createMiddleware(devMiddleware);
	};

	it('returns defaultEntry if nothing active', () => {
		configure({});
		const entry = context.config.entry();
		expect(entry).toBe(context.lru.options.defaultEntry);
	});

	it('activates entry on request', done => {
		configure({ mapToEntry: () => 'test0' });
		context.middleware[0]({}, null, err => {
			if (err) {
				return done(err);
			}
			expect(context.devMiddleware.invalidate).toHaveBeenCalled();
			expect(context.config.entry()).toMatchObject({ test0: './src/empty' });
			done();
		});
	});

	it('holds multiple entries', done => {
		configure({});
		context.middleware[0]({ path: '/test0.js' }, null, err1 => {
			if (err1) {
				return done(err1);
			}
			expect(context.devMiddleware.invalidate).toHaveBeenCalled();
			expect(context.config.entry()).toEqual({ test0: './src/empty' });
			context.middleware[0]({ path: '/test1.js' }, null, err2 => {
				if (err2) {
					return done(err2);
				}
				expect(context.devMiddleware.invalidate).toHaveBeenCalled();
				expect(context.config.entry()).toEqual({
					test0: './src/empty',
					test1: './src/empty'
				});
				done();
			});
		});
	});

	it('pushes out old entries', done => {
		configure({ lru: { max: 1 } });
		context.middleware[0]({ path: '/test0.js' }, null, err1 => {
			if (err1) {
				return done(err1);
			}
			expect(context.devMiddleware.invalidate).toHaveBeenCalled();
			expect(context.config.entry()).toEqual({ test0: './src/empty' });
			context.devMiddleware.invalidate.mockClear();

			context.middleware[0]({ path: '/test1.js' }, null, err2 => {
				if (err1) {
					return done(err1);
				}
				expect(context.devMiddleware.invalidate).toHaveBeenCalled();
				expect(context.config.entry()).toEqual({ test1: './src/empty' });
				done();
			});
		});
	});
});
