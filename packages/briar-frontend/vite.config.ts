import react from '@vitejs/plugin-react-swc';
import externalGlobals from 'rollup-plugin-external-globals';
import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import viteCompression from 'vite-plugin-compression';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import mpa from 'vite-plugin-mpa';
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
			}),
			// @ts-ignore
			mpa.default({
				open: false,
				defaultEntries: './src/pages/briar/index.html'
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
