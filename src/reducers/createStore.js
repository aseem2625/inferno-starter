import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';


// Creates store with thunk middleware.
// Write in same order.
 export default createStore(
   reducers,
   applyMiddleware(thunkMiddleware)
 );
