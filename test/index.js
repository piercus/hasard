/* eslint no-new: "off" */
/* eslint ava/prefer-async-await: "off" */
const test = require('ava');

const hasard = require('..');

const testDistribution = function (t, actualHasard, individualExpectation, globalExpectation = null) {
	const n = 10000;
	return actualHasard.runAsync(n).then(res => {
		t.is(res.length, n);
		res.forEach(a => {
			individualExpectation(t, a);
		});
		if (globalExpectation) {
			globalExpectation(t, res);
		}
	});
};

test('hasard.Value(Array.<Any>)', t => {
	const values = ['white', 'yellow'];

	return testDistribution(t,
		new hasard.Value(values),
		(t, a) => {
			t.not(values.indexOf(a), -1);
		},
		(t, as) => {
			const counts = values.map(s => as.filter(v => v === s).length / as.length);
			const average = 1 / values.length;
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach(c => {
				t.true(Math.abs(c - average) < threshold);
			});
		}
	);
});

test('hasard.Boolean(Number)', t => {
	const p = 0.2;

	return testDistribution(t,
		new hasard.Boolean(p),
		(t, a) => {
			t.is(typeof (a), 'boolean');
		},
		(t, as) => {
			const counts = [true, false].map(s => as.filter(v => v === s).length / as.length);
			const expected = [p, 1 - p];
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach((c, index) => {
				t.true(Math.abs(c - expected[index]) < threshold);
			});
		}
	);
});

test('hasard.Value(Object)', t => {
	const opts = {
		choices: ['white', 'yellow'],
		weights: [0.75, 0.25]
	};

	return testDistribution(t,
		new hasard.Value(opts),
		(t, a) => {
			t.not(opts.choices.indexOf(a), -1);
		},
		(t, as) => {
			const counts = opts.choices.map(s => as.filter(v => v === s).length / as.length);
			const expected = opts.weights;
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach((c, index) => {
				t.true(Math.abs(c - expected[index]) < threshold);
			});
		}
	);
});

test('hasard.Number(Array.<Number>)', t => {
	t.throws(() => {
		new hasard.Number([1]);
	}, 'invalid array, range array length must be 2');

	t.throws(() => {
		new hasard.Number([0, 1, 2]);
	}, 'invalid array, range array length must be 2');

	const range = [10, 15];
	const splits = [10, 11, 12, 13, 14];

	return testDistribution(t,
		new hasard.Number(range),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= range[0]);
			t.true(a < range[1]);
		},
		(t, as) => {
			const counts = splits.map(n => as.filter(v => n <= v && v < n + 1).length / as.length);
			const average = 1 / counts.length;
			const threshold = 1 / Math.sqrt(as.length);
			counts.forEach(c => {
				t.true(Math.abs(c - average) < threshold);
			});
		}
	);
});

test('hasard.Number(Object)', t => {
	const uniform = {
		type: 'uniform',
		start: 22,
		end: 22.2
	};

	return testDistribution(t,
		new hasard.Number(uniform),
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
			const step = splits[1] - splits[0];
			const counts = splits.map(n => as.filter(v => n <= v && v < n + step).length / as.length);
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
			new hasard.Number(normal),
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
			}
		);
	});
});

