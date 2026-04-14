<template>
  <!-- 阿里云风格的仪表盘组件 -->
  <div class="agent-dashboard">
    <!-- 导航栏 -->
    <AgentNavbar />
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>{{ t('common.loading') }}</p>
      </div>
    </div>
    
    <div class="dashboard-header">
      <div class="user-info">
        <div class="user-avatar">
          <span>{{ userName.charAt(0) }}</span>
        </div>
        <div class="user-details">
          <p class="user-name">{{ userName }}</p>
          <p class="user-phone">{{ userPhone }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- 数据大屏区域 -->
      <div class="data-overview">
        <div class="section-header">
          <h2>{{ t('agent.dashboard.systemOverview') }}</h2>
        </div>
        <div class="data-cards">
          <div class="data-card" :class="{ 'loading': loadingCards }">
            <div class="card-icon monitor-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 10L9 14L15 18V10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>{{ t('agent.dashboard.totalCameras') }}</h3>
              <p class="card-value">{{ loadingCards ? '...' : totalCameras }}</p>
            </div>
          </div>
          <div class="data-card" :class="{ 'loading': loadingCards }">
            <div class="card-icon available-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4 12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>{{ t('agent.dashboard.availableCameras') }}</h3>
              <p class="card-value" :class="{ 'exceeded': availableCameras < 0 }">
                {{ loadingCards ? '...' : (availableCameras >= 0 ? availableCameras : `${t('agent.dashboard.exceeded')} ${Math.abs(availableCameras)} ${t('agent.dashboard.units')}`) }}
              </p>
            </div>
          </div>
          <div class="data-card" :class="{ 'loading': loadingCards }">
            <div class="card-icon online-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20v-6M12 4v6M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>{{ t('agent.dashboard.onlineCameras') }}</h3>
              <p class="card-value">{{ loadingCards ? '...' : `${onlineCameras}${t('agent.dashboard.units')}` }}</p>
            </div>
          </div>
          <div class="data-card" :class="{ 'loading': loadingCards }">
            <div class="card-icon offline-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 17L23 10M23 10H16M23 10V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21.172 15.172A10 10 0 1 1 12 22c5.523 0 10-4.477 10-10 0-2.617-1.035-5-2.828-6.828" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>{{ t('agent.dashboard.offlineCameras') }}</h3>
              <p class="card-value">{{ loadingCards ? '...' : `${offlineCameras}${t('agent.dashboard.units')}` }}</p>
            </div>
          </div>
          <div class="data-card" :class="{ 'loading': loadingCards }">
            <div class="card-icon plan-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>{{ t('agent.dashboard.currentPlan') }}</h3>
              <p class="card-value">{{ loadingCards ? '...' : currentPlan }}</p>
              <p v-if="!loadingCards && currentPlan !== t('agent.dashboard.noPlan')" class="card-expire">{{ t('agent.dashboard.expireDate') }}：{{ planExpireDate }}</p>
              <p v-if="!loadingCards && currentPlan !== t('agent.dashboard.noPlan')" class="card-remaining">{{ t('agent.dashboard.remaining') }}：{{ daysRemaining }}{{ t('agent.dashboard.days') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="chart-section">
        <div class="section-header">
          <h2>{{ t('agent.dashboard.statusAnalysis') }}</h2>
        </div>
        <div class="charts-container">
          <div class="chart-card" :class="{ 'loading': loadingCharts }">
            <div v-if="loadingCharts" class="chart-loading">
              <div class="spinner"></div>
              <p>{{ t('common.loading') }}</p>
            </div>
            <canvas id="statusChart" style="width: 100%; height: 100%;"></canvas>
          </div>
          <div class="chart-card" :class="{ 'loading': loadingCharts }">
            <div v-if="loadingCharts" class="chart-loading">
              <div class="spinner"></div>
              <p>{{ t('common.loading') }}</p>
            </div>
            <canvas id="activityChart" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>
      </div>

      <!-- 系统通知区 -->
      <div class="system-notifications">
        <div class="section-header">
          <h2>{{ t('agent.dashboard.systemNotifications') }}</h2>
        </div>
        <div class="notification-list">
          <div v-if="loadingNotifications" class="loading-notifications">
            <div class="spinner"></div>
            <p>{{ t('common.loading') }}</p>
          </div>
          <div v-else v-for="notification in paginatedNotifications" :key="notification.id" class="notification-item" :class="{ 'read': notification.read }">
            <div class="notification-content">
              <div class="notification-header">
                <h3>{{ notification.title }}</h3>
                <span class="notification-time">{{ formatTime(notification.time) }}</span>
              </div>
              <p class="notification-message">{{ notification.message }}</p>
            </div>
            <div class="notification-actions">
              <span class="notification-status" :class="{ 'read': notification.read }">
                {{ notification.read ? t('agent.dashboard.read') : t('agent.dashboard.unread') }}
              </span>
              <button class="view-btn" @click="viewNotification(notification.id)">
                {{ t('common.view') }}
              </button>
            </div>
          </div>
          <div v-if="!loadingNotifications && paginatedNotifications.length === 0" class="empty-notifications">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p>{{ t('agent.dashboard.noNotifications') }}</p>
          </div>
        </div>
        <!-- 分页控制 -->
        <div class="pagination-container">
          <div class="pagination">
            <button 
              class="page-btn" 
              @click="prevPage" 
              :disabled="currentPage === 1 || loadingNotifications"
            >
              <span class="page-btn-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11L5 7L10 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              {{ t('common.previousPage') }}
            </button>
            <span class="page-info">
              {{ t('common.pageInfo', { page: currentPage, total: totalPages }) }}
            </span>
            <button 
              class="page-btn" 
              @click="nextPage" 
              :disabled="currentPage === totalPages || loadingNotifications"
            >
              {{ t('common.nextPage') }}
              <span class="page-btn-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 3L9 7L4 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 通知详情弹窗 -->
      <div v-if="isNotificationModalOpen" class="modal-overlay" @click="closeNotificationModal">
        <div class="modal-content alert-modal" @click.stop>
          <div class="modal-header">
            <h3>{{ currentNotification?.title || t('agent.dashboard.systemNotification') }}</h3>
            <button class="close-btn" @click="closeNotificationModal">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="notification-detail-time">{{ formatTime(currentNotification?.time) }}</p>
            <p class="notification-detail-message">{{ currentNotification?.message }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="closeNotificationModal">{{ t('common.confirm') }}</button>
          </div>
        </div>
      </div>

      <!-- 功能按钮区 -->
      <div class="function-area">
        <div class="section-header">
          <h2>{{ t('agent.dashboard.functionNavigation') }}</h2>
        </div>
        <div class="function-buttons">
          <router-link to="/agent/video" class="function-btn">
            <div class="btn-icon video-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 10L9 14L15 18V10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>{{ t('agent.dashboard.videoMonitoring') }}</span>
          </router-link>
          <router-link to="/agent/setcamera" class="function-btn">
            <div class="btn-icon manage-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="m12 8-3.09 3.09L12 14.18l3.09-3.09L12 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>{{ t('agent.dashboard.cameraManagement') }}</span>
          </router-link>
          <router-link to="/agent/service" class="function-btn">
            <div class="btn-icon service-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>{{ t('agent.dashboard.servicePlan') }}</span>
          </router-link>
          <router-link to="/agent/set" class="function-btn">
            <div class="btn-icon setting-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>{{ t('agent.dashboard.userSettings') }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Chart from 'chart.js/auto'
import AgentNavbar from '../../components/AgentNavbar.vue'
import apiService from '../../services/api.js'

const { t, locale } = useI18n()

// 监听语言变化，重新初始化图表
watch(locale, async (newLocale) => {
  console.log('Language changed to:', newLocale)
  // 重新初始化图表以更新翻译
  if (chartData.value) {
    initCharts()
  }
  // 更新当前套餐名称
  await updateCurrentPlanName()
  // 重新获取数据
  await fetchDashboardData()
  await fetchNotifications()
})

const router = useRouter()

// 数据
const userId = ref('')
const userName = ref('')
const userPhone = ref('')
const totalCameras = ref(0)
const availableCameras = ref(0)
const onlineCameras = ref(0)
const offlineCameras = ref(0)
const currentPlan = ref('未订阅')
const planExpireDate = ref('') // 套餐到期日期
const daysRemaining = ref(0) // 剩余天数
const chartData = ref(null)

// 加载状态
const loading = ref(true)
const loadingCards = ref(true)
const loadingCharts = ref(true)
const loadingNotifications = ref(true)

// 套餐列表
const plans = ref([])

// 通知数据
const notifications = ref([])
const totalNotifications = ref(0)

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(3) // 一页显示3条通知

// 计算总页数
const totalPages = computed(() => {
  return totalNotifications.value > 0 ? Math.ceil(totalNotifications.value / pageSize.value) : 0
})

// 计算当前页的通知
const paginatedNotifications = computed(() => {
  return notifications.value
})

// 上一页
const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchNotifications()
  }
}

// 下一页
const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchNotifications()
  }
}

