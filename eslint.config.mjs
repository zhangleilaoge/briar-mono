import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

const ignores = ['*.config.js', '**/es/', '**/dist/', '**/node_modules/'];

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']
	},
	{ languageOptions: { globals: globals.browser } },

	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/ban-ts-comment': 'warn',
			'@typescript-eslint/no-unused-expressions': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/no-deprecated': 'off',
			'react/jsx-key': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_', // 忽略以 _ 开头的函数参数
					varsIgnorePattern: '^_', // 忽略以 _ 开头的变量
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		ignores: [...ignores, '**/lib/']
	}
];
