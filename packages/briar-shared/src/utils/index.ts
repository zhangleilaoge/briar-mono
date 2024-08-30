export const safeJsonParse = (str: string) => {
	try {
		return JSON.parse(str);
	} catch (_) {
		return;
	}
};
