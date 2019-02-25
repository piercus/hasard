const ArrayHasard = require('./array');

class StringHasard extends ArrayHasard {
	generate(ctx) {
		return super.generate(ctx).join('');
	}
}

module.exports = StringHasard;