test('hasard.Integer([start, end])', t => {
	t.throws(() => {
		new hasard.Integer([1]);
	}, '1 must be a length-2 array');

	t.throws(() => {
		new hasard.Integer([0, 1, 2]);
	}, '0,1,2 must be a length-2 array');

	t.throws(() => {
		new hasard.Integer([0.1, 3]);
	}, 'start (0.1) must be an integer');

	t.throws(() => {
		new hasard.Integer([0, 3.1]);
	}, 'end (3.1) must be an integer');

	const range = [10, 15];

	return testDistribution(t,
		new hasard.Integer(range),
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

test('hasard.Integer({type, ...})', t => {
	const poisson = {
		type: 'poisson',
		lambda: 3
	};

	return testDistribution(t,
		new hasard.Integer(poisson),
		(t, a) => {
			t.is(typeof (a), 'number');
			t.true(a >= 0);
		},
		(t, as) => {
			const sum = as.reduce((a, b) => a + b, 0);
			const average = sum / as.length;
			const threshold = 100 / Math.sqrt(as.length);
			t.true(Math.abs(poisson.lambda - average) < threshold);
		}
	);
});

test('hasard.String({value, size})', t => {
	const range = [5, 10];
	const chars = ['a', 'b', 'c', 'd'];
	const value = new hasard.Value(chars);
	const size = new hasard.Integer(range);

	return testDistribution(t,
		new hasard.String({value, size}),
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

test('hasard.Array({value, size})', t => {
	const range = [5, 10];
	const chars = ['a', 'b', 'c', 'd'];
	const value = new hasard.Value(chars);
	const size = new hasard.Integer(range);

	return testDistribution(t,
		new hasard.Array({value, size}),
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

test('hasard.Array(<Array.<Hasard>>)', t => {
	const chars = ['a', 'b', 'c', 'd'];
	const haz = new hasard.Value(chars);
	const values = [haz, haz, haz];

	return testDistribution(t,
		new hasard.Array(values),
		(t, a) => {
			t.is(typeof (a), 'object');
			t.is(a.length, 3);
			a.forEach(c => {
				t.not(chars.indexOf(c), -1);
			});
		},
		(t, as) => {
			const allSame = as.filter(a => {
				return (a[0] === a[1]) && (a[1] === a[2]);
			});
			t.true(allSame.length < as.length / 2);
		}
	);
});

test('hasard.Array({values, randomOrder})', t => {
	const string = 'abcdefghijklmnopqrstuvwxyz';
	const values = string.split('');
	const shuffle = new hasard.Boolean();

	return testDistribution(t,
		new hasard.Array({values, shuffle}),
		(t, a) => {
			t.is(a.length, 26);
		},
		(t, as) => {
			const shuffled = as.filter(a => {
				return a.join('') !== string;
			});
			const threshold = 100 / Math.sqrt(as.length);
			t.true(Math.abs((shuffled.length / as.length) - 0.5) < threshold);
		}
	);
});

test('hasard.Array({values, size})', t => {
	const string = 'abcdefghijklmnopqrstuvwxyz';
	const values = string.split('');
	const size = 15;

	t.throws(() => {
		(new hasard.Array({values, size: 32})).runOnce();
	}, 'Cannot pick 32 elements in 26-size array');

	return testDistribution(t,
		new hasard.Array({values, size}),
		(t, a) => {
			t.is(typeof (a), 'object');
			t.is(a.length, size);
			a.forEach((c, index) => {
				t.not(values.indexOf(c), -1);
				// Test unicity
				t.is(a.indexOf(c), index);
			});
			// Order is still the same
			t.is(a.sort(), a);
		}
	);
});

test('hasard.Object(Object)', t => {
	const keys = {
		color1: ['white', 'yellow'],
		color2: ['black', 'grey']
	};

	const opts = {};

	Object.keys(keys).forEach(k => {
		opts[k] = new hasard.Value(keys[k]);
	});

	return testDistribution(t,
		new hasard.Object(opts),
		(t, a) => {
			Object.keys(keys).forEach(k => {
				t.not(keys[k].indexOf(a[k]), -1);
			});
		}
	);
});

test('hasard.Object(Hasard.<Array.<String>>, Hasard)', t => {
	const keys = hasard.array({
		value: hasard.add(
			new hasard.Value(['+33', '+32', '+1']),
			new hasard.String({
				value: new hasard.Value(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']),
				size: 10
			})
		),
		size: 10
	});

	const value = hasard.add(
		new hasard.Value(['Mr ', 'M ']),
		new hasard.Value(['Thomas ', 'Nicolas ', 'Julien ', 'Quentin ', 'Maxime ']),
		new hasard.Value(['DURAND', 'DUBOIS', 'LEFEBVRE', 'MOREAU', 'MOREL', 'FOURNIER'])
	);

	t.throws(() => {
		(new hasard.Object(['a', 'a', 'c'], new hasard.Value(['d', 'e', 'f'])));
	}, 'keys must be unique (keys[1] \'a\' is duplicated)');
	t.throws(() => {
		(new hasard.Object(['a', {b: 'b'}], new hasard.Value(['d', 'e', 'f']))).runOnce();
	}, 'keys must be string array (keys[1] \'[object Object]\' should be a string)');

	return testDistribution(t,
		new hasard.Object(
			keys,
			value
		),
		(t, a) => {
			t.is(Object.keys(a).length, 10);
			console.log(a);
		}
	);
});

test('hasard.Matrix(Object)', t => {
	const shapeSize = [1, 4];
	const shapeValues = [5, 10];
	const values = [0, 255];

	const opts = {
		value: new hasard.Integer(values),
		shape: new hasard.Array({
			value: new hasard.Integer(shapeValues),
			size: new hasard.Integer(shapeSize)
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
		new hasard.Matrix(opts),
		(t, a) => {
			t.true(Array.isArray(a));
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

test('hasard.Reference(<Hasard>) with hasard.Array(<Array>)', t => {
	const chars = ['a', 'b', 'c', 'd'];
	const haz = new hasard.Reference(new hasard.Value(chars));
	const values = [haz, haz, haz];

	return testDistribution(t,
		new hasard.Array(values),
		(t, a) => {
			t.is(typeof (a), 'object');
			t.is(a.length, 3);
			a.forEach(c => {
				t.not(chars.indexOf(c), -1);
			});
		},
		(t, as) => {
			const allSame = as.filter(a => {
				return (a[0] === a[1]) && (a[1] === a[2]);
			});
			t.is(allSame.length, as.length);
			const first = as[0];
			const sameAsFirst = as.filter(a => {
				return (a[0] === first[0]);
			});
			t.true(sameAsFirst.length < as.length / 2);
		}
	);
});

test('hasard.Reference(<Hasard>) with context and contextName', t => {
	const int = new hasard.Integer([0, 255]);
	const ref = new hasard.Reference({source: int, context: 'color'});

	const color = new hasard.Array({
		values: [
			ref,
			ref,
			ref
		],
		contextName: 'color'
	});
	const size = 10;
	const colors = new hasard.Array({
		value: color,
		size
	});

	return testDistribution(t,
		colors,
		(t, a) => {
			a.forEach(color => {
				// Console.log(color)
				t.is(typeof (color[0]), 'number');
				t.is(color[0], color[1]);
				t.is(color[0], color[2]);
			});

			t.true(a.filter(color => a[0][0] === color[0]).length < size / 3);
		}
	);
});

test('hasard.fn(Function)', t => {
	const refA = new hasard.Reference(new hasard.Number([0, 1]));
	const refB = new hasard.Reference(new hasard.Number([0, 1]));

	const addHasard = hasard.fn((a, b) => {
		return a + b;
	});

	const obj = new hasard.Object({
		a: refA,
		b: refB,
		sum: addHasard(refA, refB)
	});
	return testDistribution(t,
		obj,
		(t, {a, b, sum}) => {
			t.is(a + b, sum);
		}
	);
});