// 通知详情弹窗状态
const isNotificationModalOpen = ref(false)
const currentNotification = ref(null)

// 获取套餐列表
async function fetchPlans() {
  try {
    const result = await apiService.get('/admin/plans', { cache: true })
    console.log('套餐列表API响应:', result);
    
    if (result.code === 200) {
      plans.value = result.data
    } else if (result.code === 401 || result.message === '无法获取用户ID') {
      // 未授权或无法获取用户ID，跳转到登录页面
      console.error('无法获取用户ID或token无效，跳转到登录页面');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      router.push('/login');
      return;
    } else {
      console.error('获取套餐列表失败:', result.message);
    }
  } catch (error) {
    console.error('获取套餐列表失败:', error);
  }
}

onMounted(async () => {
  try {
    // 从localStorage中读取用户ID
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      userId.value = storedUserId
      console.log('从localStorage读取用户ID:', storedUserId)
    }
    
    // 并行获取数据，提升加载速度
    await Promise.all([
      fetchDashboardData(),
      fetchChartData(),
      fetchNotifications(),
      fetchPlans()
    ])
    
    // 更新当前套餐名称
    await updateCurrentPlanName()
  } catch (error) {
    console.error('初始化失败:', error)
    // 发生错误时，跳转到登录页面
    localStorage.removeItem('userLoggedIn')
    localStorage.removeItem('userToken')
    localStorage.removeItem('userId')
    router.push('/login')
  } finally {
    // 隐藏加载状态
    loading.value = false
  }
})

