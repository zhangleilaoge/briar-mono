import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
	plugins: [pluginReact(), pluginSass()],
	html: {
		template: './index.html'
	},
	source: {
		entry: {
			index: './src/main.tsx'
		},
		alias: {
			'@': '/src'
		}
	},
	output: {
		externals: {
			typescript: 'ts',
			prettier: 'prettier',
			'prettier/parser-babel': 'prettierPlugins.babel',
			'prettier/parser-postcss': 'prettierPlugins.postcss',
			'prettier/parser-typescript': 'prettierPlugins.typescript',
			'prettier/parser-html': 'prettierPlugins.html'
		}
	}
});
