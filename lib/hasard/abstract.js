class AbstractHasard {
	constructor(opts) {
		this._hasard = true;
		this._opts = opts;
		const all = this.getOpts(opts);
		this._unresolved = {};
		this._resolved = {};
		this._prng = opts.prng;
		Object.keys(all).forEach(k => {
			if (AbstractHasard.isHasard(all[k])) {
				this._unresolved[k] = all[k];
			} else {
				this.check(k, all[k]);
				this._resolved[k] = all[k];
			}
		});
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

	_runOnce(runOpts) {
		const ctxt = Object.assign({}, this._resolved);
		Object.keys(this._unresolved).forEach(k => {
			ctxt[k] = this._unresolved[k].runOnce(runOpts);
			this.check(k, ctxt[k]);
		});
		return this.generate(ctxt, runOpts);
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
