/* eslint no-new: "off" */
/* eslint ava/prefer-async-await: "off" */
import test from 'ava';
import { value, reference, fn, array, integer } from '..';
import testDistribution from './helpers/test-distribution';

test('Avoid duplication of randomly selected value (#3)', t => {
	const choices = ['a', 'b', 'c'];
	const random1 = value(choices);
	const reference1 = reference(random1);

	const antiChoicesFunction = fn(a => {
		const index = choices.indexOf(a);
		const remaining = choices.slice(0, index).concat(choices.slice(index + 1));
		return remaining;
	});

	const differentValues = array([
		reference1,
		value(antiChoicesFunction(reference1)),
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
	const v = array({
		values,
		size: integer(0, 3),
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