// 获取监控状态数量
async function fetchOnlineCamerasCount() {
  try {
    const result = await apiService.get('/user/monitorings', { cache: true })
    console.log('监控列表API响应:', result);
    
    if (result.code === 200) {
      const data = result.data
      const monitors = data.monitorings?.records || []
      // 统计在线监控数量
      onlineCameras.value = monitors.filter(monitor => monitor.status === '在线').length
      // 统计离线监控数量
      offlineCameras.value = monitors.filter(monitor => monitor.status === '离线').length
    } else if (result.code === 401 || result.message === '无法获取用户ID') {
      // 未授权或无法获取用户ID，跳转到登录页面
      console.error('无法获取用户ID或token无效，跳转到登录页面');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      router.push('/login');
      return;
    } else {
      console.error('获取监控列表失败:', result.message);
      onlineCameras.value = 0;
      offlineCameras.value = 0;
    }
  } catch (error) {
    console.error('获取监控列表失败:', error);
    onlineCameras.value = 0;
    offlineCameras.value = 0;
  } finally {
    // 隐藏卡片加载状态
    loadingCards.value = false
  }
}

// 更新当前套餐名称
async function updateCurrentPlanName() {
  try {
    // 获取用户基本信息
    const result = await apiService.get('/user/dashboard', { cache: true })
    console.log('更新套餐名称API响应:', result);
    
    if (result.code === 200) {
      const data = result.data
      planExpireDate.value = data.planExpireDate
      daysRemaining.value = data.daysRemaining
      
      // 检查返回的套餐信息
      console.log('套餐信息 - currentPlan:', data.currentPlan);
      console.log('套餐信息 - plan:', data.plan);
      
      // 优先使用currentPlan字段，如果不存在则使用plan字段
      const planName = data.currentPlan || data.plan;
      console.log('最终使用的套餐名称:', planName);
      
      // 当套餐为none或未订阅时显示未订阅
      if (!planName || planName === 'none' || planName === '未订阅') {
        currentPlan.value = t('agent.dashboard.noPlan')
        return
      }
      
      // 替换硬编码的套餐名称为翻译键
      let translatedPlanName = planName
      switch(planName) {
        case '高级版':
          translatedPlanName = t('adminPlans.premiumPlan');
          break;
        case '企业版':
          translatedPlanName = t('adminPlans.enterprisePlan');
          break;
        case '基础版':
          translatedPlanName = t('adminPlans.standardPlan');
          break;
      }
      
      currentPlan.value = translatedPlanName
      console.log('当前套餐名称已更新:', currentPlan.value);
    } else if (result.code === 401 || result.message === '无法获取用户ID') {
      // 未授权或无法获取用户ID，跳转到登录页面
      console.error('无法获取用户ID或token无效，跳转到登录页面');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      router.push('/login');
      return;
    } else {
      console.error('更新当前套餐名称失败:', result.message);
    }
  } catch (error) {
    console.error('更新当前套餐名称失败:', error);
  }
}

