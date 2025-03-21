import { configFTP } from '../gulp-settings.js';
import vinylFTP from 'vinyl-ftp';
import util from 'gulp-util';

export const ftp = () => {
	configFTP.log = util.log; // Установка логирования
	const ftpConnect = vinylFTP.create(configFTP);

	return app.gulp.src(`${app.path.buildFolder}/**/*.*`) // Удален пустой объект
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FTP",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(ftpConnect.dest(`/${app.path.ftp}/`)); // Отправка на FTP
};
