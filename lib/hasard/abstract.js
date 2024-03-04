const HasardReadableStream = require('../helpers/readable-stream');

class AbstractHasard {
	constructor(...arguments_) {
		this._hasard = true;
		if (arguments_.length === 0) {
			return;
		}

		this.set(...arguments_);
	}

	set(options) {
		this._set = true;
		this._opts = options;
		const all = this.getOpts(options);
		this._unresolved = {};
		this._resolved = {};
		if (options && (typeof (options.prng) === 'function')) {
			this._prng = options.prng.bind(options);
		}

		this._contextName = options && options.contextName;
		for (const k of Object.keys(all)) {
			if (AbstractHasard.isHasard(all[k])) {
				this._unresolved[k] = all[k];
			} else {
				this.check(k, all[k]);
				this._resolved[k] = all[k];
			}
		}
	}

	static build(hasardContext, ...arguments_) {
		const instance = new this(...arguments_);
		if (hasardContext && hasardContext.prng) {
			hasardContext._prng = hasardContext.prng;
		}

		return instance;
	}

	prng() {
		return this._prng ? this._prng() : Math.random();
	}

	static isHasard(o) {
		return o && Boolean(o._hasard);
	}

	runAsync(n) {
		return Promise.resolve(this.run(n));
	}

	stream(number, runOptions) {
		return new HasardReadableStream({
			hasardInstance: this,
			number,
			runOpts: runOptions,
		});
	}

	resolve(unresolved, runOptions) {
		const ctxt = {};
		if ((unresolved) === undefined) {
			throw (new TypeError('This instance of hasard has not been set properly'));
		}

		for (const k of Object.keys(unresolved)) {
			ctxt[k] = unresolved[k].runOnce(runOptions);
			this.check(k, ctxt[k]);
		}

		return ctxt;
	}

	_runOnce(runOptions) {
		const ctxt = Object.assign({}, this.resolve(this._unresolved, runOptions), this._resolved);

		const res = this.generate(ctxt, runOptions);
		if (this._contextName && runOptions.refs && runOptions.refs[this._contextName]) {
			delete runOptions.refs[this._contextName];
		}

		return res;
	}

	run(n, runOptions) {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(this.runOnce(runOptions));
		}

		return res;
	}

	runOnce(runOptions = {}) {
		return this._runOnce(runOptions);
	}

	generate() {
		throw (new Error('override me'));
	}

	getOpts(options) {
		delete options.prng;
		return options;
	}

	check() {
		// Do nothing, override me to do sthg
	}
}

module.exports = AbstractHasard;
