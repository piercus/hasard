const AbstractHasard = require('./abstract');
const RandomString = require('./string');
const RandomValue = require('./value');

class ReferenceHasard extends AbstractHasard {
	runOnce(opts) {
		const {id} = this._resolved;
		const {source} = this._unresolved;
		if (!opts.refs || typeof (opts.refs[id]) === 'undefined') {
			const res = source.runOnce(opts);
			if (!opts.refs) {
				opts.refs = {};
			}

			opts.refs[id] = res;
			return res;
		}

		return opts.refs[id];
	}

	getOpts(source) {
		const randomString = new RandomString({
			value: new RandomValue('0123456789ABCDEF'.split('')),
			size: 16
		});

		return {
			source,
			id: randomString.runOnce()
		};
	}
}

module.exports = ReferenceHasard;
