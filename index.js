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
	shortcuts[key.toLowerCase()] = cstrs[key].build.bind(cstrs[key]);
});

const helpers = {
	isHasard: Abstract.isHasard,
	fn: shortcuts.function,
	int: shortcuts.integer,
	num: shortcuts.number,
	str: shortcuts.string,
	ref: shortcuts.ref
};

module.exports = Object.assign({}, cstrs, shortcuts, operators, helpers);
