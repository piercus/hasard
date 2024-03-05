/* eslint no-new: "off" */
/* eslint ava/prefer-async-await: "off" */
import test from 'ava';
import h, {
	Value, Boolean, Number, Integer, String, Array as _Array, add, Matrix, Reference, fn,
} from '../index.js';
import testDistribution from './helpers/test-distribution.js';

test('hasard.Value(Array.<Any>)', t => {
	const values = ['white', 'yellow'];

	return testDistribution(t,
		new Value(values),
		(t, a) => {
			t.not(values.indexOf(a), -1);
		},
		(t, as) => {
			const counts = values.map(s => as.filter(v => v === s).length / as.length);
			const average = 1 / values.length;
			const threshold = 1 / Math.sqrt(as.length);
			for (const c of counts) {
				t.true(Math.abs(c - average) < threshold); // TODO: change this test failed randomly L 22
			}
		},
	);
});

test('hasard.Boolean(Number)', t => {
	const p = 0.2;

	return testDistribution(t,
		new Boolean(p),
		(t, a) => {
			t.is(typeof (a), 'boolean');
		},
		(t, as) => {
			const counts = [true, false].map(s => as.filter(v => v === s).length / as.length);
			const expected = [p, 1 - p];
			const threshold = 1 / Math.sqrt(as.length);
			for (const [index, c] of counts.entries()) {
				t.true(Math.abs(c - expected[index]) < threshold);
			}
		},
	);
});

test('hasard.Value(Object)', t => {
	const options = {
		choices: ['white', 'yellow'],
		weights: [0.75, 0.25],
	};

	return testDistribution(t,
		new Value(options),
		(t, a) => {
			t.not(options.choices.indexOf(a), -1);
		},
		(t, as) => {
			const counts = options.choices.map(s => as.filter(v => v === s).length / as.length);
			const expected = options.weights;
			const threshold = 1 / Math.sqrt(as.length);
			for (const [index, c] of counts.entries()) {
				t.true(Math.abs(c - expected[index]) < threshold);
			}
		},
	);
});

test('hasard.Number(Array.<Number>)', t => {
	t.throws(() => {
		new Number([1]);
	}, {instanceOf: TypeError, message: 'invalid array, range array length must be 2'});

	t.throws(() => {
		new Number([0, 1, 2]);
	}, {instanceOf: TypeError, message: 'invalid array, range array length must be 2'});

	const range = [10, 15];
	const splits = [10, 11, 12, 13, 14];

	return testDistribution(t,
		new Number(range),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= range[0]);
			t.true(a < range[1]);
		},
		(t, as) => {
			const counts = splits.map(n => as.filter(v => n <= v && v < n + 1).length / as.length);
			const average = 1 / counts.length;
			const threshold = 1 / Math.sqrt(as.length);
			for (const c of counts) {
				t.true(Math.abs(c - average) < threshold);
			}
		},
	);
});

test('hasard.Number(start, end)', t => {
	const range = [10, 15];
	const splits = [10, 11, 12, 13, 14];

	return testDistribution(t,
		new Number(range[0], range[1]),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= range[0]);
			t.true(a < range[1]);
		},
		(t, as) => {
			const counts = splits.map(n => as.filter(v => n <= v && v < n + 1).length / as.length);
			const average = 1 / counts.length;
			const threshold = 1 / Math.sqrt(as.length);
			for (const c of counts) {
				t.true(Math.abs(c - average) < threshold);
			}
		},
	);
});

