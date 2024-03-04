const h = require('..');

const randomValue = h.value();

const randomInteger = h.integer({type: 'poisson', lambda: 4});

const randomString = h.string({
	size: h.add(randomInteger, 5),
	value: h.value('abcdefghijklmnopkrstuvw'.split('')),
});

const randomNumber = h.number([0, 100]);

const randomKeys = h.array({
	size: randomInteger,
	value: randomString,
});

const randomObject = h.object(
	randomKeys,
	randomValue,
);

randomValue.set({
	choices: [
		randomString,
		randomObject,
		randomNumber,
		randomInteger,
	],
});

console.log(JSON.stringify(randomObject.run(1), null, 2));
