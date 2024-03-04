const AbstractHasard = require('./abstract');
const RandomArray = require('./array');

class FunctionHasard extends AbstractHasard {
	check(key, value) {
		if (key === 'fn' && typeof (value) !== 'function') {
			throw (new TypeError(`${key} ${value} must be a function`));
		}

		if (key === 'args' && value && !Array.isArray(value)) {
			throw (new TypeError(`${key} ${value} must be an array`));
		}
	}

	getOpts({args, fn}) {
		return {
			args,
			fn,
		};
	}

	generate(context) {
		return context.fn(...context.args);
	}

	static build(hasardContext, function_) {
		return function (...arguments_) {
			const f = new FunctionHasard({args: new RandomArray(arguments_), fn: function_});
			if (hasardContext && hasardContext.prng) {
				f._prng = hasardContext.prng;
			}

			return f;
		};
	}
}

module.exports = FunctionHasard;
