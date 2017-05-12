import Inferno from 'inferno'
import { Route, IndexRoute } from 'inferno-router'

import AppContainer from './views/containers/AppContainer';
import Home from './views/containers/Home';


export default (
	<Route component={ AppContainer }>
		<IndexRoute path="/" component={ Home } />


		<Route path="/credit" getComponent={(props, cb) => {
			require.ensure([], require => cb(null, require('./views/containers/Credit').default), 'credit');
		}}/>

		<Route path="/blog" getComponent={(props, cb) => {
			require.ensure([], require => cb(null, require('./views/containers/Blog').default), 'blog');
		}}/>
		<Route path="/blog/:title" getComponent={(props, cb) => {
			require.ensure([], require => cb(null, require('./views/containers/Article').default), 'article');
		}}/>

		<Route path="*" getComponent={(props, cb) => {
			require.ensure([], require => cb(null, require('./views/containers/errors/404').default), '404');
		}}/>

	</Route>
);
