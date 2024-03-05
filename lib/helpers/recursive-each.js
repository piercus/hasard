const recursiveEach = function (array, inShape, function_, index = 0) {
	if (Array.isArray(array) && inShape.length > 0) {
		const size = array.length;
		for (const [indexLocal, item] of array.entries()) {
			recursiveEach(item, inShape.slice(1), function_, (index * size) + indexLocal);
		}
	} else {
		function_(array, index);
	}
};

module.exports = recursiveEach;
