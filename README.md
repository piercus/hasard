[![Build Status](https://travis-ci.com/piercus/hasard.svg?branch=master)](https://travis-ci.com/piercus/hasard)

[![codecov](https://codecov.io/gh/piercus/hasard/branch/master/graph/badge.svg)](https://codecov.io/gh/piercus/hasard)

## Installation

```
npm install hasard
```

## Description

Random variables and random nested objects manipulation in javascript

Inspired by :
* [probability-distributions](https://github.com/Mattasher/probability-distributions)
* [imgaug](https://github.com/aleju/imgaug)

Features: 
* Generate basic types randomly (string, number, boolean, integer)
* Nested random object (array, object, matrix)
* Use distribution to generate numbers (normal, uniform, truncated-normal) and integers (poisson, uniform)
* Add reference + context to fix a random variable value in a local context
* Easy-to-use common operators on random variable (add, substract, divide, multiply, round, ceil, floor)
* Create custom operators
* Change the Pseudorandom number generator
* Stream API

## Simple Usage

```javascript
const h = require('hasard');

const v = h.object({
	color: h.value(['white', 'yellow']), // randomly choose between 2 values
	size: h.integer(10, 20) // randomly choose an integer between 10 and 20
});

const values = v.run(3);
console.log(values);
// [{color: 'white', size: 12}, {color: 'yellow', size: 18}, {color: 'yellow', size: 17}]

const value = v.runOnce();
console.log(value);
// {color: 'white', size: 13}
```

## Prng

You can customize the [Pseudorandom number generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) which is `Math.random` by default.

```javascript
const n = h.value({choices: ['white', 'yellow'], prng: &lt;custom prng&gt;})
```

## Basic types

### h.value

#### h.value(Array.&lt;Hasard&gt;)

```javascript
const v = h.value(['white', 'yellow']);
```
#### h.value({choices, weights}) -> Hasard

```javascript
const v = h.value({
	choices: ['white', 'yellow'],
	weights: [0.75, 0.25]
});
```

## h.boolean

### h.boolean({Hasard.&lt;Number&gt;} probability) -> Hasard.&lt;Boolean&gt;

```javascript
const v = h.boolean(0.2); // will be true 20% of the time
```
### h.boolean({prob: Hasard.&lt;Number&gt;}) -> Hasard.&lt;Boolean&gt;

```javascript
const v = h.boolean({prob: 0.3}); // will be true 30% of the time
```

### h.number

#### h.number({Hasard.&lt;Number&gt;} start, {Hasard.&lt;Number&gt;} end) -> Hasard.&lt;Number&gt;

```javascript
const v = h.number(0, 1);
```

#### h.number([{Hasard.&lt;Number&gt;} start, {Hasard.&lt;Number&gt;} end]) -> Hasard.&lt;Number&gt;

```javascript
const v = h.number([0, 1]);
```
#### h.number({type: String, ...}) -> Hasard.&lt;Number&gt;

Available distribution for numbers are 
* **normal**
* **uniform** 
* **truncated-normal**
 
Please [Open an issue](https://github.com/piercus/hasard/issues/new) if you need another distribution

```javascript
const v = h.number({
	type: 'uniform',
	start: 0,
	end: 1
});
```

```javascript
const v = h.number({
	type: 'normal',
	mean: -2,
	std: 3
});
```

### h.integer

#### h.integer({Hasard.&lt;Integer&gt;} start,{Hasard.&lt;Integer&gt;} end) -> Hasard.&lt;Integer&gt;

```javascript
const v = h.integer(0, 10);
```

#### h.integer([{Hasard.&lt;Integer&gt;} start,{Hasard.&lt;Integer&gt;} end]) -> Hasard.&lt;Integer&gt;

```javascript
const v = h.integer([0, 10]);
```

#### h.integer({type: String, ...}) -> Hasard.&lt;Integer&gt;

For now, the only available distribution for integer is `poisson`, please [Open an issue](https://github.com/piercus/hasard/issues/new)

```javascript
const v = h.integer({
	type: 'poisson',
	lambda: 3
});
```
### h.string

#### h.string({value: Hasard, size: Hasard.&lt;integer&gt;}) -> Hasard.&lt;String&gt;

```javascript
const v = h.string({
	value: h.value(["a", "b", "c", "d"]),
	size: h.integer([5, 10])
});
```

### h.array

#### h.array({value: Hasard, size: Hasard.&lt;Integer&gt;}) -> Hasard.&lt;Array&gt;

```javascript
const v = h.array({
	value: h.integer([0, 255]),
	size: h.integer([5, 10]),
});
```

#### h.array(Array.&lt;Hasard&gt;) -> Hasard.&lt;Array&gt;

```javascript
const v = h.array([
	h.integer([0, 255]),
	h.integer([0, 255]),
	h.integer([0, 255])
]);
```
#### h.array({values: Array.&lt;Hasard&gt;, size: Hasard.&lt;Integer&gt;, randomOrder: Hasard.&lt;Boolean&gt;}) -> Hasard.&lt;Array&gt;

```javascript
// pick 5 digits in a randomOrder
const v = h.array({
	values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	size: 5,
	randomOrder: true
});
```
### h.object

#### h.object(Object.&lt;String, Hasard&gt;) -> Hasard.&lt;Object&gt;

```javascript
const obj = h.object({
	color1 : h.value(['white', 'yellow']),
	color2 : h.value(['black', 'grey'])
});
```
#### h.object(Hasard.<Array.<String>>, Hasard) -> Hasard.&lt;Object&gt;

```javascript
const phoneNumber = hasard.array({
	value: hasard.add(
		new hasard.Value(['+33', '+32', '+1']),
		new hasard.String({
			value: new hasard.Value(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']),
			size: 9 // 9 digits in phone numbers
		})
	),
	size : 5 // 5 keys
});

const fullName = hasard.add(
	new hasard.Value(['Mr ', 'M ']),
	new hasard.Value(['Thomas ', 'Nicolas ', 'Julien ', 'Quentin ', 'Maxime ']),
	new hasard.Value(['DURAND', 'DUBOIS', 'LEFEBVRE', 'MOREAU', 'MOREL', 'FOURNIER'])
);

const randomPhoneDirectory = h.object(phoneNumber, fullName);

randomPhoneDirectory.run(2) // run 2 times
//
// { 
//   '+33236972292': 'M Julien FOURNIER',
//   '+1833509762': 'Mr Quentin DURAND',
//   '+33210149263': 'Mr Maxime MOREAU',
//   '+1807872258': 'Mr Julien DURAND',
//   '+32215961607': 'M Julien DUBOIS'
// }
// 
// { 
//   '+32067043361': 'Mr Nicolas MOREL',
//   '+33898861064': 'Mr Thomas DURAND',
//   '+33730685919': 'Mr Nicolas MOREL',
//   '+33723780566': 'M Nicolas FOURNIER',
//   '+33515400984': 'Mr Quentin DUBOIS'
// }
```

### h.matrix

#### h.matrix({value: Hasard, shape: Hasard.&lt;Array.&lt;Integer&gt;&gt;}) -> Hasard.&lt;Matrix&gt;

create matrix with a specific shape

```javascript
const v = h.matrix({
	value: h.integer([0, 255]),
	shape: [128, 128, 3]
});
```

create random matrix with random values and random size

```javascript
const v = h.matrix({
	value: h.integer([0, 255]),
	shape: h.array({
		value: h.integer([5, 10]),
		size: h.integer([1, 4])
	})
});
```
### h.reference

#### h.reference(Hasard) -> Hasard

A reference is generated only once per objet per run.

Let's take an example of how it can be used

```javascript
const value = h.integer([0, 255]);
const v = h.array([
	value,
	value,
	value
]);

v.run(2);
// all values are randomized independently
// [[22, 128, 54], [250, 134, 12]]

const ref = h.reference(h.Integer([0, 255]));
const v = h.array([
	ref,
	ref,
	ref
]);

v.run(2);
// reference is reused inside the same run
// [[72, 72, 72], [114, 114, 114]]
```

#### h.reference({source: Hasard, context: Hasard.&lt;String&gt;}) -> Hasard

When defined with a context, the reference is related to a context.
You can define a context with any Hasard tool, by using `{contextName: &lt;name of the context&gt;}`

```javascript

// we will create a grey image in RGB so R = G = B
const ref = h.reference({
	source: h.Integer([0, 255]),
	context: 'pixel'
});

// Here we need to use the form h.array({values, contextName})
const pixel = h.array({
	values: [
		ref,
		ref,
		ref
	],
	contextName: 'pixel'
});

const img = h.matrix({
	value: pixel,
	shape: [2,2]
})

v.run(2);
// reference is reused inside the same pixel
// [
//   [[[12, 12, 12],[145, 145, 145]],[[251, 251, 251],[88, 88, 88]]], // first run,
//   [[[212, 212, 212],[2, 2, 2]],[[78, 78, 78],[130, 130, 130]]] // second run,
//]
```

## Helpers

#### h.isHasard(Any) -> Boolean

Check if the object is an instance of the hasard library

```javascript
const value = h.integer([0, 255]);

h.isHasard(value); // true
h.isHasard([0, 255]); // false
```

#### h.fn(Function(Any, ...)) -> Function(Hasard.&lt;Any&gt;, ...)

Example of use

```javascript
const refA = h.reference(h.number(0, 1));
const refB = h.reference(h.number(0, 1));

const addHasard = h.fn((a, b) =&gt; {
	return a + b;
});

const obj = h.object({
	a: refA,
	b: refB,
	sum: addHasard(refA, refB)
});
```
## Shortcuts

Hasard provides shortcuts for most common operations

#### h.add(Hasard.&lt;Number&gt;, Hasard.&lt;Number&gt;, ...) -> Hasard.&lt;Number&gt;
```javascript
const refA = h.reference(h.number(0, 1));
const refB = h.reference(h.number(0, 1));

const obj = h.object({
	a: refA,
	b: refB,
	sum: h.add(refA, refB)
});
```
#### h.add(Hasard.&lt;String&gt;, Hasard.&lt;String&gt;, ...) -> Hasard.&lt;String&gt;
```javascript
const a = h.value(['M. ', 'Mme ']);
const b = h.value(['DUPONT', 'DURANT']);

h.add(a, b).run(2)
// ['M. DUPONT', 'M. DURANT']
```

#### h.substract(Hasard.&lt;Number&gt;, Hasard.&lt;Number&gt;) -> Hasard.&lt;Number&gt;
```javascript
const refA = h.reference(h.number(0, 1));
const refB = h.reference(h.number(0, 1));

const obj = h.object({
	a: refA,
	b: refB,
	diff: h.substract(refA, refB)
});
```

#### h.multiply(Hasard.&lt;Number&gt;, Hasard.&lt;Number&gt;) -> Hasard.&lt;Number&gt;
```javascript
const refA = h.reference(h.number(0, 1));
const refB = h.reference(h.number(0, 1));

const obj = h.object({
	a: refA,
	b: refB,
	mul: h.multiply(refA, refB)
});
```

#### h.divide(Hasard.&lt;Number&gt;, Hasard.&lt;Number&gt;) -> Hasard.&lt;Number&gt;
```javascript
const refA = h.reference(h.number(0, 1));
const refB = h.reference(h.number(1, 2));

const obj = h.object({
	a: refA,
	b: refB,
	ratio: h.divide(refA, refB)
});
```

#### h.if(Hasard.&lt;Boolean&gt;, Hasard, Hasard) -> Hasard
```javascript
const test = h.boolean(0.5);
const poisson = h.reference(h.integer({type: 'poisson', lambda: '3'}));

const signedPoisson = h.multiply(h.if(test, -1, 1), poisson)
```
#### h.round(Hasard.&lt;Number&gt;) -> Hasard.&lt;Integer&gt;
```javascript
const int = h.round(h.number(0, 10));
```
#### h.floor(Hasard.&lt;Number&gt;) -> Hasard.&lt;Integer&gt;
```javascript
const int = h.floor(h.number(0, 10));
```
#### h.ceil(Hasard.&lt;Number&gt;) -> Hasard.&lt;Integer&gt;
```javascript
const int = h.ceil(h.number(0, 10));
```
#### h.concat(Hasard.&lt;Array&gt;, Hasard.&lt;Array&gt;) -> Hasard.&lt;Array&gt;
```javascript
const int = h.concat([1,2], h.array({value: h.integer([0, 10]), size: 3}));
```
#### h.getProperty(Hasard.&lt;Number&gt;, Hasard.&lt;Object&gt; | Hasard.&lt;Array&gt;) -> Hasard
```javascript
const int = h.getProperty(0, h.array({value: h.integer([0, 10]), size: 3}));
```
## Nested randomness

Using `set` method, object properties can be set afterward

### Generate a random nested Object

```javascript
const randomValue = h.value();

const randomInteger = h.integer({type: 'poisson', lambda: 4});

const randomString = h.string({
	size: h.add(randomInteger, 5),
	value: h.value('abcdefghijklmnopkrstuvw'.split(''))
});

const randomNumber = h.number(0, 100);

const randomKeys = h.array({
	size: randomInteger,
	value: randomString
});

const randomObject = h.object(
	randomKeys,
	randomValue
);

randomValue.set({
	choices: [
		randomString,
		randomObject,
		randomNumber,
		randomInteger
	]
});

console.log(randomObject.run(1));
```

## Stream API

```javascript
const h = require('hasard');

const v = h.object({
	color: h.value(['white', 'yellow']), // randomly choose between 2 values
	size: h.integer(10, 20) // randomly choose an integer between 10 and 20
});

const streamValue = v.stream(3);

streamValue.on('data', d => {
	console.log(d);
})
```
