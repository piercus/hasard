module.exports = function (t, actualHasard, individualExpectation, globalExpectation = null) {
	const n = 1000;
	return actualHasard.runAsync(n).then(res => {
		t.is(res.length, n);
		for (const a of res) {
			individualExpectation(t, a);
		}

		if (globalExpectation) {
			globalExpectation(t, res);
		}
	});
};
