const ArrayHasard = require('./array.js');

class StringHasard extends ArrayHasard {
	generate(context, runOptions) {
		return super.generate(context, runOptions).join('');
	}
}

module.exports = StringHasard;
