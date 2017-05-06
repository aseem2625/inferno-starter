import Inferno from 'inferno'
import { Route, IndexRoute } from 'inferno-router'

import AppContainer from './containers/AppContainer';
import Home from './containers/Home';


export default (
	<Route component={ AppContainer }>
		<IndexRoute path="/" component={ Home } />


		<Route path="/credit" getComponent={(props, cb) => {
			require.ensure([], require => cb(null, require('./containers/Credit').default));
		}}/>

		<Route path="/blog" getComponent={(props, cb) => {
			require.ensure([], require => cb(null, require('./containers/Blog').default));
		}}/>
		<Route path="/blog/:title" getComponent={(props, cb) => {
			require.ensure([], require => cb(null, require('./containers/Article').default), 'article');
		}}/>

		<Route path="*" getComponent={(props, cb) => {
			require.ensure([], require => cb(null, require('./containers/errors/404').default), '404');
		}}/>

	</Route>
);
