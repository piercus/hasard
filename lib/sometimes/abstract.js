class AbstractSometimes {
	constructor(opts) {
		this._sometimes = true;
		this._opts = opts;
		const all = this.getOpts(opts);
		this._unresolved = {};
		this._resolved = {};
		this._prng = opts.prng;
		Object.keys(all).forEach(k => {
			if (AbstractSometimes.isSometimes(all[k])) {
				this._unresolved[k] = all[k];
			} else {
				this.check(k, all[k]);
				this._resolved[k] = all[k];
			}
		});
	}

	prng() {
		return this._prng || Math.random();
	}

	static isSometimes(o) {
		return o && Boolean(o._sometimes);
	}

	runAsync(n) {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(this._runOnce());
		}

		return Promise.resolve(res);
	}

	_runOnce() {
		const ctxt = this._resolved;
		Object.keys(this._unresolved).forEach(k => {
			ctxt[k] = this._unresolved[k].runOnce();
			this.check(k, ctxt[k]);
		});
		return this.generate(ctxt);
	}

	run(n) {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(this._runOnce());
		}

		return res;
	}

	runOnce() {
		return this._runOnce();
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

module.exports = AbstractSometimes;
