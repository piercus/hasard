const AbstractSometimes = require('./abstract');

class ObjectSometimes extends AbstractSometimes {
	generate(ctx) {
		return ctx;
	}
}

module.exports = ObjectSometimes;
