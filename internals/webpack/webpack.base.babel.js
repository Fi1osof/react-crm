/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ExtractTextPluginMainPlugin = new ExtractTextPlugin({
  filename: 'css/main.css'
});

module.exports = (options) => ({
	entry: options.entry,
	output: Object.assign({ // Compile into js/build.js
		path: path.resolve(process.cwd(), 'build'),
		publicPath: '/',
	}, options.output), // Merge with env dependent settings
	module: {
		loaders: [
			{
				test: /\.jsx?$/, // Transform all .js files required somewhere with Babel
          		loader: 'babel-loader',
				exclude: function(file){
					if(/\/node_modules\//.test(file)){
						if(
							/\/material-ui-components\//.test(file)
							|| /\/structor-templates\//.test(file)
							|| /\/react-cms-data-view\//.test(file)
							// || /\/moment\//.test(file)
						){
							return;
						}

						return true;
					}
				},
				query: options.babelQuery,
			}, {
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader'],
			}, {
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'file-loader',
			}, {
				test: /\.(jpg|png|gif)$/,
				loaders: [
					'file-loader',
					'image-webpack-loader?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
				],
			}, {
				test: /\.html$/,
				loader: 'html-loader',
			}, {
				test: /\.json$/,
				loader: 'json-loader',
			}, {
				test: /\.(mp4|webm)$/,
				loader: 'url-loader?limit=10000',
			},{
	          test: new RegExp('\.(le|se|sa)ss$'),
	          loader: ExtractTextPluginMainPlugin.extract({
	            fallback: "style-loader",
	            use: "css-loader!autoprefixer-loader?browsers=last 2 versions!less-loader"
	          })
	        }],
	},
	plugins: options.plugins.concat([
		new webpack.ProvidePlugin({
			// make fetch available
			fetch: 'exports-loader?self.fetch!whatwg-fetch',
		}),

		// Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
		// inside your code for any environment checks; UglifyJS will automatically
		// drop any unreachable code.
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),
		new webpack.NamedModulesPlugin(),
      	ExtractTextPluginMainPlugin,
      	// new webpack.IgnorePlugin(/\.\/locale$/),
	]),
	resolve: {
		modules: ['app', 'node_modules'],
		extensions: [
			'.js',
			'.jsx',
			'.react.js',
		],
		mainFields: [
			'browser',
			'jsnext:main',
			'main',
		],
	},
	devtool: options.devtool,
	target: 'web', // Make web variables accessible to webpack, e.g. window
});
