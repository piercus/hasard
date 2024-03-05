import {Readable} from 'node:stream';

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
			const result = this._hasardInstance.runOnce(this._runOpts);
			const object = Object.assign({}, result, {index: this._curr});
			this.push(object);
			this._curr++;
			if (this._curr === this._end) {
				this.push(null);
			}
		});
	}
}

export default HasardReadableStream;
