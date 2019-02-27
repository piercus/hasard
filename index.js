const Abstract = require('./lib/hasard/abstract');
const Function = require('./lib/hasard/function');
const operators = require('./lib/operators');

module.exports = {
	Integer: require('./lib/hasard/integer'),
	Value: require('./lib/hasard/value'),
	Array: require('./lib/hasard/array'),
	Object: require('./lib/hasard/object'),
	Number: require('./lib/hasard/number'),
	Matrix: require('./lib/hasard/matrix'),
	String: require('./lib/hasard/string'),
	Boolean: require('./lib/hasard/boolean'),
	Reference: require('./lib/hasard/reference'),
	isHasard: Abstract.isHasard,
	fn: Function.build,
	Function,
	multiply: operators.multiply,
	divide: operators.divide,
	add: operators.add,
	substract: operators.substract
};
