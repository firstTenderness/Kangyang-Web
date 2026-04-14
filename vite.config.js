import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://kyapi.awenz.cn',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 将第三方库单独打包
          vendor: ['vue', 'vue-router', 'vue-i18n', 'chart.js']
        }
      }
    },
    // 启用压缩
    minify: 'esbuild',
    // 生成sourcemap，便于调试
    sourcemap: false
  },
  // 配置别名，简化路径引用
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
