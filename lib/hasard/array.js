const AbstractHasard = require('./abstract');

class ArrayHasard extends AbstractHasard {
	check(key, value) {
		if (key === 'values' && value !== null) {
			if (!Array.isArray(value)) {
				throw (new TypeError(`${key} ${value} must be an array`));
			}
		}
	}

	runOnce(runOpts = {}) {
		const ctxt = this._resolved;
		Object.keys(this._unresolved).forEach(k => {
			if (k === 'value') {
				ctxt[k] = this._unresolved[k];
			} else {
				ctxt[k] = this._unresolved[k].runOnce(runOpts);
				this.check(k, ctxt[k]);
			}
		});
		return this.generate(ctxt, runOpts);
	}

	getOpts(opts) {
		let values = null;
		let size;
		let value;
		if (Array.isArray(opts)) {
			values = opts;
			size = values.length;
			value = null;
		} else {
			size = opts.size;
			value = opts.value;
		}

		return {
			size,
			value,
			values
		};
	}

	generate(ctx, runOpts) {
		if (ArrayHasard.isHasard(ctx.value)) {
			return new Array(ctx.size).fill(1).map(() => ctx.value.runOnce(runOpts));
		}

		if (ctx.values) {
			return ctx.values.map(v => {
				if (ArrayHasard.isHasard(v)) {
					return v.runOnce(runOpts);
				}

				return v;
			});
		}

		return new Array(ctx.size).fill(1).map(() => ctx.value);
	}
}

module.exports = ArrayHasard;
