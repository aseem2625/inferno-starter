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
	console.log("Increment Simple");
	return {
		type: INCREMENT
	};
}

export function incrementExtra () {
	return (dispatch, getState) => {
		const { counter } = getState();
		if (counter.counter > 6) {
			console.log("Increment Extra");
			dispatch(increment());
			dispatch(increment());
		}
	}
}
