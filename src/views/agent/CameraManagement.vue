<template>
  <div class="camera-management">
    <!-- 导航栏 -->
    <AgentNavbar />
    
    <div class="management-header">
      <h1>{{ t('agent.cameraManagement.title') }}</h1>
    </div>

    <div class="management-content">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            :placeholder="t('agent.cameraManagement.searchPlaceholder')"
            class="search-input"
          >
          <button class="search-btn" @click="searchCameras">{{ t('common.search') }}</button>
        </div>
        <div class="filter-options">
          <select v-model="statusFilter" class="filter-select">
            <option value="all">{{ t('agent.cameraManagement.allStatus') }}</option>
            <option value="online">{{ t('agent.cameraManagement.online') }}</option>
            <option value="offline">{{ t('agent.cameraManagement.offline') }}</option>
          </select>
          <select v-model="typeFilter" class="filter-select">
            <option value="all">{{ t('agent.cameraManagement.allTypes') }}</option>
            <option value="indoor">{{ t('agent.cameraManagement.indoor') }}</option>
            <option value="outdoor">{{ t('agent.cameraManagement.outdoor') }}</option>
          </select>
        </div>
      </div>

      <!-- 监控列表 -->
      <div class="camera-list-section">
        <div class="section-header">
          <h2>{{ t('agent.cameraManagement.cameraList') }}</h2>
          <div class="batch-buttons">
            <button class="batch-btn" @click="addCamera">{{ t('agent.cameraManagement.addCamera') }}</button>
            <button class="batch-btn" @click="batchEnable">{{ t('agent.cameraManagement.batchEnable') }}</button>
            <button class="batch-btn" @click="batchDisable">{{ t('agent.cameraManagement.batchDisable') }}</button>
            <button class="batch-btn" @click="batchDelete">{{ t('agent.cameraManagement.batchDelete') }}</button>
          </div>
        </div>
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="loading-text">{{ t('common.loading') }}</p>
        </div>
        <div class="camera-table" v-else>
          <table>
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    v-model="selectAll"
                    @change="toggleSelectAll"
                  >
                </th>
                <th>{{ t('agent.cameraManagement.index') }}</th>
                <th>{{ t('agent.cameraManagement.cameraId') }}</th>
                <th>{{ t('agent.cameraManagement.cameraName') }}</th>
                <th>{{ t('agent.cameraManagement.deviceType') }}</th>
                <th>{{ t('common.status') }}</th>
                <th>{{ t('agent.cameraManagement.lastOnline') }}</th>
                <th>{{ t('agent.cameraManagement.aiStatus') }}</th>
                <th>{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(camera, index) in paginatedCameras" :key="camera.id">
                <td>
                  <input 
                    type="checkbox" 
                    v-model="selectedCameras"
                    :value="camera.id"
                  >
                </td>
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ camera.id }}</td>
                <td>{{ camera.name }}</td>
                <td>{{ (camera.monitoringRange || camera.range || camera.type || '未设置') === 'indoor' || (camera.monitoringRange || camera.range || camera.type || '未设置') === t('agent.cameraManagement.indoor') ? t('agent.cameraManagement.indoor') : (camera.monitoringRange || camera.range || camera.type || '未设置') === 'outdoor' || (camera.monitoringRange || camera.range || camera.type || '未设置') === t('agent.cameraManagement.outdoor') ? t('agent.cameraManagement.outdoor') : t('agent.cameraManagement.notSet') }}</td>
                <td>
                  <span class="status-indicator" :class="isCameraOnline(camera) ? 'online' : 'offline'"></span>
                  <span class="status-text">{{ getCameraStatusText(camera) }}</span>
                </td>
                <td>{{ formatLastOnline(camera.lastOnline) }}</td>
                <td>
                  <span class="ai-status" :class="isAiActive(camera) ? 'active' : 'inactive'">
                    {{ getAiStatusText(camera) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn edit-btn" @click="editCamera(camera.id)">
                      {{ t('common.edit') }}
                    </button>
                    <button 
                      class="action-btn toggle-btn" 
                      @click="toggleCameraStatus(camera.id)"
                      :class="{ 'toggle-on': isCameraOnline(camera) }"
                    >
                      {{ isCameraOnline(camera) ? t('agent.cameraManagement.turnOff') : t('agent.cameraManagement.turnOn') }}
                    </button>
                    <button class="action-btn view-btn" @click="viewCamera(camera.id)">
                      {{ t('common.view') }}
                    </button>
                    <button class="action-btn delete-btn" @click="deleteCamera(camera.id)">
                      {{ t('common.delete') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="paginatedCameras.length === 0" class="empty-state">
          <p>没有找到匹配的监控设备</p>
        </div>
        <!-- 分页控制 -->
        <div class="pagination">
          <button 
            class="page-btn" 
            @click="prevPage" 
            :disabled="currentPage === 1 || loading"
          >
            {{ t('common.previousPage') }}
          </button>
          <span class="page-info">
            {{ t('common.pageInfo', { page: currentPage, total: totalPages }) }}
          </span>
          <button 
            class="page-btn" 
            @click="nextPage" 
            :disabled="currentPage === totalPages || loading"
          >
            {{ t('common.nextPage') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑监控模态框 -->
    <div v-if="isEditModalOpen" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ t('agent.cameraManagement.editCamera') }}</h3>
          <button class="close-btn" @click="closeEditModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-section">
            <h4>{{ t('agent.cameraManagement.deviceInfo') }}</h4>
            <div class="form-group">
              <label>{{ t('agent.cameraManagement.deviceName') }}</label>
              <input type="text" v-model="editForm.name" class="form-input">
            </div>
            <div class="form-group">
              <label>{{ t('agent.cameraManagement.deviceType') }}</label>
              <select v-model="editForm.type" class="form-select" @change="updateDeviceType">
                <option value="indoor">{{ t('agent.cameraManagement.indoor') }}</option>
                <option value="outdoor">{{ t('agent.cameraManagement.outdoor') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ t('agent.cameraManagement.cameraUrl') }}</label>
              <input type="text" v-model="editForm.url" class="form-input">
            </div>
          </div>

          <div class="form-section">
            <h4>{{ t('agent.cameraManagement.functionSettings') }}</h4>
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('agent.cameraManagement.cameraStatus') }}</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="statusToggle" v-model="editForm.status" @change="updateCameraStatus">
                  <label for="statusToggle">{{ editForm.status ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}</label>
                </div>
              </div>
              <div class="form-group">
                <label>{{ t('agent.cameraManagement.aiDetection') }}</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="aiToggle" v-model="editForm.aiStatus">
                  <label for="aiToggle">{{ editForm.aiStatus ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>{{ t('agent.cameraManagement.notificationSettings') }}</h4>
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('agent.cameraManagement.smsNotification') }}</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="smsToggle" v-model="editForm.notifications.sms">
                  <label for="smsToggle">{{ editForm.notifications.sms ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}</label>
                </div>
              </div>
              <div class="form-group">
                <label>{{ t('agent.cameraManagement.callNotification') }}</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="callToggle" v-model="editForm.notifications.call">
                  <label for="callToggle">{{ editForm.notifications.call ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}</label>
                </div>
              </div>
              <div class="form-group">
                <label>{{ t('agent.cameraManagement.wechatNotification') }}</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="wechatToggle" v-model="editForm.notifications.wechat">
                  <label for="wechatToggle">{{ editForm.notifications.wechat ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}</label>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('agent.cameraManagement.autoEmergencyCall') }}</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="emergencyToggle" v-model="editForm.autoEmergencyCall">
                  <label for="emergencyToggle">{{ editForm.autoEmergencyCall ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <h4>{{ t('agent.cameraManagement.emergencyContacts') }}</h4>
              <button 
                v-if="editForm.contacts.length < 5" 
                class="btn btn-sm btn-primary" 
                @click="addContact"
              >
                {{ t('agent.cameraManagement.addContact') }}
              </button>
            </div>
            <div v-for="(contact, index) in editForm.contacts" :key="index" class="contact-item">
              <div class="contact-header">
                <span>{{ t('agent.cameraManagement.contact') }} {{ index + 1 }}</span>
                <button 
                  v-if="editForm.contacts.length > 1" 
                  class="btn btn-sm btn-secondary" 
                  @click="removeContact(index)"
                >
                  {{ t('common.delete') }}
                </button>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>{{ t('agent.cameraManagement.name') }}</label>
                  <input type="text" v-model="contact.name" class="form-input">
                </div>
                <div class="form-group">
                  <label>{{ t('agent.cameraManagement.phone') }}</label>
                  <input type="text" v-model="contact.phone" class="form-input">
                </div>
              </div>
            </div>
            <p class="form-hint">{{ t('agent.cameraManagement.maxContacts') }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEditModal">{{ t('common.cancel') }}</button>
          <button class="btn btn-primary" @click="saveCameraSettings">{{ t('common.save') }}</button>
        </div>
      </div>
    </div>

    <!-- 查看监控模态框 -->
    <div v-if="isViewModalOpen" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ t('agent.cameraManagement.viewCamera') }}</h3>
          <button class="close-btn" @click="closeViewModal">×</button>
        </div>
        <div class="modal-body">
          <div class="info-section">
            <h4>{{ t('agent.cameraManagement.deviceInfo') }}</h4>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.deviceName') }}:</span>
              <span class="info-value">{{ viewForm.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.deviceType') }}:</span>
              <span class="info-value">{{ viewForm.type === 'indoor' ? t('agent.cameraManagement.indoor') : t('agent.cameraManagement.outdoor') }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.cameraId') }}:</span>
              <span class="info-value">{{ viewForm.monitorId }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.cameraUrl') }}:</span>
              <span class="info-value">{{ viewForm.url || '未设置' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.cameraStatus') }}:</span>
              <span class="info-value status-badge" :class="viewForm.status ? 'active' : 'inactive'">
                {{ viewForm.status ? t('agent.cameraManagement.online') : t('agent.cameraManagement.offline') }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.aiStatus') }}:</span>
              <span class="info-value status-badge" :class="viewForm.aiStatus ? 'active' : 'inactive'">
                {{ viewForm.aiStatus ? t('agent.cameraManagement.running') : t('agent.cameraManagement.notRunning') }}
              </span>
            </div>
          </div>

          <div class="info-section">
            <h4>{{ t('agent.cameraManagement.notificationSettings') }}</h4>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.smsNotification') }}:</span>
              <span class="info-value status-badge" :class="viewForm.notifications.sms ? 'active' : 'inactive'">
                {{ viewForm.notifications.sms ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.callNotification') }}:</span>
              <span class="info-value status-badge" :class="viewForm.notifications.call ? 'active' : 'inactive'">
                {{ viewForm.notifications.call ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.wechatNotification') }}:</span>
              <span class="info-value status-badge" :class="viewForm.notifications.wechat ? 'active' : 'inactive'">
                {{ viewForm.notifications.wechat ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('agent.cameraManagement.autoEmergencyCall') }}:</span>
              <span class="info-value status-badge" :class="viewForm.autoEmergencyCall ? 'active' : 'inactive'">
                {{ viewForm.autoEmergencyCall ? t('agent.cameraManagement.turnOn') : t('agent.cameraManagement.turnOff') }}
              </span>
            </div>
          </div>

          <div class="info-section">
            <h4>{{ t('agent.cameraManagement.emergencyContacts') }}</h4>
            <div v-if="viewForm.contacts.length > 0">
              <div v-for="(contact, index) in viewForm.contacts" :key="index" class="contact-info-item">
                <span class="contact-index">{{ t('agent.cameraManagement.contact') }} {{ index + 1 }}:</span>
                <span class="contact-detail">{{ contact.name }} ({{ contact.phone }})</span>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>{{ t('agent.cameraManagement.noContacts') }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="closeViewModal">{{ t('common.close') }}</button>
        </div>
      </div>
    </div>

    <!-- 统一的提示弹窗 -->
    <div v-if="isAlertModalOpen" class="modal-overlay" @click="closeAlertModal">
      <div class="modal-content alert-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ t('agent.cameraManagement.systemNotice') }}</h3>
          <button class="close-btn" @click="closeAlertModal">×</button>
        </div>
        <div class="modal-body">
          <p class="alert-message">{{ alertMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="closeAlertModal">{{ t('common.confirm') }}</button>
        </div>
      </div>
    </div>

    <!-- 统一的确认弹窗 -->
    <div v-if="isConfirmModalOpen" class="modal-overlay" @click="closeConfirmModal">
      <div class="modal-content confirm-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ t('agent.cameraManagement.systemNotice') }}</h3>
          <button class="close-btn" @click="closeConfirmModal">×</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">{{ confirmMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="handleConfirm(false)">{{ t('common.cancel') }}</button>
          <button class="btn btn-primary" @click="handleConfirm(true)">{{ t('common.confirm') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AgentNavbar from '../../components/AgentNavbar.vue'
import apiService from '../../services/api'

const { t, locale } = useI18n()

// 监听语言变化，重新获取数据
watch(locale, async () => {
  await fetchCameras()
})

// 监控数据
const cameras = ref([])
const loading = ref(false)

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')

// 监听过滤器变化
watch(statusFilter, (newValue) => {
  console.log('状态过滤器变化:', newValue)
  // 重置页码，让计算属性重新计算
  currentPage.value = 1
  // 不需要调用fetchCameras，计算属性会自动重新计算
})

watch(typeFilter, (newValue) => {
  console.log('类型过滤器变化:', newValue)
  // 重置页码，让计算属性重新计算
  currentPage.value = 1
  // 不需要调用fetchCameras，计算属性会自动重新计算
})

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(15) // 一页显示15个监控设备
const total = ref(0)
const totalPages = ref(0)

// 选择相关状态
const selectedCameras = ref([])
const selectAll = ref(false)

// 获取监控列表
const fetchCameras = async () => {
  try {
    loading.value = true
    console.log('开始获取监控列表...')
    console.log('当前参数:', {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      searchQuery: searchQuery.value,
      statusFilter: statusFilter.value,
      typeFilter: typeFilter.value
    })
    
    // 构建查询参数
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    if (statusFilter.value !== 'all') {
      params.status = statusFilter.value
    }
    if (typeFilter.value !== 'all') {
      params.type = typeFilter.value
    }

    console.log('发送请求参数:', params)
    // 发送请求
    const data = await apiService.get('/user/monitorings', { params })
    console.log('API响应数据:', data)
    if (data.code === 200) {
      // 正确处理响应数据结构
      if (data.data && data.data.monitorings && data.data.monitorings.records) {
        // 适配新的数据结构
        cameras.value = data.data.monitorings.records.map(camera => {
          // 转换紧急联系人数据格式
          let contacts = []
          if (camera.emergencyContacts) {
            // 从emergencyContacts对象中提取联系人数据
            for (let i = 1; i <= 5; i++) {
              const contact = camera.emergencyContacts[`contact${i}`]
              if (contact && contact.name && contact.phone) {
                contacts.push(contact)
              }
            }
          } else if (camera.contacts) {
            // 兼容旧的contacts数组格式
            contacts = camera.contacts
          }
          
          return {
            ...camera,
            // 兼容字段名变化，同时保留两个字段
            monitoringRange: camera.monitoringRange || camera.range,
            range: camera.range || camera.monitoringRange,
            // 确保状态字段格式一致
            status: camera.status === 'online' ? t('agent.cameraManagement.online') : camera.status === 'offline' ? t('agent.cameraManagement.offline') : camera.status,
            // 确保AI状态字段格式一致
            aiStatus: camera.aiStatus === 'active' ? t('agent.cameraManagement.normal') : camera.aiStatus === 'inactive' ? t('agent.cameraManagement.notRunning') : camera.aiStatus,
            // 转换紧急联系人数据
            contacts: contacts
          }
        })
        total.value = data.data.monitorings.total
        totalPages.value = data.data.monitorings.pages
        console.log('监控列表更新成功:', cameras.value.length, '条记录')
        // 打印第一条相机的详细信息
        if (cameras.value.length > 0) {
          console.log('第一条相机信息:', cameras.value[0])
        }
      } else if (data.data && data.data.records) {
        // 兼容旧的数据结构
        cameras.value = data.data.records.map(camera => {
          // 转换紧急联系人数据格式
          let contacts = []
          if (camera.emergencyContacts) {
            // 从emergencyContacts对象中提取联系人数据
            for (let i = 1; i <= 5; i++) {
              const contact = camera.emergencyContacts[`contact${i}`]
              if (contact && contact.name && contact.phone) {
                contacts.push(contact)
              }
            }
          } else if (camera.contacts) {
            // 兼容旧的contacts数组格式
            contacts = camera.contacts
          }
          
          return {
            ...camera,
            // 兼容字段名变化，同时保留两个字段
            monitoringRange: camera.monitoringRange || camera.range,
            range: camera.range || camera.monitoringRange,
            // 确保状态字段格式一致
            status: camera.status === 'online' ? t('agent.cameraManagement.online') : camera.status === 'offline' ? t('agent.cameraManagement.offline') : camera.status,
            // 确保AI状态字段格式一致
            aiStatus: camera.aiStatus === 'active' ? t('agent.cameraManagement.normal') : camera.aiStatus === 'inactive' ? t('agent.cameraManagement.notRunning') : camera.aiStatus,
            // 转换紧急联系人数据
            contacts: contacts
          }
        })
        total.value = data.data.total
        totalPages.value = data.data.pages
      } else {
        cameras.value = []
        total.value = 0
        totalPages.value = 0
      }
    } else {
      showAlert('获取监控列表失败：' + data.message)
    }
  } catch (error) {
    console.error('获取监控列表失败:', error)
    showAlert('获取监控列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取监控列表
onMounted(() => {
  console.log('组件已挂载，开始获取监控列表...')
  fetchCameras()
  // 添加一个定时器，检查cameras数组的状态
  setTimeout(() => {
    console.log('3秒后检查cameras数组:', cameras.value)
    console.log('cameras数组长度:', cameras.value.length)
  }, 3000)
})

// 搜索监控
const searchCameras = () => {
  console.log('点击搜索按钮，搜索关键词:', searchQuery.value)
  // 重置页码，让计算属性重新计算
  currentPage.value = 1
  // 不需要调用fetchCameras，计算属性会自动重新计算
}

// 切换全选状态
const toggleSelectAll = () => {
  if (selectAll.value) {
    // 全选
    selectedCameras.value = cameras.value.map(camera => camera.id)
  } else {
    // 取消全选
    selectedCameras.value = []
  }
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchCameras()
  }
}

// 编辑模态框状态
const isEditModalOpen = ref(false)
const currentCameraId = ref(null)
const editForm = ref({
  name: '',
  type: 'indoor',
  url: '',
  status: true,
  aiStatus: true,
  contacts: [
    { name: '', phone: '' }
  ],
  notifications: {
    sms: false,
    call: false,
    wechat: false
  },
  autoEmergencyCall: false
})

// 查看模态框状态
const isViewModalOpen = ref(false)
const viewForm = ref({
  name: '',
  type: 'indoor',
  monitorId: '',
  url: '',
  status: true,
  aiStatus: true,
  contacts: [],
  notifications: {
    sms: false,
    call: false,
    wechat: false
  },
  autoEmergencyCall: false
})

// 提示弹窗状态
const isAlertModalOpen = ref(false)
const alertMessage = ref('')

// 确认弹窗状态
const isConfirmModalOpen = ref(false)
const confirmMessage = ref('')
const confirmCallback = ref(null)

// 计算当前页的监控设备（带本地过滤）
const paginatedCameras = computed(() => {
  // 先进行本地过滤
  let filteredCameras = [...cameras.value]
  
  // 应用搜索过滤
  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase()
    filteredCameras = filteredCameras.filter(camera => {
      // 检查监控名称
      const nameMatch = camera.name.toLowerCase().includes(searchLower)
      // 检查监控ID（转换为字符串）
      const idMatch = camera.id.toString().includes(searchQuery.value)
      // 只要有一个匹配就返回true
      return nameMatch || idMatch
    })
  }
  
  // 应用状态过滤
  if (statusFilter.value !== 'all') {
    if (statusFilter.value === 'online') {
      filteredCameras = filteredCameras.filter(camera => 
        camera.status === t('agent.cameraManagement.online') || camera.status === '在线' || camera.status === 'online'
      )
    } else if (statusFilter.value === 'offline') {
      filteredCameras = filteredCameras.filter(camera => 
        camera.status === t('agent.cameraManagement.offline') || camera.status === '离线' || camera.status === 'offline'
      )
    }
  }
  
  // 应用类型过滤
  if (typeFilter.value !== 'all') {
    if (typeFilter.value === 'indoor') {
      filteredCameras = filteredCameras.filter(camera => 
        (camera.monitoringRange || camera.range) === 'indoor' || (camera.monitoringRange || camera.range) === t('agent.cameraManagement.indoor')
      )
    } else if (typeFilter.value === 'outdoor') {
      filteredCameras = filteredCameras.filter(camera => 
        (camera.monitoringRange || camera.range) === 'outdoor' || (camera.monitoringRange || camera.range) === t('agent.cameraManagement.outdoor')
      )
    }
  }
  
  // 计算总数
  total.value = filteredCameras.length
  totalPages.value = Math.ceil(total.value / pageSize.value)
  
  // 应用分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredCameras.slice(startIndex, endIndex)
})

// 辅助函数：判断相机是否在线
const isCameraOnline = (camera) => {
  const status = camera.status
  return status === t('agent.cameraManagement.online') || status === '在线' || status === 'online'
}

// 辅助函数：获取相机状态文本
const getCameraStatusText = (camera) => {
  const status = camera.status
  if (status === t('agent.cameraManagement.online') || status === '在线' || status === 'online') {
    return t('agent.cameraManagement.online')
  } else if (status === t('agent.cameraManagement.offline') || status === '离线' || status === 'offline') {
    return t('agent.cameraManagement.offline')
  }
  return status || '未知'
}

// 辅助函数：格式化最后在线时间
const formatLastOnline = (lastOnline) => {
  if (!lastOnline) {
    return t('agent.cameraManagement.notRecorded')
  }
  try {
    const date = new Date(lastOnline)
    if (isNaN(date.getTime())) {
      return t('agent.cameraManagement.notRecorded')
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return t('agent.cameraManagement.notRecorded')
  }
}

// 辅助函数：判断AI是否活跃
const isAiActive = (camera) => {
  const aiStatus = camera.aiStatus
  return aiStatus === t('agent.cameraManagement.normal') || aiStatus === '正常' || aiStatus === 'active' || aiStatus === '运行中'
}

// 辅助函数：获取AI状态文本
const getAiStatusText = (camera) => {
  const aiStatus = camera.aiStatus
  if (aiStatus === t('agent.cameraManagement.normal') || aiStatus === '正常' || aiStatus === 'active' || aiStatus === '运行中') {
    return t('agent.cameraManagement.normal')
  } else if (aiStatus === t('agent.cameraManagement.notRunning') || aiStatus === '未运行' || aiStatus === 'inactive') {
    return t('agent.cameraManagement.notRunning')
  }
  return aiStatus || '未知'
}

// 添加监控
const addCamera = () => {
  currentCameraId.value = null
  // 重置编辑表单为空内容
  editForm.value = {
    name: '',
    type: 'indoor',
    url: '',
    status: true,
    aiStatus: true,
    contacts: [
      { name: '', phone: '' }
    ],
    notifications: {
      sms: false,
      call: false,
      wechat: false
    },
    autoEmergencyCall: false
  }
  isEditModalOpen.value = true
}

// 编辑监控
const editCamera = async (cameraId) => {
  try {
    loading.value = true
    console.log('点击编辑按钮，相机ID:', cameraId)
    
    // 从本地数组中获取信息
    const camera = cameras.value.find(c => c.id === cameraId)
    if (camera) {
      console.log('找到相机:', camera)
      currentCameraId.value = cameraId
      
      // 直接使用本地数据填充编辑表单
      editForm.value = {
        name: camera.name,
        type: (camera.monitoringRange || camera.range) === 'indoor' || (camera.monitoringRange || camera.range) === t('agent.cameraManagement.indoor') ? 'indoor' : (camera.monitoringRange || camera.range) === 'outdoor' || (camera.monitoringRange || camera.range) === t('agent.cameraManagement.outdoor') ? 'outdoor' : 'indoor',
        url: camera.url || '',
        status: camera.status === '在线' || camera.status === t('agent.cameraManagement.online'),
        aiStatus: camera.aiStatus === '正常' || camera.aiStatus === t('agent.cameraManagement.normal') || camera.aiStatus === 'active',
        contacts: camera.contacts && camera.contacts.length > 0 ? [...camera.contacts] : [{ name: '', phone: '' }],
        notifications: camera.notifications ? { ...camera.notifications } : { sms: false, call: false, wechat: false },
        autoEmergencyCall: camera.autoEmergencyCall || false
      }
      
      console.log('编辑表单填充完成:', editForm.value)
      isEditModalOpen.value = true
      console.log('编辑模态框已打开:', isEditModalOpen.value)
    } else {
      console.log('未找到相机:', cameraId)
      showAlert('未找到监控设备信息')
    }
  } catch (error) {
    console.error('编辑监控失败:', error)
    showAlert('编辑监控失败，请重试')
  } finally {
    loading.value = false
  }
}

// 关闭编辑模态框
const closeEditModal = () => {
  isEditModalOpen.value = false
  currentCameraId.value = null
}

// 更新设备类型
const updateDeviceType = async () => {
  if (!currentCameraId.value) return
  
  try {
    loading.value = true
    
    // 准备请求数据，同时发送两个字段以兼容后端
    const requestData = {
      monitoringRange: editForm.value.type === 'indoor' ? t('agent.cameraManagement.indoor') : t('agent.cameraManagement.outdoor'),
      range: editForm.value.type === 'indoor' ? t('agent.cameraManagement.indoor') : t('agent.cameraManagement.outdoor')
    }
    
    // 调用更新监控接口
    const data = await apiService.put(`/user/monitorings/${currentCameraId.value}`, requestData)
    
    if (data.code === 200) {
      console.log('设备类型更新成功:', data)
      // 强制刷新数据，确保用户看到最新状态
      await fetchCameras()
    } else {
      console.error('设备类型更新失败:', data.message)
      showAlert('设备类型更新失败，请重试')
    }
  } catch (error) {
    console.error('设备类型更新失败:', error)
    showAlert('设备类型更新失败，请重试')
  } finally {
    loading.value = false
  }
}

// 更新监控状态
const updateCameraStatus = async () => {
  if (!currentCameraId.value) return
  
  try {
    loading.value = true
    
    // 准备请求数据，将布尔值转换为online/offline
    const requestData = {
      status: editForm.value.status ? 'online' : 'offline'
    }
    
    // 调用电源状态切换接口
    const data = await apiService.put(`/user/monitorings/${currentCameraId.value}/power`, requestData)
    
    if (data.code === 200) {
      console.log('监控状态更新成功:', data)
      // 强制刷新数据，确保用户看到最新状态
      await fetchCameras()
    } else {
      console.error('监控状态更新失败:', data.message)
      showAlert('监控状态更新失败，请重试')
    }
  } catch (error) {
    console.error('监控状态更新失败:', error)
    showAlert('监控状态更新失败，请重试')
  } finally {
    loading.value = false
  }
}

// 保存监控设置
const saveCameraSettings = async () => {
  // 验证表单信息
  if (!editForm.value.name || !editForm.value.url) {
    showAlert('请填写监控名称和URL地址')
    return
  }
  
  try {
    loading.value = true
    
    // 准备请求数据，同时发送两个字段以兼容后端
    const requestData = {
      name: editForm.value.name,
      url: editForm.value.url,
      monitoringRange: editForm.value.type === 'indoor' ? t('agent.cameraManagement.indoor') : t('agent.cameraManagement.outdoor'),
      range: editForm.value.type === 'indoor' ? t('agent.cameraManagement.indoor') : t('agent.cameraManagement.outdoor')
    }
    
    let data
    let cameraId
    if (currentCameraId.value) {
      // 编辑现有监控
      data = await apiService.put(`/user/monitorings/${currentCameraId.value}`, requestData)
      cameraId = currentCameraId.value
    } else {
      // 添加新监控
      data = await apiService.post('/user/monitorings', requestData)
      cameraId = data.data && data.data.id ? data.data.id : null
    }
    
    if (data.code === 200 && cameraId) {
      // 准备紧急联系人数据
      const contactData = {}
      // 先填充剩余的联系人数据
      editForm.value.contacts.forEach((contact, index) => {
        if (index < 5) {
          if (contact.name && contact.phone) {
            contactData[`contact${index + 1}`] = {
              name: contact.name,
              phone: contact.phone
            }
          } else {
            // 为空的联系人设置空对象
            contactData[`contact${index + 1}`] = {}
          }
        }
      })
      // 清空剩余的联系人位置（如果有）
      for (let i = editForm.value.contacts.length + 1; i <= 5; i++) {
        contactData[`contact${i}`] = {}
      }
      
      // 无论是否有紧急联系人数据，都调用紧急联系人接口
      // 这样可以确保删除所有联系人时也能正确更新后端
      try {
        const contactResponse = await apiService.post(`/user/monitorings/${cameraId}/emergency-contacts`, contactData)
        console.log('紧急联系人设置响应:', contactResponse)
        if (contactResponse.code !== 200) {
          console.error('紧急联系人设置失败:', contactResponse.message)
          showAlert(`${t('agent.cameraManagement.monitoring')} "${editForm.value.name}" ${currentCameraId.value ? t('agent.cameraManagement.updatedSuccess') : t('agent.cameraManagement.addedSuccess')}, ${t('agent.cameraManagement.butEmergencyContactsFailed')}`)
        } else {
          showAlert(`${t('agent.cameraManagement.monitoring')} "${editForm.value.name}" ${currentCameraId.value ? t('agent.cameraManagement.updatedSuccess') : t('agent.cameraManagement.addedSuccess')}`)
        }
      } catch (contactError) {
        console.error('紧急联系人设置失败:', contactError)
        showAlert(`${t('agent.cameraManagement.monitoring')} "${editForm.value.name}" ${currentCameraId.value ? t('agent.cameraManagement.updatedSuccess') : t('agent.cameraManagement.addedSuccess')}, ${t('agent.cameraManagement.butEmergencyContactsFailed')}`)
      }
      
      closeEditModal()
      // 强制刷新数据，确保用户看到最新状态
      await fetchCameras()
    } else {
      showAlert(`${currentCameraId.value ? '更新' : '添加'}监控失败：` + data.message)
    }
  } catch (error) {
    console.error('保存监控设置失败:', error)
    showAlert('保存监控设置失败，请重试')
  } finally {
    loading.value = false
  }
}

// 查看监控
const viewCamera = async (cameraId) => {
  try {
    loading.value = true
    console.log('点击查看按钮，相机ID:', cameraId)
    
    // 从本地数组中获取信息
    const camera = cameras.value.find(c => c.id === cameraId)
    if (camera) {
      console.log('找到相机:', camera)
      
      // 直接使用本地数据填充查看表单
      viewForm.value = {
        name: camera.name,
        type: (camera.monitoringRange || camera.range) === 'indoor' || (camera.monitoringRange || camera.range) === t('agent.cameraManagement.indoor') ? 'indoor' : (camera.monitoringRange || camera.range) === 'outdoor' || (camera.monitoringRange || camera.range) === t('agent.cameraManagement.outdoor') ? 'outdoor' : 'indoor',
        monitorId: camera.id,
        url: camera.url || '',
        status: camera.status === '在线' || camera.status === t('agent.cameraManagement.online'),
        aiStatus: camera.aiStatus === '正常' || camera.aiStatus === t('agent.cameraManagement.normal') || camera.aiStatus === 'active',
        contacts: camera.contacts && camera.contacts.length > 0 ? [...camera.contacts] : [],
        notifications: camera.notifications ? { ...camera.notifications } : { sms: false, call: false, wechat: false },
        autoEmergencyCall: camera.autoEmergencyCall || false
      }
      
      console.log('查看表单填充完成:', viewForm.value)
      isViewModalOpen.value = true
      console.log('查看模态框已打开:', isViewModalOpen.value)
    } else {
      console.log('未找到相机:', cameraId)
      showAlert('未找到监控设备信息')
    }
  } catch (error) {
    console.error('查看监控失败:', error)
    showAlert('查看监控失败，请重试')
  } finally {
    loading.value = false
  }
}

// 关闭查看模态框
const closeViewModal = () => {
  isViewModalOpen.value = false
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

// 显示确认弹窗
const showConfirm = (message, callback) => {
  confirmMessage.value = message
  confirmCallback.value = callback
  isConfirmModalOpen.value = true
}

// 关闭确认弹窗
const closeConfirmModal = () => {
  isConfirmModalOpen.value = false
  confirmCallback.value = null
}

// 处理确认回调
const handleConfirm = (confirmed) => {
  if (confirmCallback.value) {
    confirmCallback.value(confirmed)
  }
  closeConfirmModal()
}

// 添加联系人
const addContact = () => {
  if (editForm.value.contacts.length < 5) {
    editForm.value.contacts.push({ name: '', phone: '' })
  }
}

// 删除联系人
const removeContact = (index) => {
  if (editForm.value.contacts.length > 1) {
    editForm.value.contacts.splice(index, 1)
  }
}

// 删除监控
const deleteCamera = async (cameraId) => {
  const camera = cameras.value.find(c => c.id === cameraId)
  if (camera) {
    showConfirm(`确定要删除监控 "${camera.name}" 吗？`, async (confirmed) => {
      if (confirmed) {
        try {
          loading.value = true
          const data = await apiService.delete(`/user/monitorings/${cameraId}`)
          if (data.code === 200) {
            showAlert(`${t('agent.cameraManagement.monitoring')} "${camera.name}" ${t('agent.cameraManagement.deletedSuccess')}`)
            fetchCameras()
          } else {
            showAlert('删除监控失败：' + data.message)
          }
        } catch (error) {
          console.error('删除监控失败:', error)
          showAlert('删除监控失败，请重试')
        } finally {
          loading.value = false
        }
      }
    })
  }
}

// 切换监控状态
const toggleCameraStatus = async (cameraId) => {
  const camera = cameras.value.find(c => c.id === cameraId)
  if (camera) {
    try {
      loading.value = true
      // 调用API接口切换监控状态
      const targetStatus = isCameraOnline(camera) ? 'offline' : 'online'
      const data = await apiService.put(`/user/monitorings/${cameraId}/power`, {
        status: targetStatus
      })
      
      if (data.code === 200) {
        // 更新本地状态
        const newStatus = targetStatus === 'online' ? t('agent.cameraManagement.online') : t('agent.cameraManagement.offline')
        camera.status = newStatus
        camera.aiStatus = targetStatus === 'online' ? t('agent.cameraManagement.normal') : t('agent.cameraManagement.notRunning')
        showAlert(`${camera.name} ${t('agent.cameraManagement.statusSwitchedTo' + (targetStatus === 'online' ? 'Online' : 'Offline'))}`)
      } else {
        showAlert('切换监控状态失败：' + data.message)
      }
    } catch (error) {
      console.error('切换监控状态失败:', error)
      showAlert('切换监控状态失败，请重试')
    } finally {
      loading.value = false
    }
  }
}

// 批量启用监控
const batchEnable = async () => {
  if (selectedCameras.value.length > 0) {
    try {
      loading.value = true
      // 逐个调用API接口启用监控
      let successCount = 0
      for (const cameraId of selectedCameras.value) {
        try {
          await apiService.put(`/user/monitorings/${cameraId}/power`, {
            status: 'online'
          })
          // 更新本地状态
          const camera = cameras.value.find(c => c.id === cameraId)
          if (camera) {
            camera.status = t('agent.cameraManagement.online')
            camera.aiStatus = t('agent.cameraManagement.normal')
            successCount++
          }
        } catch (error) {
          console.error(`启用监控 ${cameraId} 失败:`, error)
        }
      }
      showAlert(`${t('agent.cameraManagement.batchEnableSuccess')} ${successCount} ${t('agent.cameraManagement.devices')}`)
      // 清空选择
      selectedCameras.value = []
      selectAll.value = false
    } catch (error) {
      console.error('批量启用监控失败:', error)
      showAlert('批量启用监控失败，请重试')
    } finally {
      loading.value = false
    }
  } else {
    showAlert(t('agent.cameraManagement.selectEnableDevices'))
  }
}

// 批量禁用监控
const batchDisable = async () => {
  if (selectedCameras.value.length > 0) {
    try {
      loading.value = true
      // 逐个调用API接口禁用监控
      let successCount = 0
      for (const cameraId of selectedCameras.value) {
        try {
          await apiService.put(`/user/monitorings/${cameraId}/power`, {
            status: 'offline'
          })
          // 更新本地状态
          const camera = cameras.value.find(c => c.id === cameraId)
          if (camera) {
            camera.status = t('agent.cameraManagement.offline')
            camera.aiStatus = t('agent.cameraManagement.notRunning')
            successCount++
          }
        } catch (error) {
          console.error(`禁用监控 ${cameraId} 失败:`, error)
        }
      }
      showAlert(`${t('agent.cameraManagement.batchDisableSuccess')} ${successCount} ${t('agent.cameraManagement.devices')}`)
      // 清空选择
      selectedCameras.value = []
      selectAll.value = false
    } catch (error) {
      console.error('批量禁用监控失败:', error)
      showAlert('批量禁用监控失败，请重试')
    } finally {
      loading.value = false
    }
  } else {
    showAlert(t('agent.cameraManagement.selectDisableDevices'))
  }
}

// 批量删除监控
const batchDelete = async () => {
  if (selectedCameras.value.length > 0) {
    showConfirm(`${t('agent.cameraManagement.confirmBatchDelete')} ${selectedCameras.value.length} ${t('agent.cameraManagement.devices')}`, async (confirmed) => {
      if (confirmed) {
        try {
          loading.value = true
          // 逐个删除监控
          for (const cameraId of selectedCameras.value) {
            await apiService.delete(`/user/monitorings/${cameraId}`)
          }
          showAlert(`${t('agent.cameraManagement.batchDeleteSuccess')} ${selectedCameras.value.length} ${t('agent.cameraManagement.devices')}`)
          // 重新获取监控列表
          fetchCameras()
          // 清空选择
          selectedCameras.value = []
          selectAll.value = false
        } catch (error) {
          console.error('批量删除监控失败:', error)
          showAlert('批量删除监控失败，请重试')
        } finally {
          loading.value = false
        }
      }
    })
  } else {
    showAlert(t('agent.cameraManagement.selectDeleteDevices'))
  }
}
</script>

<style scoped>
.camera-management {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.management-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px;
  width: 100%;
}

.management-header h1 {
  font-size: 28px;
  color: #1E88E5;
  margin: 0;
}

.management-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding: 0 20px 20px;
}

.search-filter-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.search-box {
  display: flex;
  gap: 10px;
  flex: 1;
  min-width: 300px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #1E88E5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.search-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #1E88E5;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #1976D2;
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #1E88E5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.camera-list-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.camera-table {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.camera-table table {
  width: 100%;
  border-collapse: collapse;
}

.camera-table th,
.camera-table td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.camera-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.camera-table td {
  font-size: 14px;
  color: #666;
  vertical-align: middle;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-indicator.online {
  background-color: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
}

.status-indicator.offline {
  background-color: #F44336;
}

.status-text {
  font-size: 14px;
  color: #666;
}

.ai-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.ai-status.active {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.ai-status.inactive {
  background-color: #FFEBEE;
  color: #F44336;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-btn {
  border-color: #FFC107;
  color: #FF9800;
}

.edit-btn:hover {
  background-color: #FFC107;
  color: white;
}

.view-btn {
  border-color: #1E88E5;
  color: #1E88E5;
}

.view-btn:hover {
  background-color: #1E88E5;
  color: white;
}

.delete-btn {
  border-color: #F44336;
  color: #F44336;
}

.delete-btn:hover {
  background-color: #F44336;
  color: white;
}

.toggle-btn {
  border-color: #4CAF50;
  color: #4CAF50;
}

.toggle-btn:hover {
  background-color: #4CAF50;
  color: white;
}

.toggle-btn.toggle-on {
  border-color: #F44336;
  color: #F44336;
}

.toggle-btn.toggle-on:hover {
  background-color: #F44336;
  color: white;
}

.empty-state {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

/* 加载状态样式 */
.loading-overlay {
  position: relative;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 60px 20px;
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1E88E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.batch-actions {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.batch-actions h2 {
  font-size: 16px;
  color: #333;
  margin: 0 0 15px 0;
}

.batch-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.batch-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.batch-btn:hover {
  background-color: #f8f9fa;
  border-color: #1E88E5;
  color: #1E88E5;
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

/* 模态框样式 */
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

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1E88E5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.form-select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #1E88E5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.contact-item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 32px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 32px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: white;
  font-weight: 600;
}

.toggle-switch input:not(:checked) + label {
  justify-content: flex-end;
  padding-right: 12px;
}

.toggle-switch input:checked + label {
  background-color: #1E88E5;
  justify-content: flex-start;
  padding-left: 12px;
}

.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 3px;
  top: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + label:before {
  transform: translateX(48px);
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

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  margin-bottom: 0;
}

/* 查看模态框样式 */
.info-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.info-label {
  width: 100px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.status-badge.inactive {
  background-color: #FFEBEE;
  color: #F44336;
}

.contact-info-item {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.contact-index {
  width: 80px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.contact-detail {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.btn-primary:hover {
  background-color: #1976D2;
}

@media (max-width: 768px) {
  .search-filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-options {
    flex-direction: column;
  }
  
  .filter-select {
    flex: 1;
  }
  
  .camera-table {
    overflow-x: auto;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
}

/* 弹窗样式 */
.alert-modal, .confirm-modal {
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

.confirm-message {
  font-size: 16px;
  color: #333;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  padding: 20px 0;
}
</style>