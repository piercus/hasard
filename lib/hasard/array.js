import AbstractHasard from './abstract.js';

class ArrayHasard extends AbstractHasard {
	check(key, value) {
		if (key === 'values' && value !== null && (value) !== undefined && !Array.isArray(value)) {
			throw (new TypeError(`${key} ${value} must be an array`));
		}
	}

	resolve(unresolved, runOptions) {
		// Do not resolve "value" here, it will be resolved in generate
		const overrideUnresolved = Object.assign({}, unresolved);
		delete overrideUnresolved.value;

		return Object.assign(super.resolve(overrideUnresolved, runOptions), {value: unresolved.value});
	}

	getOpts(options) {
		let values = null;
		let size;
		let value;
		let randomOrder;
		if (Array.isArray(options)) {
			values = options;
			size = values.length;
			value = null;
			randomOrder = false;
		} else {
			size = options.size;
			values = options.values;
			value = options.value;
			randomOrder = options.randomOrder;
		}

		return {
			size,
			value,
			values,
			randomOrder,
		};
	}

	generate(context, runOptions) {
		if (ArrayHasard.isHasard(context.value)) {
			return new Array(context.size).fill(1).map(() => context.value.runOnce(runOptions));
		}

		if (context.values) {
			let newValues;

			if (typeof (context.size) === 'number' || context.randomOrder) {
				const size = typeof (context.size) === 'number' ? context.size : context.values.length;

				if (size > context.values.length) {
					throw (new Error(`Cannot pick ${size} elements in ${context.values.length}-size array`));
				}

				let selectedObjs = context.values
					.map((v, i) => ({strength: this.prng(), value: v, index: i}))
					.sort((a, b) => a.strength - b.strength)
					.slice(0, size);

				if (!context.randomOrder) {
					selectedObjs = selectedObjs.sort((a, b) => a.index - b.index);
				}

				newValues = selectedObjs.map(({value}) => value);
			} else {
				newValues = context.values;
			}

			return newValues.map(v => {
				if (ArrayHasard.isHasard(v)) {
					const res = v.runOnce(runOptions);
					return res;
				}

				return v;
			});
		}

		return new Array(context.size).fill(1).map(() => context.value);
	}
}

export default ArrayHasard;
