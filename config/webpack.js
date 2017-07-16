const { join } = require('path');
const ExtractText = require('extract-text-webpack-plugin');
const setup = require('./setup');
const setupServer = require('./setupServer');

const dist = join(__dirname, '../dist');
// const exclude = /(node_modules|bower_components)/;
const exclude = ['node_modules', 'bower_components', 'src/server/*.js', 'src/server.js'];
const excludeForServer = ['node_modules', 'bower_components', 'src/client/*.js', 'src/client.js'];

const nodeExternals = require('webpack-node-externals');

module.exports = env => {
	const isProd = env && env.production;

	return [{
		// FOR CLIENT SIDE
		entry: {
			app: './src/client.js'
		},
		output: {
			path: dist,
			chunkFilename : isProd ? '[name].[chunkhash].js' : '[name].js',
			filename: isProd ? '[name].[chunkhash].js' : '[name].js',
			publicPath: '/'
		},
		module: {
			rules: [{
				test: /\.js?$/,
				exclude: exclude,
				loader: 'babel-loader'
			}, {
				test: /\.(sass|scss)$/,
				loader: isProd ? ExtractText.extract({
					fallback: 'style-loader',
					use: 'css-loader!postcss-loader!sass-loader'
				}) : 'style-loader!css-loader!postcss-loader!sass-loader'
			},
/*
			{
				test: /\.ejs$/,
				loader: 'ejs-loader',
				query: {
					interpolate : /\{\{(.+?)\}\}/g,
					evaluate    : /\[\[(.+?)\]\]/g
				}
			}
*/
			]
		},
		plugins: setup(isProd),
		devtool: !isProd && 'eval',
/*		devServer: {
			contentBase: dist,
			port: process.env.PORT || 3000,
			historyApiFallback: true,
			compress: isProd,
			inline: !isProd,
			hot: !isProd
		}*/
	}, {
		// FOR SERVER SIDE
		entry: {
			server: './src/server.js'
		},
		target: 'node',
		externals: [nodeExternals()],
		output: {
			path: dist,
			filename: isProd ? '[name].[chunkhash].js' : '[name].js',
			libraryTarget: 'commonjs2',
			publicPath: '/'
		},
		module: {
			rules: [{
				test: /\.js?$/,
				exclude: excludeForServer,
				loader: 'babel-loader',
				query: {
					cacheDirectory: true
				}
			}, {
				test: /\.(sass|scss)$/,
				loader: !isProd ? ExtractText.extract({
					fallback: 'isomorphic-style-loader',
					use: 'css-loader!postcss-loader!sass-loader'
				}) : 'isomorphic-style-loader!css-loader!postcss-loader!sass-loader'
			}]
		},
		plugins: setupServer(isProd),
		devtool: !isProd && 'source-map',
	}];
};
