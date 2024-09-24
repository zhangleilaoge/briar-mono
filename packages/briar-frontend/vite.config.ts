import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import externalGlobals from 'rollup-plugin-external-globals';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

const external = [
	'typescript',
	'prettier',
	'prettier/parser-babel',
	'prettier/parser-postcss',
	'prettier/parser-typescript',
	'prettier/parser-html'
];

const externalPlugin = externalGlobals({
	typescript: 'ts',
	prettier: 'prettier',
	'prettier/parser-babel': 'prettierPlugins.babel',
	'prettier/parser-postcss': 'prettierPlugins.postcss',
	'prettier/parser-typescript': 'prettierPlugins.typescript',
	'prettier/parser-html': 'prettierPlugins.html'
});

const externalOutputGlobals = {
	typescript: 'ts',
	prettier: 'prettier',
	'prettier/parser-babel': 'prettierPlugins.babel',
	'prettier/parser-postcss': 'prettierPlugins.postcss',
	'prettier/parser-typescript': 'prettierPlugins.typescript',
	'prettier/parser-html': 'prettierPlugins.html'
};

const config = ({ mode }: { mode: string }) => {
	const quick = mode === 'quick';

	return defineConfig({
		plugins: [
			react(),
			viteCompression({
				threshold: 5120
			}),
			chunkSplitPlugin({
				strategy: 'default',
				customSplitting: {
					typescript: ['typescript']
				}
			}),
			ViteEjsPlugin({
				quick
			})
		],
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_debugger: true
				}
			},
			rollupOptions: {
				external: quick ? external : [],
				plugins: quick ? [externalPlugin] : [],
				output: {
					globals: quick ? externalOutputGlobals : {},
					chunkFileNames: 'static/js/[name]-[hash].js',
					entryFileNames: 'static/js/[name]-[hash].js',
					assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
				}
			},
			reportCompressedSize: false,
			sourcemap: false
		},
		resolve: {
			alias: {
				'@': '/src'
			}
		}
	});
};

export default config;
