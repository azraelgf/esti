import fs from 'fs';
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';
import * as path from 'path';

// Функция для конвертации .otf в .ttf
export const otfToTtf = () => {
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, { encoding: false })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
}

// Функция для конвертации .ttf в .woff2
export const ttfToWoff2 = () => {
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, { encoding: false })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(ttf2woff2())
		.pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

// Функция для копирования .woff2 шрифтов
export const woff2Copy = () => {
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.woff2`, { encoding: false })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

// Функция для генерации файла стилей шрифтов
export const fontsStyle = () => {
	const fontsFile = `${app.path.srcFolder}/scss/fonts/fonts.scss`;
	app.isFontsReW && fs.unlink(fontsFile, cb); // Удаление файла при необходимости

	fs.readdir(app.path.build.fonts, (err, fontsFiles) => {
		if (fontsFiles && !fs.existsSync(fontsFile)) {
			fs.writeFile(fontsFile, '', cb);
			let newFileOnly;

			fontsFiles.forEach(fontFile => {
				const fontFileName = fontFile.split(".")[0];
				if (newFileOnly !== fontFileName) {
					const [fontName, fontWeightStr] = fontFileName.split("-");
					const fontWeight = getFontWeight(fontWeightStr);
					const fontStyle = fontFileName.includes("-Italic") ? "italic" : "normal";

					fs.appendFile(fontsFile,
						`@font-face {\n\tfont-family: ${fontName || fontFileName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\r\n`, cb);

					newFileOnly = fontFileName;
				}
			});
		} else {
			console.log("Файл scss/fonts/fonts.scss уже существует. Для обновления файла необходимо удалить его!");
		}
	});
	return app.gulp.src(`${app.path.srcFolder}`);
}

// Вспомогательная функция для определения веса шрифта
const getFontWeight = (weight) => {
	const weightMap = {
		thin: 100,
		hairline: 100,
		extralight: 200,
		ultralight: 200,
		light: 300,
		medium: 500,
		semibold: 600,
		demibold: 600,
		bold: 700,
		extrabold: 800,
		ultrabold: 800,
		black: 900,
		heavy: 900,
		extrablack: 950,
		ultrablack: 950,
	};
	return weightMap[weight?.toLowerCase()] || 400; // Возвращаем 400 по умолчанию
};

function cb() {}
