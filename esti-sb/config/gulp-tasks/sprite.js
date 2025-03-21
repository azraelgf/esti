import svgSprite from "gulp-svg-sprite";
import cheerio from 'gulp-cheerio';

export const sprite = () => {
	return app.gulp.src(`${app.path.src.svgicons}`)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "SVG",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../img/icons/icons.svg',
				}
			},
			shape: {
				id: {
					separator: '',
					generator: ''
				},
			},
			svg: {
				rootAttributes: {
					style: 'display: none;',
					'aria-hidden': true
				},
				xmlDeclaration: false
			}
		}))
		.pipe(cheerio({
			run: ($) => {
				// Устанавливаем атрибуты fill и stroke в currentColor, если они не равны "none"
				$('[fill], [stroke]').each(function () {
					if ($(this).attr('fill') && $(this).attr('fill') !== "none") {
						$(this).attr('fill', 'currentColor');
					}
					if ($(this).attr('stroke') && $(this).attr('stroke') !== "none") {
						$(this).attr('stroke', 'currentColor');
					}
				});
				// Удаляем атрибут style
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(app.gulp.dest(`${app.path.srcFolder}`));
};
