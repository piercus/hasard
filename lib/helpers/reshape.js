import recursiveEach from './recursive-each.js';

export default function reshape(array, inShape, outShape) {
	const newArray = [];
	const reverseShape = outShape.concat([]).reverse();
	recursiveEach(array, inShape, (item, index) => {
		let remIndex = index;
		const indexes = [];

		for (const s of reverseShape) {
			const previousRem = remIndex;
			remIndex = Math.floor(remIndex / s);
			indexes.unshift(previousRem - (remIndex * s));
		}

		let current = newArray;
		for (const index of indexes.slice(0, -1)) {
			current[index] ||= [];

			current = current[index];
		}

		current[indexes.at(-1)] = item;
	});
	return newArray;
}
