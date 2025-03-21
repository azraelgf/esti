import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import rename from 'gulp-rename'; // Не забудьте импортировать rename, если он не импортирован

export const css = () => {
	return app.gulp.src(`${app.path.build.css}style.css`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "CSS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
		.pipe(app.plugins.if(app.isBuild, autoprefixer({
			grid: false,
			overrideBrowserslist: ["last 1 versions"],
			cascade: true
		})))
		.pipe(app.plugins.if(app.isBuild, cleanCss({
			format: 'beautify',
			level: {
				1: {
					tidySelectors: false
				}
			}
		})))
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(app.plugins.if(app.isBuild, cleanCss({
			level: {
				1: {
					tidySelectors: false
				}
			}
		})))
		.pipe(rename({ suffix: ".min" }))
		.pipe(app.gulp.dest(app.path.build.css));
}
