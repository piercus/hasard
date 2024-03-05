import AbstractHasard from './abstract.js';

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

	getOpts(options) {
		if (Array.isArray(options)) {
			if (options.length !== 2) {
				throw (new TypeError(`${options} must be a length-2 array`));
			}

			const start = options[0];
			const end = options[1];
			return {
				start,
				end,
				type: 'uniform',
			};
		}

		return options;
	}

	generate(context) {
		if (context.type === 'poisson') {
			const l = Math.exp(-context.lambda);
			let p = 1;
			let k = 0;

			do {
				k++;
				p *= this.prng();
			} while (p > l);

			return k - 1;
		}

		return Math.floor(context.start + (this.prng() * (context.end + 1 - context.start)));
	}
}

export default IntegerHasard;
