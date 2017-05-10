// Actions
const INCREMENT = 'LOAD';

// Initial State
const initialState = {
	counter: 1
};

// Reducer
export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case  INCREMENT:
			return {
				...state,
				counter: state.counter + 1
			};
		break;

		default: return state;
	}
}

// Action Creators
export function increment() {
	return {
		type: INCREMENT
	};
}
