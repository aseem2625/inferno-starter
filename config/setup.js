const { join } = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const SWPrecache = require('sw-precache-webpack-plugin');
const Dashboard = require('webpack-dashboard/plugin');
const Clean = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const HTML = require('html-webpack-plugin');

const BabiliPlugin = require('babili-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ScriptExtHTML = require('script-ext-html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const uglify = require('./uglify');
const babel = require('./babel');

const root = join(__dirname, '..');

module.exports = isProd => {

	// base plugins array
	const plugins = [
		new Clean(['dist'], { root }),
		// new Copy([{context: 'src/static/', from: '**/*.*'}]),
		new Copy([{from: 'src/static/', to: 'static/'}]),
		new Copy([{from: 'src/manifest.json', to: 'manifest.json'}]),
		new webpack.optimize.CommonsChunkPlugin({
			name:'vendor',
			minChunks: function (module) {
				return module.context && module.context.indexOf('node_modules') !== -1;
			}
			// minChunks: module => /node_modules/.test(module.resource)
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
		}),
		/*
		 new webpack.optimize.CommonsChunkPlugin({
		 names: ['vendor', 'manifest'],
		 }),
		 */

		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
			'__SERVER__': false
		}),
		new webpack.ProvidePlugin({
			_: 'lodash'
		}),
		new HTML({
			// template: '!!raw-loader!src/index.ejs', // raw-loader to avoid html-plugin to evaluate ejs variables which will throw error
			template: 'src/index.ejs',
			filename: 'index.ejs',
			inject: 'head',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				minifyCSS: true,
				minifyJS: true
			},
			ejsVarInject: {
				html: '<%- html %>',
				preloadedState: '<%- preloadedState %>',
				requestedRouteFile: '<%- requestedRouteFile %>'
			}
		}),
		new ScriptExtHTML({
			defer: ['vendor', 'app'] // Useful in SSR because these are no longer Critical resources
		}),
		// To insert manifest.js directly into .ejs template. Saves 1 http request
		new InlineManifestWebpackPlugin({
			name: 'webpackManifest'
		}),

		new webpack.LoaderOptionsPlugin({
			options: {
				babel,
				postcss: [
					require('autoprefixer')({ browsers:['last 3 version'] })
				]
			}
		}),
		new ManifestPlugin({
				fileName: 'file_mapping.json',
				seed: {
					name: 'File_Map'
				}
			})
	];

	if (isProd) {
		plugins.push(
			new webpack.LoaderOptionsPlugin({ minimize:true, debug:false }),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new BabiliPlugin({
				mangle: { topLevel: true },
			}),
			new webpack.optimize.UglifyJsPlugin(uglify),
			new ExtractText('[name].[chunkhash].css'),
			new SWPrecache({
				filename: 'service-worker.js',
				dontCacheBustUrlsMatching: /./,
				navigateFallback: 'index.html',
				staticFileGlobsIgnorePatterns: [/\.map$/]
			})
			// new BundleAnalyzerPlugin()
		);
	} else {
		// dev only
		plugins.push(
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),
			new Dashboard()
		);
	}

	return plugins;
};

