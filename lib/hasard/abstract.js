class AbstractHasard {
	constructor(opts) {
		this._hasard = true;
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

	static build(...args) {
		return new this(...args);
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

	resolve(unresolved, runOpts) {
		const ctxt = {};
		Object.keys(unresolved).forEach(k => {
			ctxt[k] = unresolved[k].runOnce(runOpts);
			this.check(k, ctxt[k]);
		});
		return ctxt;
	}

	_runOnce(runOpts) {
		const ctxt = Object.assign({}, this._resolved, this.resolve(this._unresolved, runOpts));

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
