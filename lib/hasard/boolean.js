const AbstractHasard = require('./abstract');

class BooleanHasard extends AbstractHasard {
	constructor(...args) {
		super(...args);
		if (args.length === 0) {
			return this.set(0.5);
		}

		this.set(...args);
	}

	check(key, value) {
		if (key === 'prob') {
			if (typeof (value) !== 'number') {
				throw (new TypeError(`${key} ${value} must be a number`));
			}

			if (value < 0 || value > 1) {
				throw (new Error(`${key} ${value} must be between 0 and 1`));
			}
		}
	}

	getOpts(prob = 0.5) {
		return {
			prob
		};
	}

	generate(ctx) {
		if (typeof (ctx.prob) !== 'number') {
			return (this.prng() > 0.5);
		}

		return (this.prng() < ctx.prob);
	}
}

module.exports = BooleanHasard;
