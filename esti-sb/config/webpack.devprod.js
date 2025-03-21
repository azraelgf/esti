import fs from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FileIncludeWebpackPlugin from 'file-include-webpack-plugin-replace';
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from "terser-webpack-plugin";
import * as path from 'path';

const srcFolder = "src";
const buildFolder = "dist";
const rootFolder = path.basename(path.resolve());

// Считываем pug-страницы
const pugPages = fs.readdirSync(srcFolder).filter(fileName => fileName.endsWith('.pug'));
const htmlPages = pugPages.length ? [] : [
	new FileIncludeWebpackPlugin({
		source: srcFolder,
		destination: '../',
		htmlBeautifyOptions: {
			"indent-with-tabs": true,
			'indent_size': 3,
		},
		replace: [
			{ regex: '../img', to: 'img' },
			{ regex: '@img', to: 'img' },
			// Удалено htmlImagesWebpLoader
			{ regex: 'NEW_PROJECT_NAME', to: rootFolder },
		],
	}),
];

// Определяем пути
const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(buildFolder),
};

// Конфигурация Webpack
const config = {
	mode: "production",
	cache: { type: 'filesystem' },
	optimization: {
		minimizer: [new TerserPlugin({ extractComments: false })],
	},
	output: {
		path: paths.build,
		filename: 'app.min.js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'string-replace-loader',
						options: {
							search: '@img',
							replace: '../img',
							flags: 'ig',
						},
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1, // Увеличиваем, чтобы учитывать postcss-loader
							sourceMap: false,
							modules: false,
							url: {
								filter: (url) => !url.includes("img") && !url.includes("fonts"),
							},
						},
					},
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							sassOptions: { outputStyle: "expanded" },
						},
					},
				],
			},
			{
				test: /\.pug$/,
				use: [
					'pug-loader',
					{
						loader: 'string-replace-loader',
						options: {
							search: '@img',
							replace: 'img',
							flags: 'g',
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
				},
			},
			{
				test: /\.(jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: { presets: ["@babel/preset-react"] },
				},
			},
		],
	},
	plugins: [
		...htmlPages,
		...pugPages.map(pugPage => new HtmlWebpackPlugin({
			minify: false,
			template: `${srcFolder}/${pugPage}`,
			filename: `../${pugPage.replace(/\.pug/, '.html')}`,
		})),
		new MiniCssExtractPlugin({
			filename: '../css/style.css',
		}),
		new CopyPlugin({
			patterns: [
				{ from: `${paths.src}/files`, to: `../files`, noErrorOnMissing: true },
				{ from: `${paths.src}/php`, to: `../`, noErrorOnMissing: true },
				{ from: `${paths.src}/favicon.ico`, to: `../`, noErrorOnMissing: true },
			],
		}),
	],
	resolve: {
		alias: {
			"@scss": `${paths.src}/scss`,
			"@js": `${paths.src}/js`,
			"@img": `${paths.src}/img`,
		},
	},
};

export default config;
