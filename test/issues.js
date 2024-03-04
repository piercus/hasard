/* eslint no-new: "off" */
/* eslint ava/prefer-async-await: "off" */
const test = require('ava');
const hasard = require('..');
const testDistribution = require('./helpers/test-distribution');

test('Avoid duplication of randomly selected value (#3)', t => {
	const choices = ['a', 'b', 'c'];
	const random1 = hasard.value(choices);
	const reference1 = hasard.reference(random1);

	const antiChoicesFunction = hasard.fn(a => {
		const index = choices.indexOf(a);
		const remaining = choices.slice(0, index).concat(choices.slice(index + 1));
		return remaining;
	});

	const differentValues = hasard.array([
		reference1,
		hasard.value(antiChoicesFunction(reference1)),
	]);

	return testDistribution(t,
		differentValues,
		(t, a) => {
			t.not(a[0], a[1]);
		},
	);
});

test('hasard.Array({values, size: h.integer}) (#8)', t => {
	const string = 'abcdefghijklmnopqrstuvwxyz';
	const values = string.split('');
	const v = hasard.array({
		values,
		size: hasard.integer(0, 3),
	});
	return testDistribution(t,
		v,
		(t, a) => {
			t.is(typeof (a), 'object');
			t.true(a.length >= 0);
			t.true(a.length <= 3);
		},
	);
});
