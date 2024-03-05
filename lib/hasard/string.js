import ArrayHasard from './array.js';

class StringHasard extends ArrayHasard {
	generate(context, runOptions) {
		return super.generate(context, runOptions).join('');
	}
}

export default StringHasard;
