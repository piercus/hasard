const recursiveEach = require('./recursive-each');

module.exports = function (arr, shape) {
	const newArr = [];
	const reverseShape = shape.reverse();
	recursiveEach(arr, (item, index) => {
		let remIndex = index;
		const indexes = [];

		reverseShape.forEach(s => {
			const previousRem = remIndex;
			remIndex = Math.floor(remIndex / s);
			indexes.unshift(previousRem - (remIndex * s));
		});
		let current = newArr;
		indexes.slice(0, -1).forEach(index => {
			if (!current[index]) {
				current[index] = [];
			}

			current = current[index];
		});
		current[indexes[indexes.length - 1]] = item;
	});
	return newArr;
};
