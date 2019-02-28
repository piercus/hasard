[![Build Status](https://travis-ci.org/piercus/hasard.svg?branch=master)](https://travis-ci.com/piercus/hasard)

[![codecov](https://codecov.io/gh/piercus/hasard/branch/master/graph/badge.svg)](https://codecov.io/gh/piercus/hasard)

## Installation

```
npm install hasard
```

## Description

Generate random objects, arrays, values, tensors, string ... in javascript

Inspired by :
* [probability-distributions](https://github.com/Mattasher/probability-distributions)
* [imgaug](https://github.com/aleju/imgaug)

## Simple Usage

```javascript
const h = require('hasard');

const v = h.object({
	color: h.value(['white', 'yellow']), // randomly choose between 2 values
	size: h.integer([10, 20]) // randomly choose an integer between 10 and 20
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
const n = h.value({choices: ['white', 'yellow'], prng : &lt;custom prng&gt;})
```

## Basic types


### hasard.value(Array.&lt;Choice&gt;)

```javascript
const v = h.value(['white', 'yellow'])
```

### h.boolean(probability)

```javascript
const v = h.boolean(0.2); // will be true 20% of the time
```
### h.value({choices, weights})

```javascript
const v = h.value({
	choices: ['white', 'yellow'],
	weights: [0.75, 0.25]
})
```

### h.number([start, end])

```javascript
const v = h.number([0, 1])
```
### h.number({type: String, ...})

```javascript
const v = h.number({
	type: 'uniform',
	start: 0,
	end: 1,
})
```

```javascript
const v = h.number({
	type: 'normal',
	mean: -2,
	std: 3
})
```

### h.integer([start, end])

```javascript
const v = h.integer([0, 10])

```

### h.integer({type: String, ...})

```javascript
const v = h.number({
	type: 'poisson',
	lambda: 3
})
```
### h.string({value, size})

```javascript
const v = h.string({
	value: h.value(["a", "b", "c", "d"]),
	size: h.integer([5, 10])
})
```

### h.array({value, size})

```javascript
const v = h.array({
	value: h.integer([0, 255]),
	size: h.integer([5, 10]),
})
```

### h.array(&lt;Hasard&gt;)

```javascript
const v = h.array([
	h.integer([0, 255]),
	h.integer([0, 255]),
	h.integer([0, 255])
])
```
### h.object(Object.&lt;String, Hasard&gt;)

```javascript
const obj = h.object({
	color1 : h.value(['white', 'yellow']),
	color2 : h.value(['black', 'grey'])
})
```

### h.matrix({value, shape})

create matrix with a specific shape

```javascript
const v = h.matrix({
	value: h.integer([0, 255]),
	shape: [128,128,3]
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
})
```

### hasard.Reference(&lt;Hasard&gt;)

The reference is used to run only once the random generator on an object.

Let's take an example of how it can be used

```
const value = h.integer([0, 255])
const v = h.array([
	value,
	value,
	value
])

v.run(2) 
// all values are randomized independantly
// [[22, 128, 54], [250, 134, 12]]

const ref = h.reference(hasard.Integer([0, 255]));
const v = h.array([
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
const value = h.integer([0, 255])

hasard.isHasard(value)// true
hasard.isHasard([0, 255]) // false
```

### hasard.fn(Function)

Example of use

```
const refA = h.reference(h.number([0, 1]))
const refB = h.reference(h.number([0, 1]))

const addHasard = hasard.fn((a, b) =&gt; {
	return a + b;
});

const obj = h.object({
	a: refA,
	b: refB,
	sum: addHasard(refA, refB)
});
```
## Operators

Operators are shortcuts to not use `hasard.fn` for each operation


## hasard.add(&lt;Hasard&gt;, &lt;Hasard&gt;, ...)
```
const refA = h.reference(h.number([0, 1]))
const refB = h.reference(h.number([0, 1]))

const obj = h.object({
	a: refA,
	b: refB,
	sum: hasard.add(refA, refB)
});
```

## hasard.substract(&lt;Hasard&gt;, &lt;Hasard&gt;)
```
const refA = h.reference(h.number([0, 1]))
const refB = h.reference(h.number([0, 1]))

const obj = h.object({
	a: refA,
	b: refB,
	diff: hasard.substract(refA, refB)
});
```

## hasard.multiply(&lt;Hasard&gt;, &lt;Hasard&gt;)
```
const refA = h.reference(h.number([0, 1]))
const refB = h.reference(h.number([0, 1]))

const obj = h.object({
	a: refA,
	b: refB,
	mul: hasard.multiply(refA, refB)
});
```

## hasard.divide(&lt;Hasard&gt;, &lt;Hasard&gt;)
```
const refA = h.reference(h.number([0, 1]))
const refB = h.reference(h.number([1, 2]))

const obj = h.object({
	a: refA,
	b: refB,
	ratio: hasard.divide(refA, refB)
});
```


## hasard.if(condition, iftrue, iffalse)
## hasard.round(&lt;Number&gt;)
## hasard.floor(&lt;Number&gt;)
## hasard.ceil(&lt;Number&gt;)
## hasard.concat(Array, Array)



