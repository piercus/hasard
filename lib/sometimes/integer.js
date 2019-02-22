const AbstractSometimes = require('./abstract');

class IntegerSometimes extends AbstractSometimes {
	check(key, value) {
		if (key === 'start' || key === 'end') {
			if (Math.floor(value) !== value) {
				throw (new TypeError(`${key} (${value}) must be an integer`));
			}
		}

		if (key === 'type' && ['poisson', 'uniform'].indexOf(value) === -1) {
			throw (new TypeError(`${key} ${value} is invalid`));
		}
	}

	getOpts(opts) {
		if (Array.isArray(opts)) {
			if (opts.length !== 2) {
				throw (new TypeError(`${opts} must be a length-2 array`));
			}

			const start = opts[0];
			const end = opts[1];
			return {
				start,
				end,
				type: 'uniform'
			};
		}

		return opts;
	}

	generate(ctx) {
		if (ctx.type === 'poisson') {
			const l = Math.exp(-ctx.lambda);
			let p = 1;
			let k = 0;

			do {
				k++;
				p *= this.prng();
			} while (p > l);

			return k - 1;
		}

		return Math.floor(ctx.start + (this.prng() * (ctx.end + 1 - ctx.start)));
	}
}

module.exports = IntegerSometimes;
