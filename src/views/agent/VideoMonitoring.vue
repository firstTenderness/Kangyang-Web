<template>
  <div class="video-monitoring">
    <!-- 导航栏 -->
    <AgentNavbar />
    
    <div class="monitoring-header">
      <h1>{{ t('agent.videoMonitoring.monitoringView') }}</h1>
      <div class="header-actions">
        <button class="action-btn refresh-btn" @click="refreshCameras" :disabled="loading">
          <span>{{ t('common.refresh') }}</span>
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>{{ t('common.loading') }}</p>
      </div>
    </div>

    <div class="monitoring-content">
      <div class="camera-grid">
        <!-- 监控大屏 -->
        <div v-for="camera in cameras" :key="camera.id" class="camera-card" @click="openCameraUrl($event, camera)">
          <div class="camera-header">
            <h3>{{ camera.name }}</h3>
            <div class="camera-status">
              <span :class="['status-indicator', (camera.status === 'online' || camera.status === '在线') ? 'online' : 'offline']"></span>
              <span>{{ (camera.status === 'online' || camera.status === '在线') ? t('agent.videoMonitoring.online') : t('agent.videoMonitoring.offline') }}</span>
            </div>
          </div>
          <div class="camera-preview">
            <img :src="camera.imageUrl" :alt="camera.name" :class="{ 'camera-offline': !(camera.status === 'online' || camera.status === '在线') }">
            <div v-if="!(camera.status === 'online' || camera.status === '在线')" class="offline-overlay">
              <span>{{ t('agent.videoMonitoring.deviceOffline') }}</span>
              <button class="reconnect-btn" @click.stop="reconnectCamera(camera.id)" :disabled="loading">
                {{ t('agent.videoMonitoring.reconnect') }}
              </button>
            </div>
            <div class="camera-controls">
              <button 
                class="control-btn power-btn" 
                @click.stop="toggleCameraPower(camera.id)"
                :class="{ 'power-on': (camera.status === 'online' || camera.status === '在线') }"
                :disabled="loading"
              >
                <span>{{ (camera.status === 'online' || camera.status === '在线') ? '🔴' : '🟢' }}</span>
              </button>
            </div>
          </div>
          <div class="camera-info">
            <p><span class="label">{{ t('agent.videoMonitoring.lastUpdated') }}:</span> {{ getCurrentTime() }}</p>
            <p><span class="label">{{ t('agent.videoMonitoring.aiStatus') }}:</span> {{ t('agent.videoMonitoring.running') }}</p>
            <p><span class="label">{{ t('agent.videoMonitoring.monitoringRange') }}:</span> {{ (camera.monitoringRange || camera.range) || t('agent.videoMonitoring.notSet') }}</p>
            <p><span class="label">{{ t('agent.videoMonitoring.monitoringId') }}:</span> {{ camera.id }}</p>
          </div>
        </div>
      </div>

      <!-- 历史记录区域 -->
      <div class="history-section">
        <h2>{{ t('agent.videoMonitoring.recentAlerts') }}</h2>
        <div class="history-table">
          <table>
            <thead>
              <tr>
                <th>{{ t('agent.videoMonitoring.serialNumber') }}</th>
                <th>{{ t('agent.videoMonitoring.monitoringId') }}</th>
                <th>{{ t('agent.videoMonitoring.time') }}</th>
                <th>{{ t('agent.videoMonitoring.monitoringRange') }}</th>
                <th>{{ t('agent.videoMonitoring.monitoringName') }}</th>
                <th>{{ t('agent.videoMonitoring.alertType') }}</th>
                <th>{{ t('agent.videoMonitoring.status') }}</th>
                <th>{{ t('agent.videoMonitoring.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(alert, index) in paginatedAlerts" :key="alert.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ alert.monitorId }}</td>
                <td>{{ alert.time }}</td>
                <td>{{ alert.range }}</td>
                <td>{{ alert.camera }}</td>
                <td>{{ alert.type }}</td>
                <td>
                  <span :class="alert.status === 'resolved' ? 'status-resolved' : 'status-pending'">
                    {{ alert.status === 'resolved' ? t('agent.videoMonitoring.resolved') : t('agent.videoMonitoring.pending') }}
                  </span>
                </td>
                <td>
                  <button class="view-btn" @click="viewAlertDetail(alert.id)" :disabled="loading">
                    {{ t('agent.videoMonitoring.view') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 分页控制 -->
        <div class="pagination">
          <button 
            class="page-btn" 
            @click="prevPage" 
            :disabled="currentPage === 1 || loading"
          >
            {{ t('agent.videoMonitoring.previousPage') }}
          </button>
          <span class="page-info">
            {{ t('agent.videoMonitoring.pageInfo', { currentPage, totalPages }) }}
          </span>
          <button 
            class="page-btn" 
            @click="nextPage" 
            :disabled="currentPage === totalPages || loading"
          >
            {{ t('agent.videoMonitoring.nextPage') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 告警详情弹窗 -->
  <div v-if="showAlertDetail" class="alert-modal-overlay" @click="closeAlertDetail">
    <div class="alert-modal" @click.stop>
      <div class="alert-modal-header">
        <h3>{{ t('agent.videoMonitoring.alertDetail') }}</h3>
        <button class="close-btn" @click="closeAlertDetail">
          <span>×</span>
        </button>
      </div>
      <div class="alert-modal-content" v-if="currentAlert">
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.monitoringId') }}:</span>
          <span class="detail-value">{{ currentAlert.monitorId }}</span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.monitoringRange') }}:</span>
          <span class="detail-value">{{ currentAlert.range }}</span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.alertTime') }}:</span>
          <span class="detail-value">{{ currentAlert.time }}</span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.monitoringName') }}:</span>
          <span class="detail-value">{{ currentAlert.camera }}</span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.alertType') }}:</span>
          <span class="detail-value">{{ currentAlert.type }}</span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.issue') }}:</span>
          <span class="detail-value">{{ currentAlert.issue }}</span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.details') }}:</span>
          <span class="detail-value">{{ currentAlert.details }}</span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.smsNotification') }}:</span>
          <span class="detail-value" :class="currentAlert.smsNotified ? 'notified' : 'not-notified'">
            {{ currentAlert.smsNotified ? t('agent.videoMonitoring.notified') : t('agent.videoMonitoring.notNotified') }}
          </span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.phoneNotification') }}:</span>
          <span class="detail-value" :class="currentAlert.phoneNotified ? 'notified' : 'not-notified'">
            {{ currentAlert.phoneNotified ? t('agent.videoMonitoring.notified') : t('agent.videoMonitoring.notNotified') }}
          </span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.notificationStatus') }}:</span>
          <span class="detail-value">
            {{ currentAlert.smsNotified || currentAlert.phoneNotified ? t('agent.videoMonitoring.notified') : t('agent.videoMonitoring.notNotified') }}
          </span>
        </div>
        <div class="alert-detail-item">
          <span class="detail-label">{{ t('agent.videoMonitoring.processingStatus') }}:</span>
          <span class="detail-value" :class="currentAlert.status === 'resolved' ? 'status-resolved' : 'status-pending'">
            {{ currentAlert.status === 'resolved' ? t('agent.videoMonitoring.resolved') : t('agent.videoMonitoring.pending') }}
          </span>
        </div>
      </div>
      <div class="alert-modal-footer">
        <button class="modal-btn primary-btn" @click="closeAlertDetail">
          {{ t('agent.videoMonitoring.confirm') }}
        </button>
      </div>
    </div>
  </div>

  <!-- 统一的提示弹窗 -->
  <div v-if="isAlertModalOpen" class="modal-overlay" @click="closeAlertModal">
    <div class="modal-content alert-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ t('agent.videoMonitoring.systemNotice') }}</h3>
        <button class="close-btn" @click="closeAlertModal">×</button>
      </div>
      <div class="modal-body">
        <p class="alert-message">{{ alertMessage }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="closeAlertModal">{{ t('agent.videoMonitoring.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AgentNavbar from '../../components/AgentNavbar.vue'
import apiService from '../../services/api.js'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// 初始化i18n
const { t, locale } = useI18n()

// 监听语言变化，刷新数据
watch(locale, () => {
  fetchCameras()
  fetchAlerts()
})

const router = useRouter()

// 初始化API服务
apiService.loadApiBaseUrl()
console.log('API基础URL:', apiService.getApiBaseUrl())

// 检查登录状态
const checkLoginStatus = () => {
  const isUserLoggedIn = localStorage.getItem('userLoggedIn')
  const token = localStorage.getItem('userToken')
  console.log('登录状态:', isUserLoggedIn)
  console.log('Token存在:', !!token)
  if (!isUserLoggedIn || !token) {
    console.warn('用户未登录，跳转到登录页')
    router.push('/login')
  }
}

// 页面加载时检查登录状态
checkLoginStatus()

// 生成五位数随机数
const generateRandomId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// 获取当前时间
const getCurrentTime = () => {
  return new Date().toLocaleString('zh-CN');
};

// 确保URL包含协议前缀
const ensureUrlProtocol = (url) => {
  if (!url) return '';
  // 检查URL是否已经包含协议前缀
  if (!/^https?:\/\//i.test(url)) {
    // 添加http://协议前缀
    return `http://${url}`;
  }
  return url;
};

// 监控数据
const cameras = ref([])
const alerts = ref([])
const loading = ref(false)

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10) // 一页显示10条
const totalPages = ref(0)

// 计算当前页的告警记录
const paginatedAlerts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return alerts.value.slice(start, end)
})

// 获取监控列表
const fetchCameras = async () => {
  try {
    loading.value = true
    console.log('开始获取监控列表...')
    console.log('API基础URL:', apiService.getApiBaseUrl())
    
    // 使用不包含/api前缀的端点，因为基础URL中已经包含了
    const endpoint = '/user/monitorings'
    console.log('使用的API端点:', endpoint)
    console.log('构建的API URL:', apiService.buildApiUrl(endpoint))
    
    const data = await apiService.get(endpoint)
    console.log('API响应数据:', data)
    
    if (data.code === 200) {
      console.log('监控列表数据:', data.data.monitorings.records)
      cameras.value = data.data.monitorings.records.map(camera => ({
        ...camera,
        // 确保监控范围字段正确处理
        monitoringRange: camera.monitoringRange || camera.range,
        range: camera.range || camera.monitoringRange,
        // 确保AI状态一律为运行中
        aiStatus: 'active',
        // 设置最后更新时间为当前时间
        lastOnline: getCurrentTime(),
        imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(camera.name + ' security camera view')}&image_size=landscape_16_9`
      }))
      console.log('处理后的监控列表:', cameras.value)
    } else {
      console.error('获取监控列表失败:', data.message)
      showAlert('获取监控列表失败：' + data.message)
    }
  } catch (error) {
    console.error('获取监控列表失败:', error)
    showAlert('获取监控列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 获取告警记录
const fetchAlerts = async () => {
  try {
    loading.value = true
    console.log('开始获取告警记录...')
    
    // 使用不包含/api前缀的端点，因为基础URL中已经包含了
    const endpoint = '/user/alerts'
    console.log('使用的API端点:', endpoint)
    console.log('构建的API URL:', apiService.buildApiUrl(endpoint, {
      page: currentPage.value,
      size: pageSize.value
    }))
    
    const data = await apiService.get(endpoint, {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })
    console.log('API响应数据:', data)
    
    if (data.code === 200) {
      alerts.value = data.data.records
      totalPages.value = data.data.pages
      console.log('告警记录数据:', alerts.value)
    } else {
      console.error('获取告警记录失败:', data.message)
      showAlert('获取告警记录失败：' + data.message)
    }
  } catch (error) {
    console.error('获取告警记录失败:', error)
    showAlert('获取告警记录失败，请重试')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchCameras()
  fetchAlerts()
})

// 监听分页变化，重新获取数据
watch(currentPage, () => {
  fetchAlerts()
})

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 告警详情弹窗状态
const showAlertDetail = ref(false)
const currentAlert = ref(null)

// 提示弹窗状态
const isAlertModalOpen = ref(false)
const alertMessage = ref('')

// 刷新所有监控
const refreshCameras = async () => {
  try {
    loading.value = true
    console.log('开始刷新监控...')
    
    // 使用不包含/api前缀的端点，因为基础URL中已经包含了
    const endpoint = '/user/monitorings/refresh'
    console.log('使用的API端点:', endpoint)
    
    const data = await apiService.post(endpoint)
    console.log('API响应数据:', data)
    
    if (data.code === 200) {
      // 刷新成功后重新获取监控列表
      await fetchCameras()
      showAlert('监控已刷新')
    } else {
      console.error('刷新监控失败:', data.message)
      showAlert('刷新监控失败：' + data.message)
    }
  } catch (error) {
    console.error('刷新监控失败:', error)
    showAlert('刷新监控失败，请重试')
  } finally {
    loading.value = false
  }
}

// 切换监控电源状态（开机/关机）
const toggleCameraPower = async (cameraId) => {
  try {
    loading.value = true
    const camera = cameras.value.find(c => c.id === cameraId)
    if (!camera) return
    
    // 根据当前状态切换
    const newStatus = (camera.status === 'online' || camera.status === '在线') ? 'offline' : 'online'
    const operation = newStatus === 'online' ? '开机' : '关机'
    
    const data = await apiService.put(`/user/monitorings/${cameraId}/power`, {
      status: newStatus
    })
    
    if (data.code === 200) {
      // 更新本地状态
      camera.status = data.data.status
      camera.lastOnline = getCurrentTime()
      showAlert(`${camera.name} 已${operation}`)
    } else {
      showAlert(`${operation}失败：` + data.message)
    }
  } catch (error) {
    console.error('切换电源状态失败:', error)
    showAlert('切换电源状态失败，请重试')
  } finally {
    loading.value = false
  }
}

// 重新连接离线的监控
const reconnectCamera = async (cameraId) => {
  try {
    loading.value = true
    const camera = cameras.value.find(c => c.id === cameraId)
    if (!camera) return
    
    const data = await apiService.post(`/user/monitorings/${cameraId}/reconnect`)
    
    if (data.code === 200) {
      // 更新本地状态
      camera.status = 'online'
      camera.lastOnline = new Date().toLocaleString()
      camera.aiStatus = 'active'
      showAlert(`${camera.name} ${t('agent.videoMonitoring.reconnectSuccess')}`)
    } else {
      showAlert(`${t('agent.videoMonitoring.reconnectFailed')}：` + data.message)
    }
  } catch (error) {
    console.error('重新连接监控失败:', error)
    showAlert(t('agent.videoMonitoring.reconnectFailed') + '，' + t('common.retry'))
  } finally {
    loading.value = false
  }
}

// 打开相机URL
const openCameraUrl = async (event, camera) => {
  try {
    // 阻止默认行为和事件冒泡
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    loading.value = true
    console.log('开始获取监控URL:', camera.id)
    
    // 检查相机对象是否已经包含URL字段
    if (camera.url) {
      console.log('使用相机对象中的URL:', camera.url)
      // 确保URL包含协议前缀
      const fullUrl = ensureUrlProtocol(camera.url)
      // 在新窗口打开URL
      window.open(fullUrl, '_blank')
    } else {
      // 通过接口获取URL地址
      const data = await apiService.get(`/api/admin/monitorings/${camera.id}`)
      
      if (data.code === 200) {
        // 检查返回数据中是否包含URL字段
        const cameraData = data.data
        if (cameraData.url) {
          console.log('获取到相机URL:', cameraData.url)
          // 确保URL包含协议前缀
          const fullUrl = ensureUrlProtocol(cameraData.url)
          // 在新窗口打开URL
          window.open(fullUrl, '_blank')
        } else {
          showAlert('该监控未设置URL地址')
        }
      } else {
        showAlert('获取监控信息失败：' + data.message)
      }
    }
  } catch (error) {
    console.error('获取监控URL失败:', error)
    showAlert('获取监控URL失败，请重试')
  } finally {
    loading.value = false
  }
}

// 查看告警详情
const viewAlertDetail = async (alertId) => {
  try {
    loading.value = true
    const data = await apiService.get(`/user/alerts/${alertId}`)
    if (data.code === 200) {
      currentAlert.value = data.data
      showAlertDetail.value = true
      
      // 同时将告警状态改为已处理
      await resolveAlert(alertId)
    } else {
      showAlert('获取告警详情失败：' + data.message)
    }
  } catch (error) {
    console.error('获取告警详情失败:', error)
    showAlert('获取告警详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// 处理告警
const resolveAlert = async (alertId) => {
  try {
    const data = await apiService.put(`/user/alerts/${alertId}/resolve`)
    if (data.code === 200) {
      // 更新本地告警状态
      const alert = alerts.value.find(a => a.id === alertId)
      if (alert) {
        alert.status = 'resolved'
      }
    }
  } catch (error) {
    console.error('处理告警失败:', error)
  }
}

// 关闭告警详情弹窗
const closeAlertDetail = () => {
  showAlertDetail.value = false
  currentAlert.value = null
}

// 显示提示弹窗
const showAlert = (message) => {
  alertMessage.value = message
  isAlertModalOpen.value = true
}

// 关闭提示弹窗
const closeAlertModal = () => {
  isAlertModalOpen.value = false
}
</script>

<style scoped>
.video-monitoring {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.monitoring-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}

.monitoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.monitoring-header h1 {
  font-size: 28px;
  color: #1E88E5;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 10px 20px;
  border: 1px solid #1E88E5;
  border-radius: 6px;
  background-color: white;
  color: #1E88E5;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  background-color: #1E88E5;
  color: white;
}

.refresh-btn:hover {
  background-color: #1976D2;
}

.fullscreen-btn:hover {
  background-color: #1976D2;
}

.monitoring-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.camera-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.camera-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.camera-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.camera-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.camera-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.camera-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background-color: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
}

.status-indicator.offline {
  background-color: #F44336;
}

.camera-status span {
  font-size: 14px;
  color: #666;
}

.camera-preview {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.camera-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.offline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 15px;
}

.offline-overlay span {
  font-size: 18px;
  font-weight: 600;
}

.reconnect-btn {
  padding: 8px 16px;
  border: 1px solid white;
  border-radius: 4px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reconnect-btn:hover {
  background-color: white;
  color: #333;
}

.camera-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 16px;
}

.control-btn:hover {
  background-color: white;
  transform: scale(1.1);
}

.control-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.camera-info {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
}

.camera-info p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.camera-info .label {
  font-weight: 600;
  color: #333;
}

.history-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.history-table {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.history-table table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.history-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.history-table td {
  font-size: 14px;
  color: #666;
}

.status-resolved {
  padding: 4px 12px;
  border-radius: 12px;
  background-color: #E8F5E9;
  color: #4CAF50;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  padding: 4px 12px;
  border-radius: 12px;
  background-color: #FFF3E0;
  color: #FF9800;
  font-size: 12px;
  font-weight: 600;
}

.view-btn {
  padding: 6px 12px;
  border: 1px solid #1E88E5;
  border-radius: 4px;
  background-color: white;
  color: #1E88E5;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background-color: #1E88E5;
  color: white;
}

/* 分页控制样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background-color: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .monitoring-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    align-self: flex-end;
  }
  
  .camera-grid {
    grid-template-columns: 1fr;
  }
  
  .history-table {
    overflow-x: auto;
  }
  
  .alert-modal {
    width: 95%;
    margin: 20px;
  }
}

/* 离线状态的监控设备样式 */
.camera-offline {
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
}

/* 状态指示器样式修复 */
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background-color: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
}

.status-indicator.offline {
  background-color: #F44336;
}

/* 电源按钮样式 */
.power-btn {
  background-color: rgba(0, 255, 0, 0.8);
  font-size: 12px;
}

.power-btn.power-on {
  background-color: rgba(255, 0, 0, 0.8);
}

/* 告警详情弹窗样式 */
.alert-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alert-modal {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.alert-modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #e9ecef;
  color: #333;
}

.alert-modal-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.alert-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.alert-detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #333;
  min-width: 100px;
}

.detail-value {
  color: #666;
  flex: 1;
  text-align: right;
}

.detail-value.notified {
  color: #4CAF50;
  font-weight: 600;
}

.detail-value.not-notified {
  color: #F44336;
  font-weight: 600;
}

.alert-modal-footer {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: #f8f9fa;
}

.modal-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.modal-btn.primary-btn {
  background-color: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

.modal-btn.primary-btn:hover {
  background-color: #1976D2;
  border-color: #1976D2;
}

.modal-btn:hover {
  background-color: #f8f9fa;
  border-color: #1E88E5;
  color: #1E88E5;
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
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1E88E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 统一弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
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
  padding: 25px;
}

.modal-footer {
  padding: 20px 25px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-secondary {
  background-color: white;
  color: #666;
}

.btn-secondary:hover {
  background-color: #f0f0f0;
}

.btn-primary {
  background-color: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

.btn-primary:hover {
  background-color: #1976D2;
}

.alert-modal {
  max-width: 400px;
  width: 90%;
}

.alert-message {
  font-size: 16px;
  color: #333;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  padding: 20px 0;
}
</style>