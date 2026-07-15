import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        // 快捷鍵功能，用@符號直接指向src資料夾
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // 部署路徑：如果是 build (代表上傳生產環境)，就用倉庫名稱，否則用本地端根目錄
    base: command === 'build' ? '/animerecord-gsap-v2/' : '/',
  }
})