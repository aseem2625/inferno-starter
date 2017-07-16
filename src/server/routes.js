import Inferno from 'inferno'
import { Route, IndexRoute } from 'inferno-router'

import AppContainer from '../views/containers/AppContainer';
import Home from '../views/containers/Home';
import Credit from '../views/containers/Credit';
import Blog from '../views/containers/Blog';
import Article from '../views/containers/Article';
import Error404 from '../views/containers/errors/404';


export default (
	<Route component={ AppContainer }>
		<IndexRoute path="/" component={ Home } />

		<Route path="/credit" component={ Credit } />
		<Route path="/blog" component={ Blog } />
		<Route path="/blog/:title" component={ Article } />
		<Route path="*" component={ Error404 } />

	</Route>
);
