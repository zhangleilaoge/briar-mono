/** @type {import('tailwindcss').Config} */
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

function addVariablesForColors({ addBase, theme }) {
	let allColors = flattenColorPalette(theme('colors'));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		':root': newVars
	});
}

export default {
	content: ['./src/**/*.{html,js,ts,tsx}'],
	theme: {
		extend: {
			backgroundColor: {
				'selected-color': '#84a8d6',
				'text-color': '#0d1115',
				'selected-bg-color': '#e6eef7',
				'active-bg-color': '#eddde8'
			},
			colors: {
				'selected-color': '#84a8d6',
				'text-color': '#0d1115',
				'selected-bg-color': '#e6eef7',
				'active-bg-color': '#eddde8',
				'star-yellow': 'rgb(242, 203, 81)'
			},
			animation: {
				aurora: 'aurora 60s linear infinite'
			},
			keyframes: {
				aurora: {
					from: {
						backgroundPosition: '50% 50%, 50% 50%'
					},
					to: {
						backgroundPosition: '350% 50%, 350% 50%'
					}
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), addVariablesForColors]
};
