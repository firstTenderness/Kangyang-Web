<template>
  <div class="admin-container">
    <!-- 导航栏 -->
    <AdminNavbar />
    
    <div class="admin-content">
      <!-- 页面头部 -->
      <div class="admin-card">
        <div class="flex justify-between items-center">
          <h1 class="admin-page-title">{{ $t('admin.dashboard.title') }}</h1>
          <div class="admin-info">
            <div class="admin-avatar">
              <span>康养</span>
            </div>
            <div class="admin-details">
              <p class="admin-name">{{ $t('admin.dashboard.adminName') }}</p>
              <p class="admin-role">{{ $t('admin.dashboard.adminRole') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据大屏区域 -->
      <div class="admin-card">
        <h2 class="admin-page-title text-lg font-bold mb-6">{{ $t('admin.dashboard.overview') }}</h2>
        <div class="admin-grid">
          <div class="admin-stat-card">
            <div class="admin-stat-icon">👥</div>
            <div class="admin-stat-value">{{ totalUsers }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.totalUsers') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">📹</div>
            <div class="admin-stat-value">{{ totalCameras }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.totalCameras') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">✅</div>
            <div class="admin-stat-value">{{ onlineCameras }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.onlineCameras') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">❌</div>
            <div class="admin-stat-value">{{ offlineCameras }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.offlineCameras') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">💼</div>
            <div class="admin-stat-value">{{ planUsers }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.planUsers') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">❌</div>
            <div class="admin-stat-value">{{ noPlanUsers }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.noPlanUsers') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">📋</div>
            <div class="admin-stat-value">{{ planCount }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.planCount') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">➕</div>
            <div class="admin-stat-value">{{ todayNewUsers }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.todayNewUsers') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">📷</div>
            <div class="admin-stat-value">{{ todayNewCameras }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.todayNewCameras') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">👥</div>
            <div class="admin-stat-value">{{ sevenDayNewUsers }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.sevenDayNewUsers') }}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-icon">📹</div>
            <div class="admin-stat-value">{{ sevenDayNewCameras }}</div>
            <div class="admin-stat-label">{{ $t('admin.dashboard.sevenDayNewCameras') }}</div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="admin-card">
        <h2 class="admin-page-title text-lg font-bold mb-6">{{ $t('admin.dashboard.charts') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="admin-card admin-shadow-md p-4">
            <div class="chart-container">
              <canvas id="userGrowthChart"></canvas>
            </div>
          </div>
          <div class="admin-card admin-shadow-md p-4">
            <div class="chart-container">
              <canvas id="cameraStatusChart"></canvas>
            </div>
          </div>
          <div class="admin-card admin-shadow-md p-4">
            <div class="chart-container">
              <canvas id="cameraGrowthChart"></canvas>
            </div>
          </div>
          <div class="admin-card admin-shadow-md p-4">
            <div class="chart-container">
              <canvas id="planDistributionChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能导航按钮区 -->
      <div class="admin-card">
        <h2 class="admin-page-title text-lg font-bold mb-6">{{ $t('admin.dashboard.functions') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <router-link to="/admin/users" class="admin-btn admin-btn-primary flex flex-col items-center justify-center p-8 transition-all hover:scale-105">
            <div class="text-4xl mb-4">👥</div>
            <span class="font-semibold">{{ $t('admin.dashboard.users') }}</span>
          </router-link>
          <router-link to="/admin/plans" class="admin-btn admin-btn-secondary flex flex-col items-center justify-center p-8 transition-all hover:scale-105">
            <div class="text-4xl mb-4">💼</div>
            <span class="font-semibold">{{ $t('admin.dashboard.plans') }}</span>
          </router-link>
          <router-link to="/admin/notification" class="admin-btn admin-btn-success flex flex-col items-center justify-center p-8 transition-all hover:scale-105">
            <div class="text-4xl mb-4">🔔</div>
            <span class="font-semibold">{{ $t('admin.dashboard.notifications') }}</span>
          </router-link>
          <router-link to="/admin/card" class="admin-btn admin-btn-warning flex flex-col items-center justify-center p-8 transition-all hover:scale-105">
            <div class="text-4xl mb-4">💳</div>
            <span class="font-semibold">{{ $t('admin.dashboard.cards') }}</span>
          </router-link>
          <router-link to="/admin/monitoring" class="admin-btn admin-btn-info flex flex-col items-center justify-center p-8 transition-all hover:scale-105">
            <div class="text-4xl mb-4">📹</div>
            <span class="font-semibold">{{ $t('admin.dashboard.monitoring') }}</span>
          </router-link>
          <router-link to="/admin/settings" class="admin-btn admin-btn-danger flex flex-col items-center justify-center p-8 transition-all hover:scale-105">
            <div class="text-4xl mb-4">⚙️</div>
            <span class="font-semibold">{{ $t('admin.dashboard.settings') }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AdminNavbar from '../../components/AdminNavbar.vue'
import Chart from 'chart.js/auto'
import apiService from '../../services/api.js'

const router = useRouter()
const { t, locale } = useI18n()

// 监听语言变化，重新初始化图表
watch(locale, async (newLocale) => {
  console.log('Language changed to:', newLocale)
  // 重新初始化图表以更新翻译
  await initCharts()
})

// 数据
const totalUsers = ref(0)
const totalCameras = ref(0)
const onlineCameras = ref(0)
const offlineCameras = ref(0)
const planUsers = ref(0)
const noPlanUsers = ref(0)
const planCount = ref(0)
const todayNewUsers = ref(0)
const todayNewCameras = ref(0)
const sevenDayNewUsers = ref(0)
const sevenDayNewCameras = ref(0)
const chartData = ref(null)
const plans = ref([])

// 图表实例引用
const chartInstances = ref({})

// 销毁所有图表实例
function destroyCharts() {
  Object.values(chartInstances.value).forEach(chart => {
    if (chart) {
      chart.destroy()
    }
  })
  chartInstances.value = {}
}

onMounted(() => {
  // 获取概览数据
  fetchDashboardData()
  // 获取套餐列表
  fetchPlans()
  // 获取图表数据
  fetchChartData()
})

// 获取套餐列表
async function fetchPlans() {
  try {
    const result = await apiService.get('/admin/plans')
    if (result.code === 200) {
      plans.value = result.data
    }
  } catch (error) {
    console.error('获取套餐列表失败:', error)
  }
}

// 获取用户列表
async function fetchUsers() {
  try {
    console.log('开始获取用户列表...');
    const result = await apiService.get('/admin/users', {
      params: {
        page: 1,
        size: 1000 // 获取足够多的用户数据用于统计
      }
    })
    if (result.code === 200) {
      const users = result.data.records || []
      console.log('获取用户列表成功，共', users.length, '个用户');
      return users
    } else {
      console.error('获取用户列表失败:', result.message);
      return []
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return []
  }
}

// 获取监控列表
async function fetchMonitorings() {
  try {
    console.log('开始获取监控列表...');
    const result = await apiService.get('/admin/monitorings', {
      params: {
        page: 1,
        size: 1000 // 获取足够多的监控数据用于统计
      }
    })
    if (result.code === 200) {
      const monitorings = result.data.records || []
      console.log('获取监控列表成功，共', monitorings.length, '个监控');
      return monitorings
    } else {
      console.error('获取监控列表失败:', result.message);
      return []
    }
  } catch (error) {
    console.error('获取监控列表失败:', error)
    return []
  }
}

// 计算套餐分布
async function calculatePlanDistribution() {
  try {
    console.log('开始计算套餐分布...');
    // 获取套餐列表和用户列表
    const [users] = await Promise.all([
      fetchUsers()
    ])
    
    console.log('获取用户数据成功，共', users.length, '个用户');
    
    // 统计各套餐的用户数量（不包含未订阅用户）
    const planCounts = {}
    let subscribedUsers = 0
    let noPlanUsersCount = 0
    
    users.forEach(user => {
      // 只统计有套餐的用户（排除套餐名字是"未订阅"的用户）
      if (user.plan && user.plan !== 'none' && user.plan !== '无套餐' && user.plan !== '未订阅' && user.plan !== '' && user.plan !== null) {
        let planName = user.plan
        // 替换硬编码的套餐名称为翻译键
        switch(planName) {
          case '高级版':
            planName = t('adminPlans.premiumPlan');
            break;
          case '企业版':
            planName = t('adminPlans.enterprisePlan');
            break;
          case '基础版':
            planName = t('adminPlans.standardPlan');
            break;
        }
        planCounts[planName] = (planCounts[planName] || 0) + 1
        subscribedUsers++
      } else {
        // 将套餐名字是"未订阅"的用户也统计到未订阅用户中
        noPlanUsersCount++
      }
    })
    
    console.log('套餐分布统计完成:');
    console.log('- 有套餐用户数:', subscribedUsers);
    console.log('- 未订阅用户数:', noPlanUsersCount);
    console.log('- 套餐分布:', planCounts);
    
    // 转换为图表需要的格式
    const labels = Object.keys(planCounts)
    const data = Object.values(planCounts)
    
    // 如果没有数据，返回默认值
    if (labels.length === 0) {
      console.log('没有套餐分布数据，返回默认值');
      return { labels: [t('common.noData')], data: [1] }
    }
    
    console.log('套餐分布数据准备完成:', { labels, data });
    return { labels, data }
  } catch (error) {
    console.error('计算套餐分布失败:', error)
    return { labels: [t('common.noData')], data: [1] }
  }
}

// 获取概览数据
async function fetchDashboardData() {
  try {
    console.log('开始获取概览数据...');
    const result = await apiService.get('/admin/dashboard')
    if (result.code === 200) {
      const data = result.data
      console.log('获取概览数据成功:', data);
      
      // 确保数据存在且为数字类型
      totalUsers.value = Number(data.totalUsers) || 0
      totalCameras.value = Number(data.totalCameras) || 0
      onlineCameras.value = Number(data.onlineCameras) || 0
      offlineCameras.value = Number(data.offlineCameras) || 0
      
      planCount.value = Number(data.planCount) || 0
      todayNewUsers.value = Number(data.todayNewUsers) || 0
      todayNewCameras.value = Number(data.todayNewCameras) || 0
      
      console.log('API返回的当日新增用户数:', data.todayNewUsers);
      console.log('处理后的当日新增用户数:', todayNewUsers.value);
      console.log('API返回的当日新增监控数:', data.todayNewCameras);
      console.log('处理后的当日新增监控数:', todayNewCameras.value);
      
      // 获取用户列表和监控列表
      const [users, monitorings] = await Promise.all([
        fetchUsers(),
        fetchMonitorings()
      ]);
      let subscribedUsers = 0;
      let noPlanUsersCount = 0;
      
      // 计算当日新增用户数量和当日新增监控数量
      let todayNewUsersCount = 0;
      let todayNewCamerasCount = 0;
      let sevenDayNewUsersCount = 0;
      let sevenDayNewCamerasCount = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // 生成近七天的日期范围
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      
      users.forEach(user => {
        // 只统计套餐名字不是"未订阅"的用户为套餐开通用户
        if (user.plan && user.plan !== 'none' && user.plan !== '无套餐' && user.plan !== '未订阅' && user.plan !== '' && user.plan !== null) {
          subscribedUsers++;
        } else {
          // 将套餐名字是"未订阅"的用户也统计到未订阅用户中
          noPlanUsersCount++;
        }
        
        // 计算当日新增用户（根据用户的registerTime字段）
        if (user.registerTime) {
          const userCreateTime = new Date(user.registerTime);
          userCreateTime.setHours(0, 0, 0, 0);
          if (userCreateTime.getTime() === today.getTime()) {
            todayNewUsersCount++;
          }
          // 计算七日新增用户
          if (userCreateTime.getTime() >= sevenDaysAgo.getTime() && userCreateTime.getTime() <= today.getTime()) {
            sevenDayNewUsersCount++;
          }
        }
      });
      
      // 计算当日新增监控（根据监控的addTime字段）
      console.log('开始计算当日新增监控数...');
      console.log('监控总数:', monitorings.length);
      
      // 生成今天的日期（与数据报表中的计算逻辑一致）
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      monitorings.forEach(monitoring => {
        if (monitoring.addTime) {
          try {
            const monitoringAddTime = new Date(monitoring.addTime);
            console.log('监控ID:', monitoring.id, '添加时间:', monitoring.addTime, '转换后日期:', monitoringAddTime.toISOString());
            
            // 与数据报表中的时间处理逻辑一致
            const monitoringDate = new Date(monitoringAddTime);
            monitoringDate.setHours(0, 0, 0, 0);
            
            console.log('监控日期:', monitoringDate.toISOString(), '今天日期:', todayDate.toISOString());
            console.log('日期是否相同:', monitoringDate.getTime() === todayDate.getTime());
            
            if (monitoringDate.getTime() === todayDate.getTime()) {
              todayNewCamerasCount++;
              console.log('统计到一个当日新增监控，当前计数:', todayNewCamerasCount);
            }
            // 计算七日新增监控
            if (monitoringDate.getTime() >= sevenDaysAgo.getTime() && monitoringDate.getTime() <= today.getTime()) {
              sevenDayNewCamerasCount++;
            }
          } catch (error) {
            console.error('解析监控添加时间失败:', error, '时间字符串:', monitoring.addTime);
          }
        } else {
          console.log('监控ID:', monitoring.id, '没有addTime字段');
        }
      });
      
      console.log('当日新增监控数计算完成，共:', todayNewCamerasCount, '个');
      console.log('API返回的当日新增监控数:', data.todayNewCameras);
      console.log('是否使用计算结果:', todayNewCameras.value === 0 && todayNewCamerasCount > 0);
      console.log('七日新增用户数计算完成，共:', sevenDayNewUsersCount, '个');
      console.log('七日新增监控数计算完成，共:', sevenDayNewCamerasCount, '个');
      
      // 如果API返回的当日新增用户数为0，但我们计算出了当日新增用户数，则使用我们计算的结果
      if (todayNewUsers.value === 0 && todayNewUsersCount > 0) {
        todayNewUsers.value = todayNewUsersCount;
        console.log('使用计算的当日新增用户数:', todayNewUsers.value);
      }
      
      // 无论API返回什么值，都使用我们计算的结果，因为API返回的数据可能不准确
      console.log('更新当日新增监控数，从:', todayNewCameras.value, '改为:', todayNewCamerasCount);
      todayNewCameras.value = todayNewCamerasCount;
      console.log('使用计算的当日新增监控数:', todayNewCameras.value);
      
      // 更新七日新增统计数据
      sevenDayNewUsers.value = sevenDayNewUsersCount;
      sevenDayNewCameras.value = sevenDayNewCamerasCount;
      console.log('更新七日新增用户数:', sevenDayNewUsers.value);
      console.log('更新七日新增监控数:', sevenDayNewCameras.value);
      
      // 更新套餐开通用户和未订阅用户数量
      planUsers.value = subscribedUsers;
      noPlanUsers.value = noPlanUsersCount;
      
      console.log('数据处理完成:');
      console.log('- 总用户数:', totalUsers.value);
      console.log('- 套餐开通用户数:', planUsers.value);
      console.log('- 未订阅套餐用户数:', noPlanUsers.value);
      console.log('- 当日新增用户数:', todayNewUsers.value);
      console.log('- 当日新增监控数:', todayNewCameras.value);
      console.log('- 七日新增用户数:', sevenDayNewUsers.value);
      console.log('- 七日新增监控数:', sevenDayNewCameras.value);
    } else {
      console.error('获取概览数据失败:', result.message);
      // 重置数据为默认值
      resetDashboardData();
    }
  } catch (error) {
    console.error('获取概览数据失败:', error)
    // 重置数据为默认值
    resetDashboardData();
  }
}

// 重置仪表盘数据为默认值
function resetDashboardData() {
  totalUsers.value = 0
  totalCameras.value = 0
  onlineCameras.value = 0
  offlineCameras.value = 0
  planUsers.value = 0
  noPlanUsers.value = 0
  planCount.value = 0
  todayNewUsers.value = 0
  todayNewCameras.value = 0
  sevenDayNewUsers.value = 0
  sevenDayNewCameras.value = 0
}

// 获取图表数据
async function fetchChartData() {
  try {
    const result = await apiService.get('/admin/dashboard/charts')
    if (result.code === 200) {
      chartData.value = result.data
      await initCharts()
    }
  } catch (error) {
    console.error('获取图表数据失败:', error)
  }
}

async function initCharts() {
  if (!chartData.value) return

  // 销毁现有图表实例
  destroyCharts()

  // 用户增长趋势图
  const userGrowthCtx = document.getElementById('userGrowthChart')
  
  // 生成最近七天的日期标签，最后一个是今天
  const generateRecentDaysLabels = () => {
    const labels = []
    const today = new Date()
    
    // 生成最近七天的日期
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      labels.push(`${month}/${day}`)
    }
    
    return labels
  }
  
  // 使用生成的近七天日期标签
  const processedLabels = generateRecentDaysLabels()
  
  // 获取用户列表，计算近七天每天的新增用户数
  const users = await fetchUsers();
  const dailyNewUsers = Array(7).fill(0); // 初始化近七天的新增用户数为0
  const today = new Date();
  
  // 计算近七天的日期范围
  const dateRange = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dateRange.push(date);
  }
  
  // 统计每天的新增用户数
  users.forEach(user => {
    if (user.registerTime) {
      const userCreateTime = new Date(user.registerTime);
      userCreateTime.setHours(0, 0, 0, 0);
      
      // 检查用户注册时间是否在近七天内
      for (let i = 0; i < dateRange.length; i++) {
        if (userCreateTime.getTime() === dateRange[i].getTime()) {
          dailyNewUsers[i]++;
          break;
        }
      }
    }
  });
  
  console.log('近七天每日新增用户数:', dailyNewUsers);
  
  chartInstances.value.userGrowth = new Chart(userGrowthCtx, {
    type: 'line',
    data: {
      labels: processedLabels,
      datasets: [{
        label: t('admin.dashboard.userGrowthChart'),
        data: dailyNewUsers,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: t('admin.dashboard.userGrowthChart')
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return Math.floor(value)
            }
          }
        }
      }
    }
  })

  // 监控状态分布图
  const cameraStatusCtx = document.getElementById('cameraStatusChart')
  // 替换硬编码的监控状态标签为翻译键
  const cameraStatusLabels = chartData.value.cameraStatus.labels.map(label => {
    if (label === '在线') {
      return t('admin.monitoring.online')
    } else if (label === '离线') {
      return t('admin.monitoring.offline')
    }
    return label
  })
  chartInstances.value.cameraStatus = new Chart(cameraStatusCtx, {
    type: 'pie',
    data: {
      labels: cameraStatusLabels,
      datasets: [{
        data: chartData.value.cameraStatus.data,
        backgroundColor: ['#27ae60', '#e74c3c']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: t('admin.dashboard.cameraStatusChart')
        }
      }
    }
  })

  // 监控增长趋势图
  const cameraGrowthCtx = document.getElementById('cameraGrowthChart')
  
  // 获取监控列表，计算近七天每天的新增监控数
  const monitorings = await fetchMonitorings();
  const dailyNewCameras = Array(7).fill(0); // 初始化近七天的新增监控数为0
  
  // 统计每天的新增监控数
  monitorings.forEach(monitoring => {
    if (monitoring.addTime) {
      const monitoringAddTime = new Date(monitoring.addTime);
      monitoringAddTime.setHours(0, 0, 0, 0);
      
      // 检查监控添加时间是否在近七天内
      for (let i = 0; i < dateRange.length; i++) {
        if (monitoringAddTime.getTime() === dateRange[i].getTime()) {
          dailyNewCameras[i]++;
          break;
        }
      }
    }
  });
  
  console.log('近七天每日新增监控数:', dailyNewCameras);
  
  chartInstances.value.cameraGrowth = new Chart(cameraGrowthCtx, {
    type: 'line',
    data: {
      labels: processedLabels,
      datasets: [{
        label: t('admin.dashboard.cameraGrowthChart'),
        data: dailyNewCameras,
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: t('admin.dashboard.cameraGrowthChart')
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return Math.floor(value)
            }
          }
        }
      }
    }
  })

  // 套餐分布饼图
  const planDistributionCtx = document.getElementById('planDistributionChart')
  
  try {
    // 计算套餐分布
    const planDistribution = await calculatePlanDistribution()
    
    // 使用计算的数据
    chartInstances.value.planDistribution = new Chart(planDistributionCtx, {
      type: 'doughnut',
      data: {
        labels: planDistribution.labels,
        datasets: [{
          data: planDistribution.data,
          backgroundColor: ['#3498db', '#f39c12', '#9b59b6', '#27ae60', '#e74c3c', '#1abc9c', '#95a5a6', '#34495e']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: t('admin.dashboard.planDistributionChart')
          }
        }
      }
    })
  } catch (error) {
    console.error('初始化套餐分布图表失败:', error)
    // 使用默认数据
    chartInstances.value.planDistribution = new Chart(planDistributionCtx, {
      type: 'doughnut',
      data: {
        labels: [t('common.noData')],
        datasets: [{
          data: [1],
          backgroundColor: ['#95a5a6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: t('admin.dashboard.planDistributionChart')
          }
        }
      }
    })
  }
}
</script>

<style scoped>
/* 页面特定样式 */
.admin-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.admin-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--admin-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.admin-details {
  text-align: right;
}

.admin-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: var(--admin-text);
}

.admin-role {
  font-size: 14px;
  color: var(--admin-text-light);
  margin: 0;
}

/* 图表卡片样式 */
.chart-card {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

/* 图表容器样式 - PC端 */
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
  margin: 0 auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .admin-info {
    align-self: flex-end;
  }
  
  .grid {
    grid-template-columns: 1fr !important;
  }
  
  .admin-btn {
    padding: 40px 20px !important;
  }
  
  /* 移动端图表大小调整 */
  .chart-container {
    height: 200px; /* 进一步减小移动端图表高度 */
  }
  
  /* 确保图表容器不超出卡片范围 */
  .admin-card .admin-shadow-md {
    padding: 10px !important; /* 减小移动端卡片内边距 */
    box-sizing: border-box;
  }
  
  /* 移动端图表标题调整 */
  .admin-card .admin-shadow-md h3 {
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  /* 移动端图表图例调整 */
  .chart-container canvas {
    max-width: 100%;
    height: auto !important;
  }
  
  /* 确保网格布局在移动端正确显示 */
  .grid {
    gap: 15px !important;
  }
}
</style>