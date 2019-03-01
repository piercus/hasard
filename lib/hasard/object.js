const AbstractHasard = require('./abstract');

class ObjectHasard extends AbstractHasard {
	constructor(keys, value, opts) {
		if (ObjectHasard.isHasard(keys) || Array.isArray(keys)) {
			if (typeof (value) === 'undefined') {
				throw (new TypeError('h.object(keys, value) should have a value param'));
			}
			super(Object.assign({}, opts, {keys, value}))
		} else if(typeof(keys) === "object") {
			super(Object.assign({}, value, {obj: keys}))
		} else {
			throw (new TypeError('invalid params for h.object'));
		}
	}

	check(key, value) {
		if (key === 'keys' && value !== null && typeof (value) !== 'undefined') {
			if (!Array.isArray(value)) {
				throw (new TypeError(`${key} ${value} must be an array`));
			}

			value.forEach((v, index) => {
				// Check unicity
				if (value.indexOf(v) !== index) {
					throw (new TypeError(`keys must be unique (${key}[${index}] '${v}' is duplicated)`));
				}

				// Check string type
				if (typeof (v) !== 'string') {
					throw (new TypeError(`keys must be string array (${key}[${index}] '${v}' should be a string)`));
				}
			});
		}
	}

	resolve(unresolved, runOpts) {
		// Do not resolve "value" here, it will be resolved in generate
		const overrideUnresolved = Object.assign({}, unresolved);
		delete overrideUnresolved.value;

		return Object.assign(super.resolve(overrideUnresolved, runOpts), {value: unresolved.value});
	}

	generate(ctx, runOpts) {
		if (ctx.obj) {
			return ctx.obj;
		}

		if (ctx.keys) {
			let values;
			if (this.constructor.isHasard(ctx.value)) {
				values = ctx.value.run(ctx.keys.length, runOpts);
			} else {
				values = new Array(ctx.keys.length).fill(ctx.value);
			}

			const res = {};
			ctx.keys.forEach((k, index) => {
				res[k] = values[index];
			});
			return res;
		}
	}
}

module.exports = ObjectHasard;
