module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
	ignoreFiles: ['packages/briar-frontend/**/tailwind-to.css'],
	plugins: [],
	rules: {
		'string-quotes': 'double'
	}
};
