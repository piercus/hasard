/* eslint no-new: "off" */
/* eslint ava/prefer-async-await: "off" */
const test = require('ava');

const sometimes = require('..');

const testDistribution = function (t, actualSometimes, individualExpectation, globalExpectation = null) {
	const n = 100;
	return actualSometimes.runAsync(n).then(res => {
		t.is(res.length, n);
		res.forEach(a => {
			individualExpectation(t, a);
		});
		if (globalExpectation) {
			globalExpectation(t, res);
		}
	});
};

test('sometimes.Value(Array.<Any>)', t => {
	const values = ['white', 'yellow'];

	return testDistribution(t,
		new sometimes.Value(values),
		(t, a) => {
			t.not(values.indexOf(a), -1);
		},
		(t, as) => {
			const counts = values.map(s => as.filter(v => v === s).length/as.length);
			const average = 1 / values.length;
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach(c => {
				t.true(Math.abs(c - average) < threshold);
			});
		}
	);
});

test('sometimes.Boolean(Number)', t => {
	const p = 0.2;

	return testDistribution(t,
		new sometimes.Boolean(p),
		(t, a) => {
			t.is(typeof (a), 'boolean');
		},
		(t, as) => {
			const counts = [true, false].map(s => as.filter(v => v === s).length/as.length);
			const expected = [p, 1 - p];
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach((c, index) => {
				t.true(Math.abs(c - expected[index]) < threshold);
			});
		}
	);
});

test('sometimes.Value(Object)', t => {
	const opts = {
		choices: ['white', 'yellow'],
		weights: [0.75, 0.25]
	};

	return testDistribution(t,
		new sometimes.Value(opts),
		(t, a) => {
			t.not(opts.choices.indexOf(a), -1);
		},
		(t, as) => {
			const counts = opts.choices.map(s => as.filter(v => v === s).length/as.length);
			const expected = opts.choices.weights;
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach((c, index) => {
				t.true(Math.abs(c - expected[index]) < threshold);
			});
		}
	);
});

test('sometimes.Number(Array.<Number>)', t => {
	t.throws(() => {
		new sometimes.Number([1]);
	}, 'invalid array, range array length must be 2');

	t.throws(() => {
		new sometimes.Number([0, 1, 2]);
	}, 'invalid array, range array length must be 2');

	const range = [10, 15];
	const splits = [10, 11, 12, 13, 14];

	return testDistribution(t,
		new sometimes.Number(range),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= range[0]);
			t.true(a < range[1]);
		},
		(t, as) => {
			const counts = splits.map(n => as.filter(v => n <= v && v < n + 1).length/as.length);
			const average = 1 / counts.length;
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach(c => {
				t.true(Math.abs(c - average) < threshold);
			});
		}
	);
});

test('sometimes.Number(Object)', t => {
	const uniform = {
		type: 'uniform',
		start: 22,
		end: 22.2
	};

	return testDistribution(t,
		new sometimes.Number(uniform),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= uniform.start);
			t.true(a < uniform.end);
		},
		(t, as) => {
			const nSplit = 5;
			const splits = new Array(nSplit).fill(1).map((_, index) => {
				return ((uniform.end - uniform.start) * index / nSplit) + uniform.start;
			});
			const counts = splits.map(n => as.filter(v => n <= v && v < n + 1).length/as.length);
			const average = 1 / counts.length;
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach(c => {
				t.true(Math.abs(c - average) < threshold);
			});
		}
	).then(() => {
		const normal = {
			type: 'normal',
			mean: -2,
			std: 3
		};

		return testDistribution(t,
			new sometimes.Number(normal),
			(t, a) => {
				t.is(typeof (a), 'number');
			},
			(t, as) => {
				const sum = as.reduce((a, b) => a + b, 0);
				const average = sum / as.length;
				const variance = as.map(a => (a - average) * (a - average)).reduce((a, b) => a + b, 0) / as.length;
				const threshold = 1 / Math.sqrt(as.length);
				t.true(Math.abs(normal.mean - average) < threshold);
				t.true(Math.abs(variance - (normal.std * normal.std)) < threshold);
			}
		);
	});
});

