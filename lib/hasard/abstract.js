const HasardReadableStream = require('../helpers/readable-stream.js')

class AbstractHasard {
	constructor(...args) {
		this._hasard = true;
		if (args.length === 0) {
			return;
		}

		this.set(...args);
	}

	set(opts) {
		this._set = true;
		this._opts = opts;
		const all = this.getOpts(opts);
		this._unresolved = {};
		this._resolved = {};
		this._prng = opts && opts.prng;
		this._contextName = opts && opts.contextName;
		Object.keys(all).forEach(k => {
			if (AbstractHasard.isHasard(all[k])) {
				this._unresolved[k] = all[k];
			} else {
				this.check(k, all[k]);
				this._resolved[k] = all[k];
			}
		});
	}

	static build(hasardContext, ...args) {
		const instance = new this(...args);
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
	
	stream(number, runOpts){
		return new HasardReadableStream({
			hasardInstance: this,
			number,
			runOpts
		});
	}

	resolve(unresolved, runOpts) {
		const ctxt = {};
		if (typeof (unresolved) === 'undefined') {
			throw (new TypeError('This instance of hasard has not been set properly'));
		}

		Object.keys(unresolved).forEach(k => {
			ctxt[k] = unresolved[k].runOnce(runOpts);
			this.check(k, ctxt[k]);
		});
		return ctxt;
	}

	_runOnce(runOpts) {
		const ctxt = Object.assign({}, this.resolve(this._unresolved, runOpts), this._resolved);

		const res = this.generate(ctxt, runOpts);
		if (this._contextName && runOpts.refs && runOpts.refs[this._contextName]) {
			delete runOpts.refs[this._contextName];
		}

		return res;
	}

	run(n, runOpts) {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(this.runOnce(runOpts));
		}

		return res;
	}

	runOnce(runOpts = {}) {
		return this._runOnce(runOpts);
	}

	generate() {
		throw (new Error('override me'));
	}

	getOpts(opts) {
		delete opts.prng;
		return opts;
	}

	check() {
		// Do nothing, override me to do sthg
	}
}

module.exports = AbstractHasard;
