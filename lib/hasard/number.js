const AbstractHasard = require('./abstract');

class NumberHasard extends AbstractHasard {
	check(key, value) {
		if (key === 'start' || key === 'end') {
			if (typeof (value) !== 'number') {
				throw (new TypeError(`${key} (${value}) must be a number`));
			}
		}

		if (key === 'type' && ['normal', 'uniform', 'truncated-normal'].indexOf(value) === -1) {
			throw (new TypeError(`${key} ${value} is invalid`));
		}
	}

	set(start, end) {
		if (typeof (end) === 'undefined') {
			super.set(start);
		} else if (typeof (end) === 'number' || this.constructor.isHasard(end)) {
			super.set([start, end]);
		} else {
			throw (new Error(`second argument ${end} is not valid`));
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

	_pickNormalNumber(mean = 0, std = 1) {
		// From http://blog.yjl.im/2010/09/simulating-normal-random-variable-using.html

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

	generate(ctx) {
		if (ctx.type === 'uniform') {
			return ctx.start + (this.prng() * (ctx.end - ctx.start));
		}

		if (ctx.type === 'normal') {
			const mean = ctx.mean || 0;
			const std = ctx.std || 1;
			return this._pickNormalNumber(mean, std);
		}

		if (ctx.type === 'truncated-normal') {
			const mean = ctx.mean || 0;
			const std = ctx.std || 1;
			let n;
			do {
				n = this._pickNormalNumber(mean, std);
			} while ((n > mean + (2 * std)) || (n < mean - (2 * std)));

			return n;
		}

		throw (new Error(`type ${ctx.type} is invalid`));
	}
}

module.exports = NumberHasard;
