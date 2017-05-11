import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';


export default (initialState) => {
	const middlewares = [thunkMiddleware];
	const createStoreWithMiddlewares = applyMiddleware(...middlewares)(createStore);

	return createStoreWithMiddlewares(reducers, initialState);
};
