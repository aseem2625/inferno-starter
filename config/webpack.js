const { join } = require('path');
const ExtractText = require('extract-text-webpack-plugin');
const setup = require('./setup');

const dist = join(__dirname, '../dist');
// const exclude = /(node_modules|bower_components)/;
const exclude = ['node_modules', 'bower_components'];

module.exports = env => {
	const isProd = env && env.production;

	return {
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
			}]
		},
		plugins: setup(isProd),
		devtool: !isProd && 'eval',
		devServer: {
			contentBase: dist,
			port: process.env.PORT || 3000,
			historyApiFallback: true,
			compress: isProd,
			inline: !isProd,
			hot: !isProd
		}
	};
};
