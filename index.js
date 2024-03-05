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

const HasardLib = {...Hasard, ...methods(null)};

// Exports from operators.js
export const multiply = HasardLib.multiply;
export const divide = HasardLib.divide;
export const add = HasardLib.add;
export const substract = HasardLib.substract;
// Can not export symbol 'if'
// export const if = HasardLib.if;
export const round = HasardLib.round;
export const ceil = HasardLib.ceil;
export const floor = HasardLib.floor;
export const concat = HasardLib.concat;
export const getProperty = HasardLib.getProperty;
// End of exports from operators.js

// exports from helpers
export const isHasard = HasardLib.isHasard;
export const fn = HasardLib.fn;
export const int = HasardLib.int;
export const num = HasardLib.num;
export const str = HasardLib.str;
export const ref = HasardLib.ref;
// End of exports from helpers

// export from cstrs
export const Integer = HasardLib.Integer;
export const Value = HasardLib.Value;
export const Array = HasardLib.Array;
// Export const Object = HasardLib.Object;
export const Number = HasardLib.Number;
export const Matrix = HasardLib.Matrix;
export const String = HasardLib.String;
export const Boolean = HasardLib.Boolean;
export const Reference = HasardLib.Reference;
export const Function = HasardLib.Function;
// End of export from cstrs

// export from lowercased cstrs
export const integer = HasardLib.Integer;
export const value = HasardLib.Value;
export const array = HasardLib.Array;
export const object = HasardLib.Object;
export const number = HasardLib.Number;
export const matrix = HasardLib.Matrix;
export const string = HasardLib.String;
export const boolean = HasardLib.Boolean;
export const reference = HasardLib.Reference;
// Export const function = HasardLib.Function;
// end of export from lowercased cstrs

// export default
export default HasardLib;
