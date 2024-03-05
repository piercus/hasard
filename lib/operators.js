import Hfunction from './hasard/function.js';

const {build} = Hfunction;
export default function operators(hasardContext) {
	const function_ = build.bind(Hfunction, hasardContext);
	return {
		multiply: function_((...arguments_) => arguments_.reduce((a, b) => a * b, 1)),
		divide: function_((a, b) => a / b),
		add: function_((...arguments_) => arguments_.reduce((a, b) => a + b)),
		substract: function_((a, b) => a - b),
		if: function_((condition, iftrue, iffalse) => condition ? iftrue : iffalse),
		round: function_(n => Math.round(n)),
		ceil: function_(n => Math.ceil(n)),
		floor: function_(n => Math.floor(n)),
		concat: function_((a, b) => a.concat(b)),
		getProperty: function_((key, object) => object[key]),
	};
}