test('sometimes.Integer([start, end])', t => {
	t.throws(() => {
		new sometimes.Integer([1]);
	}, '1 must be a length-2 array');

	t.throws(() => {
		new sometimes.Integer([0, 1, 2]);
	}, '0,1,2 must be a length-2 array');

	t.throws(() => {
		new sometimes.Integer([0.1, 3]);
	}, 'start (0.1) must be an integer');

	t.throws(() => {
		new sometimes.Integer([0, 3.1]);
	}, 'end (3.1) must be an integer');

	const range = [10, 15];

	return testDistribution(t,
		new sometimes.Integer(range),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.is(a, Math.floor(a));
			t.true(a >= range[0]);
			t.true(a <= range[1]);
		},
		(t, as) => {
			const values = new Array(range[1] - range[0] + 1).fill(1).map((_, i) => i + range[0]);
			const counts = values.map(n => as.filter(v => v === n).length / as.length);
			const average = 1 / values.length;
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach(c => {
				t.true(Math.abs(c - average) < threshold);
			});
		}
	);
});

test('sometimes.Integer({type, ...})', t => {
	const poisson = {
		type: 'poisson',
		lambda: 3
	};

	return testDistribution(t,
		new sometimes.Integer(poisson),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= 0);
		},
		(t, as) => {
			const sum = as.reduce((a, b) => a + b, 0);
			const average = sum / as.length;
			const threshold = 1 / Math.sqrt(as.length);
			t.true(Math.abs(poisson.lambda - average) < threshold);
		}
	);
});

test('sometimes.String({value, size})', t => {
	const range = [5, 10];
	const chars = ['a', 'b', 'c', 'd'];
	const value = new sometimes.Value(chars);
	const size = new sometimes.Integer(range);

	return testDistribution(t,
		new sometimes.String({value, size}),
		(t, a) => {
			t.is(typeof (a), 'string');
			t.true(a.length >= range[0]);
			t.true(a.length <= range[1]);
			a.split('').forEach(c => {
				t.not(chars.indexOf(c), -1);
			});
		}
	);
});

test('sometimes.Array({value, size})', t => {
	const range = [5, 10];
	const chars = ['a', 'b', 'c', 'd'];
	const value = new sometimes.Value(chars);
	const size = new sometimes.Integer(range);

	return testDistribution(t,
		new sometimes.Array({value, size}),
		(t, a) => {
			t.is(typeof (a), 'object');
			t.true(a.length >= range[0]);
			t.true(a.length <= range[1]);
			a.forEach(c => {
				t.not(chars.indexOf(c), -1);
			});
		}
	);
});

test('sometimes.Object(Object)', t => {
	const keys = {
		color1: ['white', 'yellow'],
		color2: ['black', 'grey']
	};

	const opts = {};

	Object.keys(keys).forEach(k => {
		opts[k] = new sometimes.Value(keys[k]);
	});

	return testDistribution(t,
		new sometimes.Object(opts),
		(t, a) => {
			Object.keys(keys).forEach(k => {
				t.not(a[k].indexOf(keys[k]), -1);
			});
		}
	);
});

test('sometimes.Matrix(Object)', t => {
	const shapeSize = [1, 4];
	const shapeValues = [5, 10];
	const values = [0, 255];

	const opts = {
		value: new sometimes.Integer(values),
		shape: new sometimes.Array({
			value: new sometimes.Integer(shapeValues),
			size: new sometimes.Integer(shapeSize)
		})
	};

	const testSameSize = function (a, t) {
		if (a.length === 0) {
			t.fail();
		} else if (Array.isArray(a[0])) {
			const size = a[0].length;
			a.forEach(b => {
				t.is(b.length, size);
				testSameSize(b, t);
			});
		}
	};

	const getShape = function (a) {
		if (a.length === 0) {
			return [0];
		}

		if (Array.isArray(a[0])) {
			return [a.length].concat(getShape(a[0]));
		}

		return [a.length];
	};

	return testDistribution(t,
		new sometimes.Matrix(opts),
		(t, a) => {
			t.true(a.isArray());
			testSameSize(a, t);
			const shape = getShape(a);
			t.true(shape.length >= shapeSize[0]);
			t.true(shape.length <= shapeSize[1]);
			shape.forEach(s => {
				t.true(s >= shapeValues[0]);
				t.true(s <= shapeValues[1]);
			});
		}
	);
});
