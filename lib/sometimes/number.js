const AbstractSometimes = require('./abstract');

class NumberSometimes extends AbstractSometimes {
	check(key, value) {
		if (key === 'start' || key === 'end') {
			if (typeof (value) !== 'number') {
				throw (new TypeError(`${key} (${value}) must be a number`));
			}
		}

		if (key === 'type' && ['poisson', 'normal', 'uniform'].indexOf(value) === -1) {
			throw (new TypeError(`${key} ${value} is invalid`));
		}
	}

	getOpts(opts) {
		let res = opts;

		if (Array.isArray(opts)) {
			if (opts.length !== 2) {
				throw (new TypeError('invalid array, range array length must be 2'));
			}

			res = {
				type: 'uniform',
				start: opts[0],
				end: opts[1]
			};
		} else {
			res = opts;
		}

		return res;
	}

	generate(ctx) {
		if (ctx.type === 'uniform') {
			return ctx.start + (this.prng() * (ctx.end - ctx.start));
		}

		if (ctx.type === 'normal') {
			// From http://blog.yjl.im/2010/09/simulating-normal-random-variable-using.html

			const mean = ctx.mean || 0;
			const std = ctx.std || 1;
			let v1;
			let v2;
			let s;

			do {
				const u1 = this.prng();
				const u2 = this.prng();
				v1 = (2 * u1) - 1;
				v2 = (2 * u2) - 1;
				s = (v1 * v1) + (v2 * v2);
			} while (s > 1);

			return mean + (std * Math.sqrt(-2 * Math.log(s) / s) * v1);
		}
	}
}

module.exports = NumberSometimes;
