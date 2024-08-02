import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import viteCompression from "vite-plugin-compression"

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      threshold: 1024000, // 对大于 1mb 的文件进行压缩
    }),
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
    reportCompressedSize: false,
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  }
})
