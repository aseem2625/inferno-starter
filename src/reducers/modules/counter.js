import request from '../../utils/request';

// Actions
const INCREMENT = 'LOAD';
const ASYNC_FETCH = 'ASYNC_FETCH';

// Initial State
const initialState = {
	counter: 50
};

// Reducer
export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case  INCREMENT:
			console.log('STATE COUNTER..', state.counter);
			return {
				...state,
				counter: state.counter + 1
			};
		break;

		case `${ASYNC_FETCH}::PENDING`:
			console.log('Async Fetch Pending....', action);
			return {
				...state,
				counter: state.counter + 0.5
			};
		break;

		case `${ASYNC_FETCH}::SUCCESS`:
			console.log('Async Fetch Resolved....', action);
			return {
				...state,
				counter: state.counter + action.response.count
			};
		break;

		case `${ASYNC_FETCH}::ERROR`:
			console.log('Async Fetch Error....', action);
			return {
				...state,
				counter: state.counter - 50
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

// Action Creators
export function getAsyncData() {
	console.log("Getting Async Data");
	return {
		type: ASYNC_FETCH,
		payload: request('https://jsonplaceholder.typicode.com/posts', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json' // To send body as JSON.stringify
				},
				body: JSON.stringify({
					key1: 'hello',
					key2: [1,2,3],
					count: 6,
					success: true
				})
			}
		).then(res => {
			console.log('*DISPATCHER...THEN...', res);

			return res; // RETURN RESPONSE IF THEN IS WRITTEN HERE
		}).catch( e => {
			console.log('*DISPATCHER...CATCH...', e);

			throw e; // THROW ERROR IF CATCH IS WRITTEN HERE
		})
	};
}

// CHECK THENABLE HERE.. ALSO.. CHECK THENABLE IN UI...
