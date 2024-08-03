import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import viteCompression from "vite-plugin-compression"
// import { visualizer } from "rollup-plugin-visualizer"
import externalGlobals from "rollup-plugin-external-globals"

const cdnUrl = "https://briar-assets-1309736035.cos.ap-nanjing.myqcloud.com"

const config = ({ mode }: { mode: string }) => {
  const isProd = mode === "production"

  return defineConfig({
    plugins: [
      react(),
      viteCompression({
        threshold: 5120,
      }),
      // visualizer({
      //   open: true, // 注意这里要设置为true，否则无效，如果存在本地服务端口，将在打包后自动展示
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: "./dist/stats.html",
      // }),
    ],
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        external: [
          "typescript",
          "prettier",
          "prettier/parser-babel",
          "prettier/parser-postcss",
          "prettier/parser-typescript",
          "prettier/parser-html",
        ],
        plugins: [
          externalGlobals({
            typescript: "ts",
            prettier: "prettier",
            "prettier/parser-babel": "prettierPlugins.babel",
            "prettier/parser-postcss": "prettierPlugins.postcss",
            "prettier/parser-typescript": "prettierPlugins.typescript",
            "prettier/parser-html": "prettierPlugins.html",
          }),
        ],
        output: {
          globals: {
            typescript: "ts",
            prettier: "prettier",
            "prettier/parser-babel": "prettierPlugins.babel",
            "prettier/parser-postcss": "prettierPlugins.postcss",
            "prettier/parser-typescript": "prettierPlugins.typescript",
            "prettier/parser-html": "prettierPlugins.html",
          },
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          manualChunks(id: string) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString()
            }
          },
        },
      },
      reportCompressedSize: false,
      sourcemap: false,
    },
    base: isProd ? cdnUrl : "./",
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  })
}

export default config
