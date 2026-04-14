// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 导入路由配置
import i18n from './i18n' // 导入国际化配置
import apiService from './services/api' // 导入API服务
import './style.css' // 导入全局样式
import './assets/css/admin.css' // 导入 admin 样式

// 创建应用实例
const app = createApp(App)

// 全局注册API服务
app.config.globalProperties.$api = apiService

// 挂载路由和国际化到App
app
  .use(router) // 注册路由插件
  .use(i18n) // 注册国际化插件
  .mount('#app')