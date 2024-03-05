import AbstractHasard from './abstract.js';
// Const { isHasard } = AbstractHasard;

const getRanges = function (/** @type {any} */ array) {
	const result = [];
	let current = 0;
	for (const v of array) {
		result.push([current, current + v]);
		current += v;
	}

	return result;
};

class ValueHasard extends AbstractHasard {
	/**
	 * @param {string} key
	 * @param {any[]} value
	 */
	check(key, value) {
		if (key === 'weights' && Array.isArray(value)) {
			const sum = value.reduce((a, b) => a + b, 0);
			const tolerance = 1e-6;
			if (Math.abs(sum - 1) > tolerance) {
				throw (new Error(`sum of weights must be 1 (is ${sum})`));
			}
		}
	}

	/**
	 * @param {{ choices?: any; weights?: any; }} options
	 */
	getOpts(options) {
		let choices;

		if (Array.isArray(options)) {
			choices = options;
		} else if (AbstractHasard.isHasard(options)) {
			choices = options;
		} else {
			choices = options.choices;
		}

		const {weights} = options;

		return {
			choices,
			weights,
		};
	}

	/**
	 * @param {{ weights?: any; choices?: any; }} context
	 */
	generate(context) {
		let choice;

		if (context.weights) {
			if (!Array.isArray(context.choices)) {
				throw (new TypeError('choices must be defined in h.value'));
			}

			const ranges = getRanges(context.weights);
			const v = this.prng();
			const {index} = ranges.map((value, index) => ({value, index})).find(({value}) => (value[0] <= v && v < value[1]));
			choice = context.choices[index];
		} else {
			choice = context.choices[Math.floor(this.prng() * context.choices.length)];
		}

		if (AbstractHasard.isHasard(choice)) {
			return choice.runOnce();
		}

		return choice;
	}
}

export default ValueHasard;
