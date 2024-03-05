import AbstractHasard from './abstract.js';

class ObjectHasard extends AbstractHasard {
	set(keys, value) {
		if (ObjectHasard.isHasard(keys) || Array.isArray(keys)) {
			if ((value) === undefined) {
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
		if (key === '__hasardKeys' && value !== null && (value) !== undefined) {
			const k = 'keys';
			if (!Array.isArray(value)) {
				throw (new TypeError(`${k} ${value} must be an array`));
			}

			for (const [index, v] of value.entries()) {
				// Check unicity
				if (value.indexOf(v) !== index) {
					throw (new TypeError(`keys must be unique (${k}[${index}] '${v}' is duplicated)`));
				}

				// Check string type
				if (typeof (v) !== 'string') {
					throw (new TypeError(`keys must be string array (${k}[${index}] '${v}' should be a string)`));
				}
			}
		}
	}

	getOpts(options) {
		const res = Object.assign({}, options, {__hasardKeys: options.__hasardKeys, __hasardValue: options.__hasardValue});
		return res;
	}

	resolve(unresolved, runOptions) {
		// Do not resolve "value" here, it will be resolved in generate
		const overrideUnresolved = Object.assign({}, unresolved);
		delete overrideUnresolved.__hasardValue;
		const res = Object.assign(super.resolve(overrideUnresolved, runOptions), {__hasardValue: unresolved.__hasardValue});
		return res;
	}

	generate(context, runOptions) {
		if (context.__hasardKeys) {
			// Console.log('here', ctx, this.constructor.isHasard(ctx.__hasardValue), ctx.__hasardValue)
			const values = this.constructor.isHasard(context.__hasardValue) ? context.__hasardValue.run(context.__hasardKeys.length, runOptions) : Array.from({length: context.__hasardKeys.length}).fill(context.__hasardValue);

			const res = {};
			for (const [index, k] of context.__hasardKeys.entries()) {
				res[k] = values[index];
			}

			return res;
		}

		delete context.__hasardKeys;
		delete context.__hasardValue;
		return context;
	}
}

export default ObjectHasard;
