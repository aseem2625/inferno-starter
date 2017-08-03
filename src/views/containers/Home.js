import Inferno from 'inferno';
import Component from 'inferno-component';

import { connect } from 'inferno-redux'
import { bindActionCreators } from 'redux';
import * as CounterActions from '../../reducers/modules/counter';

import { Link } from 'inferno-router';
import Card from '../components/Card';

@connect(
	state => {
		return {
			count: state.counter.counter
		};
	},
	{ ...CounterActions }
)
export default class Home extends Component {
	componentWillMount() {
		this.props.increment(); // incrementing a count
	}

	componentDidMount() {
		this.props.increment(); // incrementing a count
	}

	render() {
		const styles = require('../../styles/containers/home.sass');

		return (
			<div className="page page__home">
				<div className="temp-note">
					<b>Note:</b> If you increment the Counter to, suppose, 6 and you move to /blog and come back then count will be 8 because this component will mount again
				</div>
				<button className="temp-btn" onClick={this.props.increment}>REDUX COUNTER BUTTON</button>
				<button className="temp-btn" onClick={this.props.incrementExtra}>REDUX COUNTER JUMP BUTTON</button>
				<button className="temp-btn" onClick={()=>this.props.getAsyncData().then(res=>console.log('*HOME...THEN...', res)).catch(e=>console.log('*HOME...CATCH...', e))}>
					REDUX ASYNC FETCH BUTTON
				</button>
				<span>Counter: {this.props.count}</span>
				<Card>
					<h1>Home</h1>
					<p>This is the home page.</p>

					<p>You should check out:</p>
					<nav>
						<Link to="/foo">Foo</Link>
						<Link to="/foo/bar">Foo/Bar</Link>
					</nav>
				</Card>

				<Card>
					<h2>Features:</h2>
					<ul>
						<li>Offline Caching (via `serviceWorker`)</li>
						<li>SASS & Autoprefixer</li>
						<li>Asset Versioning (aka "cache-busting")</li>
						<li>ES2015 (ES6) and ES2016 (ES7) support</li>
						<li>Webpack Bundle Analysis (via `webpack-dashboard`)</li>
						<li>Hot Module Replacement (HMR) for all files</li>
						<li><a href="https://github.com/GoogleChrome/lighthouse" target="_blank" rel="noopener">Lighthouse</a> approved (100/100)</li>
					</ul>
				</Card>

				<Card>
					<h2>Dev Dashboard</h2>
					<p>With <a href="https://github.com/FormidableLabs/webpack-dashboard" target="_blank" rel="noopener">`webpack-dashboard`</a>, it's much easier to see what's happening inside your bundles. In addition to de-cluttering your `webpack-dev-server` log, you can quickly make sense of your bundles' `import`s and sizes.</p>

					<img data-src="/img/dev-dash.jpg" alt="dummy image description" />

					<p>The dashboard is meant to be interactive (scrollable). If you are having issues, please see the author's note:</p>
					<p>
						<blockquote>
							<strong>OSX Terminal.app users:</strong> Make sure that <strong>View → Allow Mouse Reporting</strong> is enabled, otherwise scrolling through logs and modules won't work. If your version of Terminal.app doesn't have this feature, you may want to check out an alternative such as <a href="https://www.iterm2.com/index.html" target="_blank" rel="noopener">iTerm2</a>.
						</blockquote>
					</p>
				</Card>
			</div>
		);
	}
}
