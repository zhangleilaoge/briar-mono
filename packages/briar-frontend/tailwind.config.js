/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,ts,tsx}'],
	theme: {
		extend: {
			backgroundColor: {
				'selected-color': '#84a8d6',
				'text-color': '#0d1115',
				'selected-bg-color': '#e6eef7',
				'active-bg-color': '#eddde8'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
