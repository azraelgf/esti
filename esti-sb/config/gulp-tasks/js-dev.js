import webpack from "webpack-stream";
import webPackConfig from '../webpack.prod.js';
import TerserPlugin from "terser-webpack-plugin";
import * as path from 'path';

const srcFolder = "src";
const buildFolder = "dist";

const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(buildFolder),
	jsOutput: `${buildFolder}/js`,
};

const webPackConfigBeautify = {
	...webPackConfig,
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				terserOptions: {
					compress: {
						defaults: false,
						unused: true,
					},
					mangle: false,
					toplevel: true,
					keep_classnames: true,
					keep_fnames: true,
					format: {
						beautify: true,
					},
				},
			}),
		],
	},
	output: {
		path: paths.build,
		filename: 'app.js',
		publicPath: '/',
	},
};

export const jsDev = async () => {
	try {
		await app.gulp.src(app.path.src.js)
			.pipe(app.plugins.plumber(
				app.plugins.notify.onError({
					title: "JS",
					message: "Error: <%= error.message %>",
				})
			))
			.pipe(webpack({ config: webPackConfigBeautify }))
			.pipe(app.gulp.dest(paths.jsOutput));
	} catch (error) {
		console.error("JS Build Error:", error);
	}
};