test('hasard.Number(Object)', t => {
	const uniform = {
		type: 'uniform',
		start: 22,
		end: 22.2,
	};

	return testDistribution(t,
		new Number(uniform),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= uniform.start);
			t.true(a < uniform.end);
		},
		(t, as) => {
			const nSplit = 5;
			const splits = Array.from({length: nSplit}).fill(1).map((_, index) => ((uniform.end - uniform.start) * index / nSplit) + uniform.start);
			const step = splits[1] - splits[0];
			const counts = splits.map(n => as.filter(v => n <= v && v < n + step).length / as.length);
			const average = 1 / counts.length;
			const threshold = 1 / Math.sqrt(as.length);
			for (const c of counts) {
				t.true(Math.abs(c - average) < threshold); // TODO: change this test failed randomly L143
			}
		},
	).then(() => {
		const normal = {
			type: 'normal',
			mean: -2,
			std: 3,
		};

		return testDistribution(t,
			new Number(normal),
			(t, a) => {
				t.is(typeof (a), 'number');
			},
			(t, as) => {
				const sum = as.reduce((a, b) => a + b, 0);
				const average = sum / as.length;
				const variance = as.map(a => (a - average) * (a - average)).reduce((a, b) => a + b, 0) / as.length;
				const threshold = 100 / Math.sqrt(as.length);
				t.true(Math.abs(normal.mean - average) < threshold);
				t.true(Math.abs(variance - (normal.std * normal.std)) < threshold);
			},
		);
	})
		.then(() => {
			const mean = -2;
			const std = 3;
			const truncatedNormal = {
				type: 'truncated-normal',
				mean,
				std,
			};

			return testDistribution(t,
				new Number(truncatedNormal),
				(t, a) => {
					t.is(typeof (a), 'number');
					t.true(a >= mean - (2 * std));
					t.true(a < mean + (2 * std));
				},
				(t, as) => {
					const sum = as.reduce((a, b) => a + b, 0);
					const average = sum / as.length;
					const variance = as.map(a => (a - average) * (a - average)).reduce((a, b) => a + b, 0) / as.length;
					const threshold = 100 / Math.sqrt(as.length);
					t.true(Math.abs(truncatedNormal.mean - average) < threshold);
					t.true(Math.abs(variance - (truncatedNormal.std * truncatedNormal.std)) < threshold);
				},
			);
		});
});

test('hasard.Integer([start, end])', t => {
	t.throws(() => {
		new Integer([1]);
	}, {instanceOf: Error, message: '1 must be a length-2 array'});

	t.throws(() => {
		new Integer([0, 1, 2]);
	}, {instanceOf: Error, message: '0,1,2 must be a length-2 array'});

	t.throws(() => {
		new Integer([0.1, 3]);
	}, {instanceOf: Error, message: 'start (0.1) must be an integer'});

	t.throws(() => {
		new Integer([0, 3.1]);
	}, {instanceOf: Error, message: 'end (3.1) must be an integer'});

	const range = [10, 15];

	return testDistribution(t,
		new Integer(range),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.is(a, Math.floor(a));
			t.true(a >= range[0]);
			t.true(a <= range[1]);
		},
		(t, as) => {
			const values = Array.from({length: range[1] - range[0] + 1}).fill(1).map((_, i) => i + range[0]);
			const counts = values.map(n => as.filter(v => v === n).length / as.length);
			const average = 1 / values.length;
			const threshold = 1 / Math.sqrt(as.length);
			for (const c of counts) {
				t.true(Math.abs(c - average) < threshold); // TODO: change this test failed randomly L 229
			}
		},
	);
});

test('hasard.Integer(start, end)', t => {
	const range = [10, 15];

	return testDistribution(t,
		new Integer(range[0], range[1]),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.is(a, Math.floor(a));
			t.true(a >= range[0]);
			t.true(a <= range[1]);
		},
		(t, as) => {
			const values = Array.from({length: range[1] - range[0] + 1}).fill(1).map((_, i) => i + range[0]);
			const counts = values.map(n => as.filter(v => v === n).length / as.length);
			const average = 1 / values.length;
			const threshold = 1 / Math.sqrt(as.length);
			for (const c of counts) {
				t.true(Math.abs(c - average) < threshold); // TODO: change this test failed randomly L 252
			}
		},
	);
});

test('hasard.Integer({type, ...})', t => {
	const poisson = {
		type: 'poisson',
		lambda: 3,
	};

	return testDistribution(t,
		new Integer(poisson),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= 0);
		},
		(t, as) => {
			const sum = as.reduce((a, b) => a + b, 0);
			const average = sum / as.length;
			const threshold = 100 / Math.sqrt(as.length);
			t.true(Math.abs(poisson.lambda - average) < threshold);
		},
	);
});

