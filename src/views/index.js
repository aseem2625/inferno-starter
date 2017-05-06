import Inferno from 'inferno'
import { Route, IndexRoute } from 'inferno-router'

import Home from './containers/Home';
import AppContainer from './containers/AppContainer';
import Article from './containers/Article';
import Error404 from './containers/errors/404';
import Credit from './containers/Credit';
import Blog from './containers/Blog';

export default (
	<Route component={ AppContainer }>
		<IndexRoute path="/" component={ Home } />
		<Route path="/credit" component={ Credit } />
		<Route path="/blog" component={ Blog } />
		<Route path="/blog/:title" component={ Article } />
		<Route path="*" component={ Error404 } />
	</Route>
);
