const AbstractHasard = require('./abstract');

class ObjectHasard extends AbstractHasard {
	set(keys, value) {
		if (ObjectHasard.isHasard(keys) || Array.isArray(keys)) {
			if (typeof (value) === 'undefined') {
				throw (new TypeError('h.object(keys, value) should have a value param'));
			}

			super.set(Object.assign({}, {__hasardKeys: keys, __hasardValue: value}));
		} else if (typeof (keys) === 'object') {
			super.set(Object.assign({}, keys));
		} else {
			throw (new TypeError('invalid params for h.object'));
		}
	}

	check(key, value) {
		if (key === '__hasardKeys' && value !== null && typeof (value) !== 'undefined') {
			const k = 'keys';
			if (!Array.isArray(value)) {
				throw (new TypeError(`${k} ${value} must be an array`));
			}

			value.forEach((v, index) => {
				// Check unicity
				if (value.indexOf(v) !== index) {
					throw (new TypeError(`keys must be unique (${k}[${index}] '${v}' is duplicated)`));
				}

				// Check string type
				if (typeof (v) !== 'string') {
					throw (new TypeError(`keys must be string array (${k}[${index}] '${v}' should be a string)`));
				}
			});
		}
	}

	getOpts(opts) {
		const res = Object.assign({}, opts, {__hasardKeys: opts.__hasardKeys, __hasardValue: opts.__hasardValue});
		return res;
	}

	resolve(unresolved, runOpts) {
		// Do not resolve "value" here, it will be resolved in generate
		const overrideUnresolved = Object.assign({}, unresolved);
		delete overrideUnresolved.__hasardValue;
		const res = Object.assign(super.resolve(overrideUnresolved, runOpts), {__hasardValue: unresolved.__hasardValue});
		return res;
	}

	generate(ctx, runOpts) {
		if (ctx.__hasardKeys) {
			// Console.log('here', ctx, this.constructor.isHasard(ctx.__hasardValue), ctx.__hasardValue)
			let values;
			if (this.constructor.isHasard(ctx.__hasardValue)) {
				values = ctx.__hasardValue.run(ctx.__hasardKeys.length, runOpts);
			} else {
				values = new Array(ctx.__hasardKeys.length).fill(ctx.__hasardValue);
			}

			const res = {};
			ctx.__hasardKeys.forEach((k, index) => {
				res[k] = values[index];
			});
			return res;
		}

		delete ctx.__hasardKeys;
		delete ctx.__hasardValue;
		return ctx;
	}
}

module.exports = ObjectHasard;
