// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 路由规则
const routes = [
  {
    path: '/',          // 访问根路径
    name: 'Home',       // 路由名称（可选，方便编程式导航）
    component: () => import('../views/Home.vue')     // 对应渲染的页面组件
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // agent相关路由
  {
    path: '/agent',
    name: 'AgentDashboard',
    component: () => import('../views/agent/AgentDashboard.vue')
  },
  {
    path: '/agent/video',
    name: 'VideoMonitoring',
    component: () => import('../views/agent/VideoMonitoring.vue')
  },
  {
    path: '/agent/setcamera',
    name: 'CameraManagement',
    component: () => import('../views/agent/CameraManagement.vue')
  },
  {
    path: '/agent/service',
    name: 'ServicePlan',
    component: () => import('../views/agent/ServicePlan.vue')
  },
  {
    path: '/agent/set',
    name: 'UserSettings',
    component: () => import('../views/agent/UserSettings.vue')
  },
  // admin相关路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLogin.vue')
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboard.vue')
  },
  {
    path: '/admin/users',
    name: 'UsersManagement',
    component: () => import('../views/admin/UsersManagement.vue')
  },
  {
    path: '/admin/plans',
    name: 'PlansManagement',
    component: () => import('../views/admin/PlansManagement.vue')
  },
  {
    path: '/admin/notification',
    name: 'NotificationManagement',
    component: () => import('../views/admin/NotificationManagement.vue')
  },
  {
    path: '/admin/card',
    name: 'CardManagement',
    component: () => import('../views/admin/CardManagement.vue')
  },
  {
    path: '/admin/monitoring',
    name: 'MonitoringManagement',
    component: () => import('../views/admin/MonitoringManagement.vue')
  },
  {
    path: '/admin/settings',
    name: 'SystemSettings',
    component: () => import('../views/admin/SystemSettings.vue')
  },
  // 404页面（可选，匹配未定义的路由）
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'       // 跳转到首页
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // HTML5 历史模式（无#号）
  routes                           // 传入路由规则
})

// 导航守卫，确保管理端和用户端路由需要登录
router.beforeEach((to, from, next) => {
  // 检查是否是管理端路由
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    // 检查管理端登录状态
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      // 未登录，重定向到管理端登录
      next('/admin/login');
    } else {
      // 已登录，继续访问
      next();
    }
  }
  // 检查是否是管理端登录路由
  else if (to.path === '/admin/login') {
    // 直接通过，不需要登录状态
    next();
  }
  // 检查是否是用户端路由
  else if (to.path.startsWith('/agent')) {
    // 检查用户端登录状态
    const isUserLoggedIn = localStorage.getItem('userLoggedIn');
    if (!isUserLoggedIn) {
      // 未登录，重定向到用户端登录
      next('/login');
    } else {
      // 已登录，继续访问
      next();
    }
  }
  else {
    // 其他路由，直接通过
    next();
  }
});

export default router