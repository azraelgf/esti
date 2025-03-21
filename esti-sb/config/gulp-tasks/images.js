import webp from "gulp-webp";
import imagemin from "gulp-imagemin";

// Функция для обработки ошибок
const handleErrors = (title) => {
	return app.plugins.plumber(
		app.plugins.notify.onError({
			title: title,
			message: "Error: <%= error.message %>",
		})
	);
};

// Общая функция для обработки изображений
const processImages = (src, dest, optimizations = [], saveOriginals = true) => {
	return app.gulp.src(src, { encoding: false })
		.pipe(handleErrors("IMAGES"))
		.pipe(app.plugins.newer(dest))
		.pipe(app.plugins.if(app.isImgOpt, imagemin(optimizations)))
		.pipe(app.plugins.if(saveOriginals, app.gulp.dest(dest))); // Сохраняем оригиналы только если это разрешено
};

// Задача для конвертации изображений в WebP
export const WebP = () => {
	return app.gulp.src(app.path.src.images, { encoding: false })
		.pipe(handleErrors("IMAGES"))
		.pipe(app.plugins.newer(app.path.build.images))
		.pipe(app.plugins.if(app.isWebP, webp()))
		.pipe(app.plugins.if(app.isWebP, app.gulp.dest(app.path.build.images)));
};

// Оптимизация изображений
export const imagesOptimize = () => {
	return processImages(app.path.src.images, app.path.build.images, {
		progressive: true,
		svgoPlugins: [{ removeViewBox: false }],
		interlaced: true,
		optimizationLevel: 3, // 0 to 7
	}, !app.isWebP); // Сохраняем оригиналы, если флаг --nowebp активен
};

// Копирование SVG файлов независимо от оптимизации
export const copySvg = () => {
	return app.gulp.src(app.path.src.svg)
		.pipe(handleErrors("IMAGES"))
		.pipe(app.plugins.newer(app.path.build.images))
		.pipe(app.gulp.dest(app.path.build.images)); // Всегда сохраняем SVG
};
