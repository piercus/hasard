module.exports = function (t, actualHasard, individualExpectation, globalExpectation = null) {
	const n = 1000;
	return actualHasard.runAsync(n).then(result => {
		t.is(result.length, n);
		for (const a of result) {
			individualExpectation(t, a);
		}

		if (globalExpectation) {
			globalExpectation(t, result);
		}
	});
};
