const {Readable} = require('node:stream');

class HasardReadableStream extends Readable {
	constructor(options) {
		options.objectMode = true;
		super(options);
		const {
			hasardInstance,
			number,
			runOpts,
		} = options;

		this._hasardInstance = hasardInstance;
		this._end = number;
		this._runOpts = runOpts;
		this._curr = 0;
	}

	_read() {
		setImmediate(() => {
			const res = this._hasardInstance.runOnce(this._runOpts);
			const obj = Object.assign({}, res, {index: this._curr});
			this.push(obj);
			this._curr++;
			if (this._curr === this._end) {
				this.push(null);
			}
		});
	}
}

module.exports = HasardReadableStream;
