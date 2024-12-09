import 'dotenv/config';

import react from '@vitejs/plugin-react-swc';
import externalGlobals from 'rollup-plugin-external-globals';
// import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
// import viteCompression from 'vite-plugin-compression';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import mpa from 'vite-plugin-mpa';
import wasm from 'vite-plugin-wasm';

const STATIC_PATH = process.env.BRIAR_TX_BUCKET_DOMAIN + '/static';

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
	const dev = mode === 'development';

	return defineConfig({
		plugins: [
			react(),
			wasm(),
			// 其实没什么必要打包的时候压缩，因为最终走的是 cdn，用的是cdn的压缩能力
			// viteCompression({
			// 	threshold: 5120
			// }),
			chunkSplitPlugin({
				strategy: 'default',
				customSplitting: {
					typescript: ['typescript']
				}
			}),
			// visualizer({
			// 	open: true, // 注意这里要设置为true，否则无效，如果存在本地服务端口，将在打包后自动展示
			// 	gzipSize: true,
			// 	brotliSize: true
			// }),
			ViteEjsPlugin({}),
			// @ts-ignore
			mpa.default({
				open: false,
				defaultEntries: './src/pages/briar/index.html'
			})
		],
		build: {
			target: 'esnext', // 或 'chrome93' / 'firefox90' 等等
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_debugger: true
				}
			},
			rollupOptions: {
				external: external,
				plugins: [externalPlugin],
				output: {
					globals: externalOutputGlobals,
					chunkFileNames: 'static/js/[name]-[hash].js',
					entryFileNames: 'static/js/[name]-[hash].js',
					assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
				}
			},
			reportCompressedSize: false,
			sourcemap: false
		},
		base: dev ? './' : STATIC_PATH,
		resolve: {
			alias: {
				'@': '/src'
			}
		}
	});
};

export default config;