test('hasard.String({value, size})', t => {
	const range = [5, 10];
	const chars = ['a', 'b', 'c', 'd'];
	const value = new Value(chars);
	const size = new Integer(range);

	return testDistribution(t,
		new String({value, size}),
		(t, a) => {
			t.is(typeof (a), 'string');
			t.true(a.length >= range[0]);
			t.true(a.length <= range[1]);
			for (const c of a.split('')) {
				t.not(chars.indexOf(c), -1);
			}
		},
	);
});

test('hasard.Array({value, size})', t => {
	const range = [5, 10];
	const chars = ['a', 'b', 'c', 'd'];
	const value = new Value(chars);
	const size = new Integer(range);

	return testDistribution(t,
		new _Array({value, size}),
		(t, a) => {
			t.is(typeof (a), 'object');
			t.true(a.length >= range[0]);
			t.true(a.length <= range[1]);
			for (const c of a) {
				t.not(chars.indexOf(c), -1);
			}
		},
	);
});

test('hasard.Array(<Array.<Hasard>>)', t => {
	const chars = ['a', 'b', 'c', 'd'];
	const haz = new Value(chars);
	const values = [haz, haz, haz];

	return testDistribution(t,
		new _Array(values),
		(t, a) => {
			t.is(typeof (a), 'object');
			t.is(a.length, 3);
			for (const c of a) {
				t.not(chars.indexOf(c), -1);
			}
		},
		(t, as) => {
			const allSame = as.filter(a => (a[0] === a[1]) && (a[1] === a[2]));
			t.true(allSame.length < as.length / 2);
		},
	);
});

test('hasard.Array({values, randomOrder})', t => {
	const string = 'abcdefghijklmnopqrstuvwxyz';
	const values = string.split('');
	const shuffle = new Boolean();

	return testDistribution(t,
		new _Array({values, shuffle}),
		(t, a) => {
			t.is(a.length, 26);
		},
		(t, as) => {
			const shuffled = as.filter(a => a.join('') !== string);
			const threshold = 100 / Math.sqrt(as.length);
			t.true(Math.abs((shuffled.length / as.length) - 0.5) < threshold);
		},
	);
});

test('hasard.Array({values, size})', t => {
	const string = 'abcdefghijklmnopqrstuvwxyz';
	const values = string.split('');
	const size = 15;

	t.throws(() => {
		(new _Array({values, size: 32})).runOnce();
	}, {instanceOf: Error, message: 'Cannot pick 32 elements in 26-size array'});

	return testDistribution(t,
		new _Array({values, size}),
		(t, a) => {
			t.is(typeof (a), 'object');
			t.is(a.length, size);
			for (const [index, c] of a.entries()) {
				t.not(values.indexOf(c), -1);
				// Test unicity
				t.is(a.indexOf(c), index);
			}

			// Order is still the same
			t.is(a.sort(), a);
		},
	);
});

test('hasard.Object(Object)', t => {
	const keys = {
		color1: ['white', 'yellow'],
		color2: ['black', 'grey'],
	};

	const options = {};

	for (const k of Object.keys(keys)) {
		options[k] = new Value(keys[k]);
	}

	return testDistribution(t,
		new h.Object(options),
		(t, a) => {
			for (const k of Object.keys(keys)) {
				t.not(keys[k].indexOf(a[k]), -1);
			}
		},
	);
});

