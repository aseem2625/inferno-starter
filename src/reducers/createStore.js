import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';


// Creates store with no initialState
export default createStore(
	reducers
);
