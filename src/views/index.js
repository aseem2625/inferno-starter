import Inferno from 'inferno'
import { Route } from 'inferno-router'

import Home from './containers/Home';
import Layout from './components/Layout';
import Article from './containers/Article';
import Error404 from './containers/errors/404';
import Credit from './containers/Credit';
import Blog from './containers/Blog';

export default (
	<Route component={ Layout }>
		<Route path="/" component={ Home } />
		<Route path="/credit" component={ Credit } />
		<Route path="/blog" component={ Blog } />
		<Route path="/blog/:title" component={ Article } />
		<Route path="*" component={ Error404 } />
	</Route>
);
