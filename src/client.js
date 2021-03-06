import Inferno from 'inferno';

// router-routes
import { Router } from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import viewRoutes from './routes';

//redux
import { Provider } from 'inferno-redux';
import createStore from './reducers/createStore';

import './styles/index.sass';

// isomorphic-fetch
import 'isomorphic-fetch';
import 'es6-promise/auto';

if (module.hot) {
	require('inferno-devtools');
}

const history = createBrowserHistory();
const initialState = {counter:{counter: 3}}; // We'll get this data from window.__data when passed from server in SSR
const store = createStore(initialState); // Create store with initial state

const App = () => (
	<Provider store={store}>
		<Router history={ history }>
			{ viewRoutes }
		</Router>
	</Provider>
);
Inferno.render(App(), document.getElementById('root'));


if (process.env.NODE_ENV === 'production') {
	// cache all assets if browser supports serviceworker
	if ('serviceWorker' in navigator && location.protocol === 'https:') {
		navigator.serviceWorker.register('/service-worker.js');
	}

	// add Google Analytics
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-XXXXXXXX-X', 'auto');
	ga('send', 'pageview');

	// track pages on route change
	window.ga && history.listen(obj => ga('send', 'pageview', obj.pathname));
}
