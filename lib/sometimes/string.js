const ArraySometimes = require('./array');

class StringSometimes extends ArraySometimes {
	generate(ctx) {
		return this.generate(ctx).join('');
	}
}

module.exports = StringSometimes;
