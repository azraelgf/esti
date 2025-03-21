import fs from 'fs';

export const gitignore = () => {
	const gitignorePath = './.gitignore';

	if (!fs.existsSync(gitignorePath)) {
		const ignoreList = [
			'phpmailer/',
			'package-lock.json',
			'flsStartTemplate/',
			'node_modules/',
			'.gitignore',
			'dist/',
			'Source/',
			'version.json',
			`${app.buildFolder}/`, // Используем шаблонные строки
			'**/*.zip',
			'**/*.rar',
		];

		try {
			fs.writeFileSync(gitignorePath, ignoreList.join('\r\n') + '\r\n');
		} catch (error) {
			console.error("Ошибка при создании .gitignore:", error);
		}
	}

	return app.gulp.src(`${app.path.srcFolder}`);
};
