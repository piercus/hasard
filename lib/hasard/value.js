const AbstractHasard = require('./abstract');

const getRanges = function (array) {
	const res = [];
	let current = 0;
	array.forEach(v => {
		res.push([current, current + v]);
		current += v;
	});
	return res;
};

class ValueHasard extends AbstractHasard {
	check(key, value) {
		if (key === 'weights' && Array.isArray(value)) {
			const sum = value.reduce((a, b) => a + b, 0);
			const tolerance = 1e-6;
			if (Math.abs(sum - 1) > tolerance) {
				throw (new Error(`sum of weights must be 1 (is ${sum})`));
			}
		}
	}

	getOpts(opts) {
		let choices;

		if (Array.isArray(opts)) {
			choices = opts;
		} else {
			choices = opts.choices;
		}

		const {weights} = opts;

		return {
			choices,
			weights
		};
	}

	generate(ctx) {
		let choice;

		if (ctx.weights) {
			const ranges = getRanges(ctx.weights);
			const v = this.prng();
			const {index} = ranges.map((value, index) => ({value, index})).filter(({value}) => (value[0] <= v && v < value[1]))[0];
			choice = ctx.choices[index];
		} else {
			choice = ctx.choices[Math.floor(this.prng() * ctx.choices.length)];
		}

		if (this.constructor.isHasard(choice)) {
			return choice.runOnce();
		}

		return choice;
	}
}

module.exports = ValueHasard;
