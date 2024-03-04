const recursiveEach = require('./recursive-each');

module.exports = function (arr, inShape, outShape) {
	const newArr = [];
	const reverseShape = outShape.concat([]).reverse();
	recursiveEach(arr, inShape, (item, index) => {
		let remIndex = index;
		const indexes = [];

		for (const s of reverseShape) {
			const previousRem = remIndex;
			remIndex = Math.floor(remIndex / s);
			indexes.unshift(previousRem - (remIndex * s));
		}

		let current = newArr;
		for (const index of indexes.slice(0, -1)) {
			if (!current[index]) {
				current[index] = [];
			}

			current = current[index];
		}

		current[indexes.at(-1)] = item;
	});
	return newArr;
};