// 获取概览数据
async function fetchDashboardData() {
  try {
    console.log('=== 开始获取用户概览数据 ===');
    // 检查localStorage中的token
    const token = localStorage.getItem('userToken');
    console.log('当前用户token:', token ? '存在' : '不存在');
    
    // 如果没有token，跳转到登录页面
    if (!token) {
      console.error('没有找到用户token，跳转到登录页面');
      router.push('/login');
      return;
    }
    
    // 获取用户详细信息（包括用户ID）
    console.log('调用API接口:', '/user/info');
    const userInfoResult = await apiService.get('/user/info', { cache: true });
    console.log('用户信息API响应:', userInfoResult);
    
    if (userInfoResult.code === 200) {
      const userData = userInfoResult.data;
      console.log('获取到的用户详细数据:', userData);
      console.log('用户ID:', userData.id);
      
      // 保存用户ID
      userId.value = userData.id || '';
      console.log('用户ID已保存:', userId.value);
      
      // 更新localStorage中的用户ID
      localStorage.setItem('userId', userId.value);
      console.log('用户ID已更新到localStorage');
    } else if (userInfoResult.code === 401 || userInfoResult.message === '无法获取用户ID') {
      // 未授权或无法获取用户ID，跳转到登录页面
      console.error('无法获取用户ID或token无效，跳转到登录页面');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      router.push('/login');
      return;
    } else {
      console.error('获取用户详细信息失败:', userInfoResult.message);
    }
    
    // 获取用户基本信息
    console.log('调用API接口:', '/user/dashboard');
    const result = await apiService.get('/user/dashboard', { cache: true });
    console.log('API响应:', result);
    
    if (result.code === 200) {
      const data = result.data;
      console.log('获取到的用户数据:', data);
      
      // 检查返回的用户信息
      console.log('用户名称:', data.userName);
      console.log('用户电话:', data.userPhone);
      console.log('总监控数:', data.totalCameras);
      console.log('剩余监控数:', data.availableCameras);
      
      userName.value = data.userName;
      userPhone.value = data.userPhone;
      totalCameras.value = data.totalCameras || 0;
      availableCameras.value = data.availableCameras || 0;
      
      // 存储套餐类型，稍后通过updateCurrentPlanName更新名称
      planExpireDate.value = data.planExpireDate;
      daysRemaining.value = data.daysRemaining;
      
      console.log('=== 获取用户概览数据成功 ===');
    } else if (result.code === 401 || result.message === '无法获取用户ID') {
      // 未授权或无法获取用户ID，跳转到登录页面
      console.error('无法获取用户ID或token无效，跳转到登录页面');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      router.push('/login');
      return;
    } else {
      console.error('获取概览数据失败:', result.message);
    }
    
    // 获取监控列表并统计在线数量
    await fetchOnlineCamerasCount();
    
  } catch (error) {
    console.error('获取概览数据异常:', error);
    console.error('异常堆栈:', error.stack);
    // 如果是网络错误或其他错误，跳转到登录页面
    console.error('发生异常，跳转到登录页面');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    router.push('/login');
  }
}

