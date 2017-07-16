const { join } = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
// const BabiliPlugin = require('babili-webpack-plugin');

const babel = require('./babel');

module.exports = isProd => {

	// base plugins array
	const plugins = [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
			'__SERVER__': true
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				babel,
				postcss: [
					require('autoprefixer')({ browsers:['last 3 version'] })
				]
			}
		})
	];

	if (isProd) {
		plugins.push(
			new webpack.LoaderOptionsPlugin({ minimize:true, debug:true }),
			new webpack.optimize.ModuleConcatenationPlugin()
/*
			new BabiliPlugin({
				mangle: { topLevel: true },
			}),
*/
			// new ExtractText('[name].[chunkhash].css') //  I want each .html to go with it's own separate css
		);
	} else {
		// dev only
		plugins.push(
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin()
		);
	}

	return plugins;
};
