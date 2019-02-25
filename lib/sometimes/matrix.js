const reshape = require('../helpers/reshape');
const ArraySometimes = require('./array');

const fact = function (array) {
	if (array.length === 0) {
		return 1;
	}

	return array[0] * fact(array.slice(1));
};

class MatrixSometimes extends ArraySometimes {
	check(key, value) {
		super.check(key, value);
		if (key === 'shape') {
			if (!Array.isArray(value)) {
				throw (new TypeError(`${key} (${value}) must be an array`));
			}

			if (value.length === 0) {
				throw (new Error(`${key} (${value}) should not be empty`));
			}

			value.forEach(v => {
				if (Math.floor(v) !== v) {
					throw (new Error(`${key} (${v}) must be an integer`));
				}
			});
		}
	}

	getOpts(opts) {
		return Object.assign({}, super.getOpts(opts), {shape: opts.shape});
	}

	generate(ctx) {
		const ctx2 = Object.assign({}, ctx, {size: fact(ctx.shape)});
		return reshape(super.generate(ctx2), ctx.shape);
	}
}

module.exports = MatrixSometimes;
