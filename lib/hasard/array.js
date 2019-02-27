const AbstractHasard = require('./abstract');

class ArrayHasard extends AbstractHasard {
	check(key, value) {
		if (key === 'values' && value !== null && typeof (value) !== 'undefined') {
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
		let randomOrder;
		if (Array.isArray(opts)) {
			values = opts;
			size = values.length;
			value = null;
			randomOrder = false;
		} else {
			size = opts.size;
			values = opts.values;
			value = opts.value;
			randomOrder = opts.randomOrder;
		}

		return {
			size,
			value,
			values,
			randomOrder
		};
	}

	generate(ctx, runOpts) {
		if (ArrayHasard.isHasard(ctx.value)) {
			return new Array(ctx.size).fill(1).map(() => ctx.value.runOnce(runOpts));
		}

		if (ctx.values) {
			let newValues;
			
			if(typeof(ctx.size) === 'number' || ctx.randomOrder){
				
				let size = ctx.size || ctx.values.length;
				
				if(size > ctx.values.length){
					throw(new Error(`Cannot pick ${size} elements in ${ctx.values.length}-size array`))
				}
				let selectedObjs = ctx.values
					.map((v,i) => ({strength: this.prng(), value: v, index: i}))
					.sort((a,b) => a.strength - b.strength)
					.slice(0, size)
				
				if(!ctx.randomOrder){
					selectedObjs = selectedObjs.sort((a,b) => a.index - b.index)
				}
				newValues = selectedObjs.map(({value}) => value)
			} else {
				newValues = ctx.values;
			}
			
			
			return newValues.map(v => {
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
