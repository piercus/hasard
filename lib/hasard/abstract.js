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
		return Promise.resolve(this.run());
	}

	_runOnce() {
		const ctxt = Object.assign({},this._resolved);
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

module.exports = AbstractHasard;
