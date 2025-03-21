import { deleteAsync } from "del";

export const reset = async () => {
	try {
		await deleteAsync(app.path.clean);
	} catch (error) {
		console.error("Error during reset:", error);
		app.plugins.notify.onError({
			title: "RESET",
			message: `Error: ${error.message}`,
		})();
	}
};
