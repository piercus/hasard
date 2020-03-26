/* eslint no-new: "off" */
/* eslint ava/prefer-async-await: "off" */
const test = require('ava');
const testDistribution = require('./helpers/test-distribution');
const hasard = require('..');

test('Avoid duplication of randomly selected value (#3)', t => {
	const choices = ['a', 'b', 'c'];
	const random1 = hasard.value(choices);
	const ref1 = hasard.reference(random1);

	const antiChoicesFn = hasard.fn(a => {
		const index = choices.indexOf(a);
		const remaining = choices.slice(0, index).concat(choices.slice(index + 1));
		return remaining;
	});

	const differentValues = hasard.array([
		ref1,
		hasard.value(antiChoicesFn(ref1))
	]);

	return testDistribution(t,
		differentValues,
		(t, a) => {
			t.not(a[0], a[1]);
		}
	);
});