test('hasard.Object(Hasard.<Array.<String>>, Hasard)', t => {
	const keys = h.array({
		value: add(
			new Value(['+33', '+32', '+1']),
			new String({
				value: new Value(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']),
				size: 10,
			}),
		),
		size: 10,
	});

	const value = add(
		new Value(['Mr ', 'M ']),
		new Value(['Thomas ', 'Nicolas ', 'Julien ', 'Quentin ', 'Maxime ']),
		new Value(['DURAND', 'DUBOIS', 'LEFEBVRE', 'MOREAU', 'MOREL', 'FOURNIER']),
	);

	t.throws(() => {
		(new h.Object(['a', 'a', 'c'], new Value(['d', 'e', 'f'])));
	},
	{instanceOf: TypeError, message: 'keys must be unique (keys[1] \'a\' is duplicated)'});
	t.throws(() => {
		(new h.Object(['a', {b: 'b'}], new Value(['d', 'e', 'f']))).runOnce();
	}, {instanceOf: TypeError, message: 'keys must be string array (keys[1] \'[object Object]\' should be a string)'});

	return testDistribution(t,
		new h.Object(
			keys,
			value,
		),
		(t, a) => {
			t.is(Object.keys(a).length, 10);
		},
	);
});

test('hasard.Matrix(Object)', t => {
	const shapeSize = [1, 4];
	const shapeValues = [5, 10];
	const values = [0, 255];

	const options = {
		value: new Integer(values),
		shape: new _Array({
			value: new Integer(shapeValues),
			size: new Integer(shapeSize),
		}),
	};

	const testSameSize = function (a, t) {
		if (a.length === 0) {
			t.fail();
		} else if (Array.isArray(a[0])) {
			const size = a[0].length;
			for (const b of a) {
				t.is(b.length, size);
				testSameSize(b, t);
			}
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
		new Matrix(options),
		(t, a) => {
			t.true(Array.isArray(a));
			testSameSize(a, t);
			const shape = getShape(a);
			t.true(shape.length >= shapeSize[0]);
			t.true(shape.length <= shapeSize[1]);
			for (const s of shape) {
				t.true(s >= shapeValues[0]);
				t.true(s <= shapeValues[1]);
			}
		},
	);
});

test('hasard.Matrix({value: Hasard.<Array>})', t => {
	const options = {
		value: new _Array({
			value: new Integer([5, 10]),
			size: 3,
		}),
		shape: [5, 10],
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
		new Matrix(options),
		(t, a) => {
			const shape = getShape(a);
			t.deepEqual(shape, [5, 10, 3]);
		},
	);
});

test('hasard.Reference(<Hasard>) with hasard.Array(<Array>)', t => {
	const chars = ['a', 'b', 'c', 'd'];
	const haz = new Reference(new Value(chars));
	const values = [haz, haz, haz];

	return testDistribution(t,
		new _Array(values),
		(t, a) => {
			t.is(typeof (a), 'object');
			t.is(a.length, 3);
			for (const c of a) {
				t.not(chars.indexOf(c), -1);
			}
		},
		(t, as) => {
			const allSame = as.filter(a => (a[0] === a[1]) && (a[1] === a[2]));
			t.is(allSame.length, as.length);
			const first = as[0];
			const sameAsFirst = as.filter(a => (a[0] === first[0]));
			t.true(sameAsFirst.length < as.length / 2);
		},
	);
});

test('hasard.Reference(<Hasard>) with context and contextName', t => {
	const int = new Integer([0, 255]);
	const reference = new Reference({source: int, context: 'color'});

	const color = new _Array({
		values: [
			reference,
			reference,
			reference,
		],
		contextName: 'color',
	});
	const size = 10;
	const colors = new _Array({
		value: color,
		size,
	});

	return testDistribution(t,
		colors,
		(t, a) => {
			for (const color of a) {
				// Console.log(color)
				t.is(typeof (color[0]), 'number');
				t.is(color[0], color[1]);
				t.is(color[0], color[2]);
			}

			t.true(a.filter(color => a[0][0] === color[0]).length < size / 3);
		},
	);
});

test('hasard.fn(Function)', t => {
	const referenceA = new Reference(new Number([0, 1]));
	const referenceB = new Reference(new Number([0, 1]));

	const addHasard = fn((a, b) => a + b);

	const object = new h.Object({
		a: referenceA,
		b: referenceB,
		sum: addHasard(referenceA, referenceB),
	});
	return testDistribution(t,
		object,
		(t, {a, b, sum}) => {
			t.is(a + b, sum);
		},
	);
});

