const reshape = require('../helpers/reshape');
const ArrayHasard = require('./array');

const fact = function (array) {
	if (array.length === 0) {
		return 1;
	}

	return array[0] * fact(array.slice(1));
};

class MatrixHasard extends ArrayHasard {
	check(key, value) {
		super.check(key, value);
		if (key === 'shape') {
			if (!Array.isArray(value)) {
				throw (new TypeError(`${key} (${value}) must be an array`));
			}

			if (value.length === 0) {
				throw (new Error(`${key} (${value}) should not be empty`));
			}

			for (const v of value) {
				if (Math.floor(v) !== v) {
					throw (new Error(`${key} (${v}) must be an integer`));
				}
			}
		}
	}

	getOpts(options) {
		return Object.assign({}, super.getOpts(options), {shape: options.shape});
	}

	generate(context, runOptions) {
		const size = fact(context.shape);
		const context2 = Object.assign({}, context, {size});
		const resArray = super.generate(context2, runOptions);
		return reshape(resArray, [size], context.shape);
	}
}

module.exports = MatrixHasard;
