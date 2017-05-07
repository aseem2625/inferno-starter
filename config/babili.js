module.exports = {
	presets: [
		[
			require('babel-preset-babili'),
			{
				mangle: { topLevel: true },
				deadcode: true,
				removeConsole: true
			},
		],
	],
}
