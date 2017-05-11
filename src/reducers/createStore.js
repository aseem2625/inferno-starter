import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';


// Creates store with thunk middleware.
// It's important to write in same order
export default function configureStore(initialState) {
 return createStore(
	 reducers,
	 initialState,
	 applyMiddleware(thunkMiddleware)
 );
}
