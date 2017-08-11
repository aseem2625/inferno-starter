import path from 'path';
import Express from 'express';

import Inferno from 'inferno';
import { renderToString } from 'inferno-server';
import { RouterContext, match } from 'inferno-router';
import createStore from './reducers/createStore';
import { Provider } from 'inferno-redux';
import config from './server/config';
import viewRoutes from './server/routes';

import * as utils from './server/utils';
import qs from 'qs';

const app = Express();

// var rootDir = path.resolve(__dirname, '..');
const appDir = path.dirname(process.mainModule.paths[0].split('node_modules')[0].slice(0, -1)); // To find root of project dynamically

// app.use(Express.static(path.join(appDir, '/dist/')));
// app.use('/static', Express.static(path.join(__dirname, '/Users/aseemgupta/Documents/Projects/inferno/PWA-SSR/dist/'))); // Serve static files

/*
- Serve static files.
- Caching static files for long time: 1 year ).
- Cache busting would auto happen due to chunkhash
- Shouldn't be done in development mode as there is no [chunkhash] in file names and cache busting wont happen
*/

const checkForHTML = req => {
	const url = req.url.split('.');
	const extension = url[url.length -1];

	if (['/'].indexOf(extension) > -1) {
		return true; //compress only .html files sent from server
	}

	return false;
};

var compress = require('compression');
app.use(compress({filter: checkForHTML}));

// Code should be moved to nginx level to serve static files
const encodeResToGzip = contentType => (req, res, next) => {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	res.set('Content-Type', contentType);

	next();
};

app.get("*.js", encodeResToGzip('text/javascript'));
app.get("*.css", encodeResToGzip('text/css'));


app.use(Express.static(path.join(appDir, '/dist/'), {
	setHeaders(res) {
		res.setHeader("Cache-Control", "public,max-age=31536000,immutable");
	}
}));
app.use('/static', function (req, res) {
	res.status(404).send('Not found');
});


// app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

app.set('views', path.join(appDir, '/dist/'));
app.set('view engine', 'ejs'); // Use embedded javascript as template engine
// app.enable('view cache');

app.use(handleRender); // This is fired every time the server side receives a request

class MyRouterContext extends RouterContext {
	getChildContext() {
		let baseContext = super.getChildContext();
		baseContext = {...baseContext, ...this.props.context};

		return baseContext;
	}
}

const App = ( store, renderProps, context) => (
	<Provider store={store}>
		<MyRouterContext {...renderProps} context={context}/>
	</Provider>
);

// Later add checks for invalid images, etc if requested
const IsStaticFile = url => {
	url = url.split('.');
	const extension = url[url.length -1];

	if (['js', 'css', 'gz'].indexOf(extension) > -1) {
		return true;
	}

	return false;
};

//TODO: https://github.com/ReactTraining/react-router/blob/v2.0.0-rc5/docs/guides/advanced/ServerRendering.md
function handleRender (req, res) {
	let fileMapping = utils.getConfig('./file_mapping.json');
	if(IsStaticFile(req.url)) {
		// js/css/gz shouldn't be reaching here as they're static files and should already have been served
		res.status(404).send('Not found');
	} else {
		const renderProps = match(viewRoutes, req.originalUrl);

		if (renderProps.redirect) {
			return res.redirect(renderProps.redirect)
		}

		// Read the counter from the request, if provided
		const params = qs.parse(req.query);
		const counter = parseInt(params.counter, 10) || null;
		const initialState = {
		};

		if (counter) {
			initialState['counter'] = {
				counter
			}
		}

		const css = []; // CSS for all rendered React components
		const context = { insertCss: (...styles) => {
			return styles.forEach(style => {
				css.push(style._getCss())
			});
		}};

		const store = createStore(initialState); // Create a new Redux store instance on every request
		const html = renderToString(App(store, renderProps, context)); // Render the requested component to a string

		const preloadedState = store.getState();
		console.log('wow PRELOADAED STATE...', preloadedState);
		const requestedRouteFile = fileMapping[renderProps.matched.props.children.props.filename];
		console.log('RENDER FILE NAME..', requestedRouteFile);

		// TODO: Don't renderToString the app but pass custom html, like loader div, in case of high server load.
		// TODO: However, data can still be sent bcoz it won't increase load on server
		// res.send(renderFullPage(html, preloadedState)) // Send the rendered page back to the client

		//TODO: use dangerouslySetInnerHtml in .ejs for performance. Sanitze html before passing data
		res.render('./index.ejs', renderFullPage(html, preloadedState, requestedRouteFile, css));
	}
}


function renderFullPage (html, preloadedState, requestedRouteFile, css) {
	preloadedState = JSON.stringify(preloadedState).replace(/</g, '\\u003c');
	return {
		html: html,
		preloadedState: preloadedState,
		requestedRouteFile: requestedRouteFile,
		css: css.join('')
	};
}

if (config.port) {
	var server = app.listen(config.port, (err) => {
		if (err) {
			console.error(err);
		}
		const host = server.address().address;
		const port = server.address().port;

		console.log('Open %s:%s in a browser to view the app', host, port);
		// console.info('==>     Open %s:%s in a browser to view the app.', config.host, config.port);
	});
} else {
	console.error('==>     ERROR: No PORT environment variable has been specified');
}
