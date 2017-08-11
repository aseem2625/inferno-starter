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
		<IndexRoute path="/" component={ Home } filename="home.js"/>

		<Route path="/credit" component={ Credit } filename="credit.js"/>
		<Route path="/blog" component={ Blog } filename="blog.js"/>
		<Route path="/blog/:title" component={ Article } filename="article.js"/>
		<Route path="*" component={ Error404 } filename="404.js"/>

	</Route>
);