// 获取图表数据
async function fetchChartData() {
  try {
    loadingCharts.value = true
    console.log('开始获取图表数据');
    
    // 尝试获取真实API数据
    const result = await apiService.get('/user/dashboard/charts', { cache: true })
    console.log('图表数据API响应:', result);
    
    if (result.code === 200) {
      chartData.value = result.data
    } else if (result.code === 401 || result.message === '无法获取用户ID') {
      // 未授权或无法获取用户ID，跳转到登录页面
      console.error('无法获取用户ID或token无效，跳转到登录页面');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      router.push('/login');
      return;
    } else {
      console.error('获取图表数据失败:', result.message);
      // 使用模拟数据作为 fallback
      useMockChartData();
    }
    
  } catch (error) {
    console.error('获取图表数据失败:', error);
    // 使用模拟数据作为 fallback
    useMockChartData();
  } finally {
    // 隐藏图表加载状态
    loadingCharts.value = false
    // 在loadingCharts设置为false后，等待DOM更新完成再初始化图表
    nextTick(() => {
      if (chartData.value) {
        initCharts()
      }
    })
  }
}

// 使用模拟图表数据
function useMockChartData() {
  console.log('使用模拟图表数据');
  chartData.value = {
    statusChart: {
      labels: ['在线', '离线', '告警'],
      data: [5, 2, 1]
    },
    activityChart: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      data: [12, 19, 15, 17, 22, 28]
    }
  };
}

// 获取通知列表
async function fetchNotifications() {
  try {
    loadingNotifications.value = true
    // 检查当前用户ID和token
    const currentUserId = localStorage.getItem('userId');
    const currentToken = localStorage.getItem('userToken');
    console.log('获取通知列表 - 用户ID:', currentUserId);
    console.log('获取通知列表 - token:', currentToken ? '存在' : '不存在');
    console.log('获取通知列表 - 分页参数:', { page: currentPage.value, size: pageSize.value });
    
    const result = await apiService.get('/user/notifications', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      },
      cache: true
    })
    console.log('通知列表API响应:', result);
    
    if (result.code === 200) {
      const data = result.data
      console.log('通知数据 - 总数量:', data.total);
      console.log('通知数据 - 记录数量:', (data.records || []).length);
      console.log('通知数据 - 记录:', data.records);
      
      // 处理通知数据，确保字段名正确
      const processedNotifications = (data.records || []).map(notification => {
        console.log('处理通知:', notification);
        return {
          id: notification.id,
          title: notification.title,
          message: notification.message || notification.content || notification.text || '',
          time: notification.sendTime || notification.createTime || notification.time,
          read: notification.read || false,
          // 提取时间戳用于排序
          timestamp: new Date(notification.sendTime || notification.createTime || notification.time).getTime()
        }
      })
      
      // 按照时间倒序排序，最新的通知放在前面
      processedNotifications.sort((a, b) => b.timestamp - a.timestamp);
      console.log('排序后的通知列表:', processedNotifications);
      
      // 移除timestamp字段，只保留需要显示的字段
      notifications.value = processedNotifications.map(notification => {
        const { timestamp, ...notificationWithoutTimestamp } = notification;
        return notificationWithoutTimestamp;
      });
      
      totalNotifications.value = data.total
      console.log('最终通知列表:', notifications.value);
    } else if (result.code === 401 || result.message === '无法获取用户ID') {
      // 未授权或无法获取用户ID，跳转到登录页面
      console.error('无法获取用户ID或token无效，跳转到登录页面');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      router.push('/login');
      return;
    } else {
      console.error('获取通知列表失败:', result.message);
    }
  } catch (error) {
    console.error('获取通知列表失败:', error);
  } finally {
    // 隐藏通知加载状态
    loadingNotifications.value = false
  }
}

