const AbstractHasard = require('./abstract');
const RandomString = require('./string');
const RandomValue = require('./value');

class ReferenceHasard extends AbstractHasard {
	resolve(unresolved, runOpts) {
		// Do not resolve "source" here, it will be resolved in generate
		const overrideUnresolved = Object.assign({}, unresolved);
		delete overrideUnresolved.source;

		return Object.assign(super.resolve(overrideUnresolved, runOpts), {source: unresolved.source});
	}

	generate({id, context, source}, runOpts) {
		if (!this.constructor.isHasard(source)) {
			return source;
		}

		const ctx = typeof (context) === 'string' ? context : 'global';

		if (!runOpts.refs || !runOpts.refs[ctx] || (runOpts.refs[ctx][id]) === undefined) {
			const res = source.runOnce(runOpts);
			if (!runOpts.refs) {
				runOpts.refs = {};
			}

			if (!runOpts.refs[ctx]) {
				runOpts.refs[ctx] = {};
			}

			runOpts.refs[ctx][id] = res;
			return res;
		}

		return runOpts.refs[ctx][id];
	}

	check(key, value) {
		if (key === 'context' && value !== null && (value) !== undefined && typeof (value) !== 'string') {
			throw (new TypeError(`${key} (${value}) must be a string`));
		}
	}

	getOpts(opts) {
		const randomString = new RandomString({
			value: new RandomValue('0123456789ABCDEF'.split('')),
			size: 16,
		});
		let source;
		let context;
		if (AbstractHasard.isHasard(opts)) {
			source = opts;
			context = null;
		} else if (typeof (opts) === 'object') {
			source = opts.source;
			context = opts.context;
		} else {
			source = opts;
			context = null;
		}

		return {
			source,
			context,
			id: randomString.runOnce(),
		};
	}
}

module.exports = ReferenceHasard;
