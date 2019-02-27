const fn = require('./hasard/function').build;

module.exports = {
	multiply: fn((...args) => args.reduce((a, b) => a * b, 1)),
	divide: fn((a, b) => a / b),
	add: fn((...args) => args.reduce((a, b) => a + b, 0)),
	substract: fn((a, b) => a - b),
	if: fn((condition, iftrue, iffalse) => condition ? iftrue : iffalse),
	round: fn(n => Math.round(n)),
	ceil: fn(n => Math.ceil(n)),
	floor: fn(n => Math.floor(n)),
	concat: fn((a, b) => a.concat(b))
};
