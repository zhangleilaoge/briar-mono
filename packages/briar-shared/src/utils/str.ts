export function generateRandomCode(length: number = 6): string {
	let code = '';
	const digits = '0123456789';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * digits.length);
		code += digits[randomIndex];
	}

	return code;
}
