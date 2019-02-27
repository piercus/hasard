[![Build Status](https://travis-ci.org/piercus/sometimes.svg?branch=master)](https://travis-ci.org/piercus/hasard)

[![codecov](https://codecov.io/gh/piercus/sometimes/branch/master/graph/badge.svg)](https://codecov.io/gh/piercus/hasard)

## Installation

```
npm install hasard
```

## Description

Generate random objects, arrays, values, tensors, string ... in javascript

Inspired by :
* [probability-distributions](https://github.com/Mattasher/probability-distributions)
* [imgaug](https://github.com/aleju/imgaug)

## Usage

```javascript
const hasard = require('hasard');

const v = new hasard.Object({
	color: new hasard.Value(['white', 'yellow']),
	size: new hasard.Integer([10, 20])
});

const values = v.run(3);
console.log(values);
// [{color: 'white', size: 12}, {color: 'yellow', size: 18}, {color: 'yellow', size: 17}]

const value = v.runOnce()
console.log(value)
// {color: 'white', size: 13}

```

You can customize the [Pseudorandom number generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) which is `Math.random` by default.

```
const n = new hasard.Value({choices: ['white', 'yellow'], prng : <custom prng>})
```

## Basic types


### new hasard.Value(Array.<Choice>)

```javascript
const v = new hasard.Value(['white', 'yellow'])
```

### new hasard.Boolean(probability)

```javascript
const v = new hasard.Boolean(0.2); // will be true 20% of the time
```
### new hasard.Value({choices, weights})

```javascript
const v = new hasard.Value({
	choices: ['white', 'yellow'],
	weights: [0.75, 0.25]
})
```

### new hasard.Number([start, end])

```javascript
const v = new hasard.Number([0, 1])
```
### new hasard.Number({type: String, ...})

```javascript
const v = new hasard.Number({
	type: 'uniform',
	start: 0,
	end: 1,
})
```

```javascript
const v = new hasard.Number({
	type: 'poisson',
	lambda: 3
})
```

```javascript
const v = new hasard.Number({
	type: 'normal',
	mean: -2,
	std: 3
})
```

### new hasard.Integer([start, end])

```javascript
const v = new hasard.Integer([0, 10])

```
### new hasard.String({value, size})

```javascript
const v = new hasard.String({
	value: new hasard.Value(["a", "b", "c", "d"]),
	size: new hasard.Integer([5, 10])
})
```

### new hasard.Array({value, size})

```javascript
const v = new hasard.Array({
	value: new hasard.Integer([0, 255]),
	size: new hasard.Integer([5, 10]),
})
```

### new hasard.Array(<Hasard>)

```javascript
const v = new hasard.Array([
	new hasard.Integer([0, 255]),
	new hasard.Integer([0, 255]),
	new hasard.Integer([0, 255])
])
```
### new hasard.Object(Object.<String, Hasard>)

```javascript
const obj = new hasard.Object({
	color1 : new hasard.Value(['white', 'yellow']),
	color2 : new Hasard.Value(['black', 'grey'])
})
```

### new hasard.Matrix({value, shape})

create matrix with a specific shape

```javascript
const v = new hasard.Matrix({
	value: new hasard.Integer([0, 255]),
	shape: [128,128,3]
});
```

create random matrix with random values and random size

```javascript
const v = new hasard.Matrix({
	value: new hasard.Integer([0, 255]),
	shape: new hasard.Array({
		value: new hasard.Integer([5, 10]),
		size: new hasard.Integer([1, 4])
	})
})
```

### hasard.Reference(<Hasard>)

The reference is used to run only once the random generator on an object.

Let's take an example of how it can be used

```
const value = new hasard.Integer([0, 255])
const v = new hasard.Array([
	value,
	value,
	value
])

v.run(2) 
// all values are randomized independantly
// [[22, 128, 54], [250, 134, 12]]

const ref = new hasard.Reference(hasard.Integer([0, 255]));
const v = new hasard.Array([
	ref,
	ref,
	ref
])

v.run(2) 
// reference are reused inside the same run
// [[72, 72, 72], [114, 114, 114]]

```


## Helpers

### hasard.isHasard(Any)

Is the object is an instance of the hasard library

```
const value = new hasard.Integer([0, 255])

hasard.isHasard(value)// true
hasard.isHasard([0, 255]) // false
```

### hasard.fn(Function)

Example of use

```
const refA = new hasard.Reference(new hasard.Number([0, 1]))
const refB = new hasard.Reference(new hasard.Number([0, 1]))

const addHasard = hasard.fn((a, b) => {
	return a + b;
});

const obj = new hasard.Object({
	a: refA,
	b: refB,
	sum: addHasard(refA, refB)
});
```
## Operators

Operators are shortcuts to not use `hasard.fn` for each operation


## hasard.add(<Hasard>, <Hasard>, ...)
```
const refA = new hasard.Reference(new hasard.Number([0, 1]))
const refB = new hasard.Reference(new hasard.Number([0, 1]))

const obj = new hasard.Object({
	a: refA,
	b: refB,
	sum: hasard.add(refA, refB)
});
```

## hasard.substract(<Hasard>, <Hasard>)
```
const refA = new hasard.Reference(new hasard.Number([0, 1]))
const refB = new hasard.Reference(new hasard.Number([0, 1]))

const obj = new hasard.Object({
	a: refA,
	b: refB,
	diff: hasard.substract(refA, refB)
});
```

## hasard.multiply(<Hasard>, <Hasard>)
```
const refA = new hasard.Reference(new hasard.Number([0, 1]))
const refB = new hasard.Reference(new hasard.Number([0, 1]))

const obj = new hasard.Object({
	a: refA,
	b: refB,
	mul: hasard.multiply(refA, refB)
});
```

## hasard.divide(<Hasard>, <Hasard>)
```
const refA = new hasard.Reference(new hasard.Number([0, 1]))
const refB = new hasard.Reference(new hasard.Number([1, 2]))

const obj = new hasard.Object({
	a: refA,
	b: refB,
	ratio: hasard.divide(refA, refB)
});
```
