const ArrayHasard = require('./array');

class StringHasard extends ArrayHasard {
	generate(ctx, runOpts) {
		return super.generate(ctx, runOpts).join('');
	}
}

module.exports = StringHasard;