// 查看通知
async function viewNotification(notificationId) {
  try {
    // 标记通知为已读
    await apiService.patch(`/user/notifications/${notificationId}/read`)
    
    // 获取通知详情
    const result = await apiService.get(`/user/notifications/${notificationId}`)
    if (result.code === 200) {
      const notificationData = result.data
      // 处理通知详情数据，确保字段名正确
      currentNotification.value = {
        id: notificationData.id,
        title: notificationData.title,
        message: notificationData.message || notificationData.content || notificationData.text || '',
        time: notificationData.sendTime || notificationData.createTime || notificationData.time
      }
      isNotificationModalOpen.value = true
      
      // 更新本地通知状态
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    }
  } catch (error) {
    console.error('查看通知失败:', error)
  }
}

// 关闭通知详情弹窗
const closeNotificationModal = () => {
  isNotificationModalOpen.value = false
  currentNotification.value = null
}

// 格式化时间函数
const formatTime = (timeString) => {
  if (!timeString) return ''
  return timeString.replace('T', ' ')
}

// 存储图表实例
const statusChartInstance = ref(null)
const activityChartInstance = ref(null)

// 初始化图表
function initCharts() {
  console.log('=== 开始初始化图表 ===');
  try {
    console.log('图表数据:', chartData.value);
    
    if (!chartData.value) {
      console.error('图表数据为空');
      return
    }

    // 检查图表数据结构
    if (!chartData.value.statusChart || !chartData.value.activityChart) {
      console.error('图表数据结构不正确:', chartData.value);
      return
    }

    console.log('DOM元素检查前');
    // 直接检查DOM元素
    const statusCtx = document.getElementById('statusChart')
    const activityCtx = document.getElementById('activityChart')
    console.log('statusChart元素:', statusCtx);
    console.log('activityChart元素:', activityCtx);

    // 使用nextTick确保DOM元素已经渲染完成
    nextTick(() => {
        console.log('nextTick回调中');
        // 监控状态饼图
        const statusCtx = document.getElementById('statusChart')
        console.log('nextTick中的statusChart元素:', statusCtx);
        if (!statusCtx) {
          console.error('找不到statusChart canvas元素');
          return
        }
        
        // 销毁旧图表
        if (statusChartInstance.value) {
          statusChartInstance.value.destroy()
        }
        
        // 检查饼图数据
        if (!chartData.value.statusChart.labels || !chartData.value.statusChart.data) {
          console.error('饼图数据不完整:', chartData.value.statusChart);
          return
        }
        
        // 替换硬编码的监控状态标签为翻译键
        const statusLabels = chartData.value.statusChart.labels.map(label => {
          if (label === '在线') {
            return t('admin.monitoring.online')
          } else if (label === '离线') {
            return t('admin.monitoring.offline')
          } else if (label === '正常') {
            return t('admin.monitoring.normal')
          } else if (label === '告警') {
            return t('admin.monitoring.alarm')
          }
          return label
        })
        
        console.log('饼图数据:', {
          labels: statusLabels,
          data: chartData.value.statusChart.data
        });
        
        try {
          statusChartInstance.value = new Chart(statusCtx, {
            type: 'pie',
            data: {
              labels: statusLabels,
              datasets: [{
                data: chartData.value.statusChart.data,
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: t('agent.dashboard.statusChart')
                }
              }
            }
          })
          console.log('饼图初始化成功');
        } catch (error) {
          console.error('饼图初始化失败:', error);
        }

        // 活动趋势折线图
        const activityCtx = document.getElementById('activityChart')
        console.log('nextTick中的activityChart元素:', activityCtx);
        if (!activityCtx) {
          console.error('找不到activityChart canvas元素');
          return
        }
        
        // 检查折线图数据
        if (!chartData.value.activityChart.labels || !chartData.value.activityChart.data) {
          console.error('折线图数据不完整:', chartData.value.activityChart);
          return
        }
        
        console.log('折线图数据:', {
          labels: chartData.value.activityChart.labels,
          data: chartData.value.activityChart.data
        });
        
        try {
          // 销毁旧图表
          if (activityChartInstance.value) {
            activityChartInstance.value.destroy()
          }
          activityChartInstance.value = new Chart(activityCtx, {
            type: 'line',
            data: {
              labels: chartData.value.activityChart.labels,
              datasets: [{
                label: t('agent.dashboard.alarmCount'),
                data: chartData.value.activityChart.data,
                borderColor: '#F44336',
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: t('agent.dashboard.activityChart')
                }
              }
            }
          })
          console.log('折线图初始化成功');
        } catch (error) {
          console.error('折线图初始化失败:', error);
        }
    });
  } catch (error) {
    console.error('图表初始化失败:', error);
  } finally {
    console.log('=== 图表初始化结束 ===');
  }
}
</script>

