import AbstractHasard from './lib/hasard/abstract.js';
import operators from './lib/operators.js';
import HasardInteger from './lib/hasard/integer.js';
import HasardValue from './lib/hasard/value.js';
import HasardArray from './lib/hasard/array.js';
import HasardObject from './lib/hasard/object.js';
import HasardNumber from './lib/hasard/number.js';
import HasardMatrix from './lib/hasard/matrix.js';
import HasardString from './lib/hasard/string.js';
import HasardBoolean from './lib/hasard/boolean.js';
import HasardReference from './lib/hasard/reference.js';
import HasardFunction from './lib/hasard/function.js';

const cstrs = {
	Integer: HasardInteger,
	Value: HasardValue,
	Array: HasardArray,
	Object: HasardObject,
	Number: HasardNumber,
	Matrix: HasardMatrix,
	String: HasardString,
	Boolean: HasardBoolean,
	Reference: HasardReference,
	Function: HasardFunction,
};

/**
 * Lowercaed version of cstrs
 */
const shortcuts = {};
for (const key of Object.keys(cstrs)) {
	shortcuts[key.toLowerCase()] = cstrs[key].build.bind(cstrs[key], this);
}

const helpers = {
	isHasard: AbstractHasard.isHasard,
	fn: shortcuts.function,
	int: shortcuts.integer,
	num: shortcuts.number,
	str: shortcuts.string,
	ref: shortcuts.reference,
};

const methods = function (hasardContext) {
	// Return Object.assign({}, cstrs, shortcuts, operators(hasardContext), helpers);
	return {
		...cstrs, ...shortcuts, ...operators(hasardContext), ...helpers,
	};
};

export class Hasard {
	constructor(prng = Math.random.bind(Math)) {
		this.prng = prng;
		const meths = methods(this);
		for (const m of Object.keys(meths)) {
			this[m] = meths[m].bind(this);
		}
	}
}

const HasardLibrary = {...Hasard, ...methods(null)};

// Exports from operators.js
export const multiply = HasardLibrary.multiply;
export const divide = HasardLibrary.divide;
export const add = HasardLibrary.add;
export const substract = HasardLibrary.substract;
// Can not export symbol 'if'
// export const if = HasardLib.if;
export const round = HasardLibrary.round;
export const ceil = HasardLibrary.ceil;
export const floor = HasardLibrary.floor;
export const concat = HasardLibrary.concat;
export const getProperty = HasardLibrary.getProperty;
// End of exports from operators.js

// exports from helpers
export const isHasard = HasardLibrary.isHasard;
export const fn = HasardLibrary.fn;
export const int = HasardLibrary.int;
export const num = HasardLibrary.num;
export const str = HasardLibrary.str;
export const ref = HasardLibrary.ref;
// End of exports from helpers

// export from cstrs
export const Integer = HasardLibrary.Integer;
export const Value = HasardLibrary.Value;
export const Array = HasardLibrary.Array;
// Export const Object = HasardLib.Object;
export const Number = HasardLibrary.Number;
export const Matrix = HasardLibrary.Matrix;
export const String = HasardLibrary.String;
export const Boolean = HasardLibrary.Boolean;
export const Reference = HasardLibrary.Reference;
export const Function = HasardLibrary.Function;
// End of export from cstrs

// export from lowercased cstrs
export const integer = HasardLibrary.Integer;
export const value = HasardLibrary.Value;
export const array = HasardLibrary.Array;
export const object = HasardLibrary.Object;
export const number = HasardLibrary.Number;
export const matrix = HasardLibrary.Matrix;
export const string = HasardLibrary.String;
export const boolean = HasardLibrary.Boolean;
export const reference = HasardLibrary.Reference;
// Export const function = HasardLib.Function;
// end of export from lowercased cstrs

// export default
export default HasardLibrary;
