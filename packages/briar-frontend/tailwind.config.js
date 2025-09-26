/** @type {import('tailwindcss').Config} */
// const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

// function addVariablesForColors({ addBase, theme }) {
// 	let allColors = flattenColorPalette(theme('colors'));
// 	let newVars = Object.fromEntries(
// 		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
// 	);

// 	addBase({
// 		html: newVars
// 	});
// }

export default {
    darkMode: ['class'],
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
    			'star-yellow': 'rgb(242, 203, 81)',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
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
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
	plugins: [require('@tailwindcss/typography'), require("tailwindcss-animate")]
};
