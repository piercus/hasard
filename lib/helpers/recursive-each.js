const recursiveEach = function (array, inShape, fn, index = 0) {
	if (Array.isArray(array) && inShape.length > 0) {
		const size = array.length;
		array.forEach((item, indexLocal) => {
			recursiveEach(item, inShape.slice(1), fn, (index * size) + indexLocal);
		});
	} else {
		fn(array, index);
	}
};

module.exports = recursiveEach;
