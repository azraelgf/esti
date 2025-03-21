import webpack from "webpack-stream";
import webPackConfigWebp from '../webpack.prod.js';
import webPackConfigNoWebp from '../webpack.devprod.js';

export const js = () => {
	const webPackConfig = app.isWebP ? webPackConfigWebp : webPackConfigNoWebp;

	return app.gulp.src(app.path.src.js)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>",
			})
		))
		.pipe(webpack({ config: webPackConfig }))
		.on('error', function (err) {
			console.error("JS Build Error:", err);
			this.emit('end'); // Ensure Gulp doesn't crash on error
		})
		.pipe(app.gulp.dest(app.path.build.js));
};
