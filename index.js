const Abstract = require('./lib/hasard/abstract');
const Function = require('./lib/hasard/function');
const operators = require('./lib/operators');

const cstrs = {
	Integer: require('./lib/hasard/integer'),
	Value: require('./lib/hasard/value'),
	Array: require('./lib/hasard/array'),
	Object: require('./lib/hasard/object'),
	Number: require('./lib/hasard/number'),
	Matrix: require('./lib/hasard/matrix'),
	String: require('./lib/hasard/string'),
	Boolean: require('./lib/hasard/boolean'),
	Reference: require('./lib/hasard/reference'),
	Function
};

const shortcuts = {};
Object.keys(cstrs).forEach(key => {
	shortcuts[key.toLowerCase()] = cstrs[key].build.bind(cstrs[key], this);
});

const helpers = {
	isHasard: Abstract.isHasard,
	fn: shortcuts.function,
	int: shortcuts.integer,
	num: shortcuts.number,
	str: shortcuts.string,
	ref: shortcuts.reference
};

const methods = function (hasardContext) {
	return Object.assign({}, cstrs, shortcuts, operators(hasardContext), helpers);
};

class Hasard {
	constructor(prng = Math.random.bind(Math)) {
		this.prng = prng;
		const meths = methods(this);
		Object.keys(meths).forEach(m => {
			this[m] = meths[m].bind(this);
		});
	}
}

module.exports = Object.assign(Hasard, methods(null));
