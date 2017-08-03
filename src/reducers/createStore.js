import { createStore, applyMiddleware } from 'redux';
import clientMiddleware from './middlewares/clientMiddleware';
import reducers from './reducers';


/* Create redux store with middleware */
export default (initialState) => {
	const middlewares = [clientMiddleware];
	const createStoreWithMiddlewares = applyMiddleware(...middlewares)(createStore);

	// Hot reloading for reducers

    return createStoreWithMiddlewares(reducers, initialState);
};
