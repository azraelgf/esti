import { deleteAsync } from "del";
import zipPlugin from "gulp-zip";

export const zip = async () => {
	// Удаляем старый zip-архив перед созданием нового
	await deleteAsync(`./${app.path.rootFolder}.zip`);

	// Возвращаем поток, чтобы гарантировать выполнение всех асинхронных операций
	return app.gulp.src(`${app.path.buildFolder}/**/*.*`, { encoding: false })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "ZIP",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(zipPlugin(`${app.path.rootFolder}.zip`))
		.pipe(app.gulp.dest('./'));
}
