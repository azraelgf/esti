import versionNumber from "gulp-version-number";
// import webpHtmlNosvg from "gulp-webp-html-nosvg";

// Функция для обработки ошибок
const handleErrors = (title) => {
	return app.plugins.plumber(
		app.plugins.notify.onError({
			title: title,
			message: "Error: <%= error.message %>",
		})
	);
};

export const html = () => {
	let pipeline = app.gulp.src(`${app.path.build.html}*.html`)
		.pipe(handleErrors("HTML"))
		.pipe(versionNumber({
			'value': '%DT%',
			'append': {
				'key': '_v',
				'cover': 0,
				'to': ['css', 'js', 'img']
			},
			'output': {
				'file': 'config/version.json'
			}
		}));

	// Если нужно использовать webpHtmlNosvg, раскомментируйте следующую часть
	/*
	if (app.isWebP) {
		pipeline = pipeline.pipe(webpHtmlNosvg());
	}
	*/

	return pipeline.pipe(app.gulp.dest(app.path.build.html));
};
