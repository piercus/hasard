const AbstractSometimes = require('./abstract');

class ArraySometimes extends AbstractSometimes {
	check(key, value) {
		if (key === 'prob') {
			if (typeof (value) !== 'number') {
				throw (new TypeError(`${key} ${value} must be a number`));
			}

			if (value < 0 || value > 1) {
				throw (new Error(`${key} ${value} must be between 0 and 1`));
			}
		}
	}

	_runOnce() {
		const ctxt = this._resolved;
		Object.keys(this._unresolved).forEach(k => {
			if (k === 'value') {
				ctxt[k] = this._unresolved[k];
			} else {
				ctxt[k] = this._unresolved[k].runOnce();
				this.check(k, ctxt[k]);
			}
		});
		return this.generate(ctxt);
	}

	getOpts({size, value}) {
		return {
			size,
			value
		};
	}

	generate(ctx) {
		if (ArraySometimes.isSometimes(ctx.value)) {
			return new Array(ctx.size).fill(1).map(() => ctx.value.runOnce());
		}

		return new Array(ctx.size).fill(1).map(() => ctx.value);
	}
}

module.exports = ArraySometimes;
