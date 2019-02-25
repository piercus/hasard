const AbstractHasard = require('./abstract');

class ObjectHasard extends AbstractHasard {
	generate(ctx) {
		return ctx;
	}
}

module.exports = ObjectHasard;