<style scoped>
/* 阿里云风格仪表盘 */
.agent-dashboard {
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 加载状态样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #1890FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

/* 卡片加载状态 */
.data-card.loading {
  position: relative;
  overflow: hidden;
}

.data-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% { left: 100%; }
}

/* 图表加载状态 */
.chart-card.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  justify-content: center;
}

.chart-loading p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 通知加载状态 */
.loading-notifications {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-notifications p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 仪表盘头部 */
.dashboard-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 24px 32px;
  background-color: white;
  border-bottom: 1px solid #e8e8e8;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1890FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.user-details {
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 2px 0;
}

.user-phone {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* 仪表盘内容 */
.dashboard-content {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 区域头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 数据卡片 */
.data-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.data-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.data-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.monitor-icon {
  background-color: #e6f7ff;
  color: #1890FF;
}

.available-icon {
  background-color: #f6ffed;
  color: #52c41a;
}

.online-icon {
  background-color: #f6ffed;
  color: #52c41a;
}

.offline-icon {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.plan-icon {
  background-color: #f9f0ff;
  color: #722ed1;
}

.card-content h3 {
  font-size: 12px;
  color: #999;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.card-value.exceeded {
  color: #ff4d4f;
}

.card-expire {
  font-size: 12px;
  color: #999;
  margin: 0 0 2px 0;
}

.card-remaining {
  font-size: 12px;
  color: #1890FF;
  font-weight: 600;
  margin: 0;
}

/* 图表区域 */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
}

.chart-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 300px;
  border: 1px solid #e8e8e8;
  position: relative;
}

/* 功能按钮 */
.function-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.function-btn {
  background-color: white;
  border-radius: 8px;
  padding: 24px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.function-btn:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #1890FF;
}

.btn-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-icon {
  background-color: #e6f7ff;
  color: #1890FF;
}

.manage-icon {
  background-color: #f6ffed;
  color: #52c41a;
}

.service-icon {
  background-color: #f9f0ff;
  color: #722ed1;
}

.setting-icon {
  background-color: #e6f7ff;
  color: #1890FF;
}

.function-btn span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

/* 系统通知区域样式 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;
  border-left: 3px solid #faad14;
  border: 1px solid #e8e8e8;
}

.notification-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.notification-item.read {
  border-left-color: #52c41a;
  background-color: #fafafa;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.notification-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

.notification-message {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.notification-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #fffbe6;
  color: #faad14;
}

.notification-status.read {
  background-color: #f6ffed;
  color: #52c41a;
}

.view-btn {
  padding: 4px 12px;
  border: 1px solid #1890FF;
  border-radius: 4px;
  background-color: white;
  color: #1890FF;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background-color: #1890FF;
  color: white;
}

.empty-notifications {
  background-color: white;
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-notifications p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

/* 通知详情弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.notification-detail-time {
  font-size: 12px;
  color: #999;
  margin: 0 0 12px 0;
}

.notification-detail-message {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.btn-primary {
  background-color: #1890FF;
  color: white;
  border-color: #1890FF;
}

.btn-primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.alert-modal {
  max-width: 500px;
  width: 90%;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 分页控制样式 */
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.page-btn:hover:not(:disabled) {
  border-color: #1890FF;
  color: #1890FF;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  padding: 0 8px;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  margin: 0 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 16px;
  }
  
  .dashboard-content {
    padding: 16px;
  }
  
  .data-cards {
    grid-template-columns: 1fr;
  }
  
  .function-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .notification-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .notification-actions {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
  }
  
  .pagination-container {
    justify-content: center;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .page-info {
    border: none;
    padding: 0;
    margin: 0 4px;
  }
  
  .loading-spinner {
    transform: scale(0.9);
  }
  
  .spinner {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .function-buttons {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    justify-content: center;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .user-details {
    text-align: center;
  }
}
</style>