import AbstractHasard from './abstract.js';
import RandomString from './string.js';
import RandomValue from './value.js';

class ReferenceHasard extends AbstractHasard {
	resolve(unresolved, runOptions) {
		// Do not resolve "source" here, it will be resolved in generate
		const overrideUnresolved = Object.assign({}, unresolved);
		delete overrideUnresolved.source;

		return Object.assign(super.resolve(overrideUnresolved, runOptions), {source: unresolved.source});
	}

	generate({id, context, source}, runOptions) {
		if (!this.constructor.isHasard(source)) {
			return source;
		}

		const context_ = typeof (context) === 'string' ? context : 'global';

		if (!runOptions.refs || !runOptions.refs[context_] || (runOptions.refs[context_][id]) === undefined) {
			const res = source.runOnce(runOptions);
			runOptions.refs ||= {};

			if (!runOptions.refs[context_]) {
				runOptions.refs[context_] = {};
			}

			runOptions.refs[context_][id] = res;
			return res;
		}

		return runOptions.refs[context_][id];
	}

	check(key, value) {
		if (key === 'context' && value !== null && (value) !== undefined && typeof (value) !== 'string') {
			throw (new TypeError(`${key} (${value}) must be a string`));
		}
	}

	getOpts(options) {
		const randomString = new RandomString({
			value: new RandomValue('0123456789ABCDEF'.split('')),
			size: 16,
		});
		let source;
		let context;
		if (AbstractHasard.isHasard(options)) {
			source = options;
			context = null;
		} else if (typeof (options) === 'object') {
			source = options.source;
			context = options.context;
		} else {
			source = options;
			context = null;
		}

		return {
			source,
			context,
			id: randomString.runOnce(),
		};
	}
}

export default ReferenceHasard;
