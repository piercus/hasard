const AbstractHasard = require('./abstract');

class BooleanHasard extends AbstractHasard {
	constructor(...arguments_) {
		super(...arguments_);
		if (arguments_.length === 0) {
			this.set(0.5);
		} else {
			this.set(...arguments_);
		}
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
			prob,
		};
	}

	generate(context) {
		if (typeof (context.prob) !== 'number') {
			return (this.prng() > 0.5);
		}

		return (this.prng() < context.prob);
	}
}

module.exports = BooleanHasard;
