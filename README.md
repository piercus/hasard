## Installation

```
npm install sometimes
```

## Description

Generate random objects, arrays, values, tensors, string ... in javascript

Inspired by :
* [probability-distributions](https://github.com/Mattasher/probability-distributions)
* [imgaug](https://github.com/aleju/imgaug)


## sometimes.Value(Array.<Any>)

```javascript
const v = new sometimes.Value(['white', 'yellow'])
```

## sometimes.Boolean(Number)

```javascript
const v = new sometimes.Boolean(0.2); // will be true 20% of the time
```

## sometimes.Value(Object)

```javascript
const v = new sometimes.Value({
	choices: ['white', 'yellow'],
	weights: [0.75, 0.25]
})
```
## sometimes.Number(Number)

```javascript
const v = new sometimes.Number([0, 1])
```
## sometimes.Number(Object)

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

## sometimes.Integer(start, end)

```javascript
const v = new sometimes.Integer([0, 10])

```
## sometimes.String(Object)

```javascript
const v = new sometimes.String({
	value: new sometimes.Value(["a", "b", "c", "d"]),
	size: new sometimes.Integer([5, 10])
})
```

## sometimes.Array(Object)

```javascript
const v = new sometimes.Array({
	value: new sometimes.Integer([0, 255]),
	size: new sometimes.Integer([5, 10]),
})
```

## sometimes.Object(Object)

```javascript
const obj = new sometimes.Object({
	color1 : new sometimes.Value(['white', 'yellow']),
	color2 : new Sometimes.Value(['black', 'grey'])
})
```

## sometimes.Matrix(Object)

create matrix with a specific shape

```javascript
const v = new sometimes.Matrix({
	value: new sometimes.Integer([0, 255]),
	shape: new sometimes.Array({
		value: new sometimes.Integer([5, 10]),
		size: new sometimes.Integer([1, 4])
	})
})
```

create random matrix with random values and random size

```javascript
const v = new sometimes.Matrix({
	value: new sometimes.Integer([0, 255]),
	shape: [128,128,3]
});
```
