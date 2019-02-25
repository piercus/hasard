const ArraySometimes = require('./array');

class StringSometimes extends ArraySometimes {
	generate(ctx) {
		return super.generate(ctx).join('');
	}
}

module.exports = StringSometimes;
