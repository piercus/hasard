const AbstractHasard = require('./abstract');

class IntegerHasard extends AbstractHasard {
	check(key, value) {
		if ((key === 'start' || key === 'end') && Math.floor(value) !== value) {
			throw (new TypeError(`${key} (${value}) must be an integer`));
		}

		if (key === 'type' && !['poisson', 'uniform'].includes(value)) {
			throw (new TypeError(`${key} ${value} is invalid`));
		}
	}

	set(start, end) {
		if ((end) === undefined) {
			super.set(start);
		} else if (typeof (end) === 'number' || this.constructor.isHasard(end)) {
			super.set([start, end]);
		} else {
			throw (new Error(`second argument ${end} is not valid`));
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
				type: 'uniform',
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

module.exports = IntegerHasard;
