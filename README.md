[![Build Status](https://travis-ci.org/piercus/sometimes.svg?branch=master)](https://travis-ci.org/piercus/sometimes)

[![codecov](https://codecov.io/gh/piercus/sometimes/branch/master/graph/badge.svg)](https://codecov.io/gh/piercus/sometimes)

## Installation

```
npm install sometimes
```

## Description

Generate random objects, arrays, values, tensors, string ... in javascript

Inspired by :
* [probability-distributions](https://github.com/Mattasher/probability-distributions)
* [imgaug](https://github.com/aleju/imgaug)

## Description

```javascript
const sometimes = require('sometimes');

const v = new sometimes.Value(['white', 'yellow'])

sometimes.run(3).then(values => {
	console.log(values)
	// ['white', 'yellow', 'white']
})

sometimes.runOnce().then(values => {
	console.log(values)
	// 'yellow'
})
```

You can customize the [Pseudorandom number generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) which is `Math.random` by default.

```
const v = new sometimes.Value({choices: ['white', 'yellow'], prng : <custom prng>})
```

## List of functions


### sometimes.Value(Array.<Choice>)

```javascript
const v = new sometimes.Value(['white', 'yellow'])
```

### sometimes.Boolean(probability)

```javascript
const v = new sometimes.Boolean(0.2); // will be true 20% of the time
```
### sometimes.Value({choices, weights})

```javascript
const v = new sometimes.Value({
	choices: ['white', 'yellow'],
	weights: [0.75, 0.25]
})
```

### sometimes.Number([start, end])

```javascript
const v = new sometimes.Number([0, 1])
```
### sometimes.Number({type: String, ...})

```javascript
const v = new sometimes.Number({
	type: 'uniform',
	start: 0,
	end: 1,
})
```

```javascript
const v = new sometimes.Number({
	type: 'poisson',
	lambda: 3
})
```

```javascript
const v = new sometimes.Number({
	type: 'normal',
	mean: -2,
	std: 3
})
```

### sometimes.Integer([start, end])

```javascript
const v = new sometimes.Integer([0, 10])

```
### sometimes.String({value, size})

```javascript
const v = new sometimes.String({
	value: new sometimes.Value(["a", "b", "c", "d"]),
	size: new sometimes.Integer([5, 10])
})
```

### sometimes.Array({value, size})

```javascript
const v = new sometimes.Array({
	value: new sometimes.Integer([0, 255]),
	size: new sometimes.Integer([5, 10]),
})
```

### sometimes.Object(Object.<String, Sometime>)

```javascript
const obj = new sometimes.Object({
	color1 : new sometimes.Value(['white', 'yellow']),
	color2 : new Sometimes.Value(['black', 'grey'])
})
```

### sometimes.Matrix({value, shape})

create matrix with a specific shape

```javascript
const v = new sometimes.Matrix({
	value: new sometimes.Integer([0, 255]),
	shape: [128,128,3]
});
```

create random matrix with random values and random size

```javascript
const v = new sometimes.Matrix({
	value: new sometimes.Integer([0, 255]),
	shape: new sometimes.Array({
		value: new sometimes.Integer([5, 10]),
		size: new sometimes.Integer([1, 4])
	})
})
```