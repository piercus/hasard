const recursiveEach = function (array, fn, index = 0) {
	if (Array.isArray(array)) {
		const size = array.length;
		array.forEach((item, indexLocal) => {
			recursiveEach(item, fn, (index * size) + indexLocal);
		});
	} else {
		fn(array, index);
	}
};

module.exports = recursiveEach;
