<template>
  <div class="admin-container">
    <!-- 导航栏 -->
    <AdminNavbar />
    
    <div class="admin-content">
      <!-- 页面头部 -->
      <div class="admin-card">
        <div class="flex justify-between items-center">
          <h1 class="admin-page-title">{{ $t('admin.users.title') }}</h1>
          <button class="admin-btn admin-btn-primary" @click="openAddUserModal">
            <span class="btn-icon">➕</span>
            <span>{{ $t('admin.users.addUser') }}</span>
          </button>
        </div>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="admin-card">
        <div class="admin-action-bar">
          <div class="admin-search-box">
            <input 
              type="text" 
              v-model="searchQuery"
              :placeholder="$t('admin.users.searchPlaceholder')"
            >
            <button class="admin-btn admin-btn-primary" @click="searchUsers">{{ $t('admin.users.search') }}</button>
          </div>
          <div class="flex gap-4">
            <select v-model="statusFilter" class="select">
              <option value="all">{{ $t('admin.users.allStatus') }}</option>
              <option value="normal">{{ $t('admin.users.normal') }}</option>
              <option value="disabled">{{ $t('admin.users.disabled') }}</option>
            </select>
            <select v-model="planFilter" class="select">
              <option value="all">{{ $t('admin.users.allPlans') }}</option>
              <option v-for="plan in availablePlans" :key="plan" :value="plan">
                {{ plan }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div class="admin-card">
        <h2 style="font-size: 20px; margin-bottom: 20px; color: var(--admin-text); font-weight: 600;">{{ $t('admin.users.userList') }}</h2>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="admin-loading-container">
          <div class="admin-loading-spinner"></div>
          <p>{{ $t('common.loading') }}</p>
        </div>
        
        <!-- 数据为空状态 -->
        <div v-else-if="filteredUsers.length === 0" class="admin-empty-state">
          <div class="admin-empty-state-icon">👥</div>
          <div class="admin-empty-state-title">{{ $t('common.noData') }}</div>
          <div class="admin-empty-state-desc">{{ $t('common.noUserData') }}</div>
          <button class="admin-btn admin-btn-primary" @click="fetchUsers">{{ $t('common.refresh') }}</button>
        </div>
        
        <!-- 表格容器 -->
        <div class="admin-table-container" v-else>
          <!-- 表格 -->
          <table class="admin-table">
          <thead>
            <tr>
              <th>{{ $t('admin.users.id') }}</th>
              <th>{{ $t('admin.users.username') }}</th>
              <th>{{ $t('admin.users.phone') }}</th>
              <th>{{ $t('admin.users.email') }}</th>
              <th>{{ $t('admin.users.plan') }}</th>
              <th>{{ $t('admin.users.expireDate') }}</th>
              <th>{{ $t('admin.users.status') }}</th>
              <th>{{ $t('admin.users.registerTime') }}</th>
              <th>{{ $t('admin.users.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="admin-status-badge" :class="user.plan">
                  {{ user.plan }}
                </span>
              </td>
              <td>{{ user.plan === '未订阅' || user.plan === 'none' || user.plan === '无套餐' || user.plan === '' || user.plan === null ? $t('admin.users.notActivated') : formatDate(user.expireDate) }}</td>
              <td>
                <span class="admin-status-badge" :class="user.status === 'normal' ? 'admin-status-active' : 'admin-status-inactive'">
                  {{ user.status === 'normal' ? $t('admin.users.normal') : $t('admin.users.disabled') }}
                </span>
              </td>
              <td>{{ user.registerTime }}</td>
              <td>
                <div class="flex gap-2">
                  <button class="admin-btn admin-btn-primary" @click="handleViewUser(user.id)">{{ $t('admin.users.view') }}</button>
                  <button class="admin-btn admin-btn-secondary" @click="handleEditUser(user.id)">{{ $t('admin.users.edit') }}</button>
                  <button class="admin-btn" :class="user.status === 'normal' ? 'admin-btn-warning' : 'admin-btn-success'" @click="handleToggleUserStatus(user.id)">
                    {{ user.status === 'normal' ? $t('admin.users.block') : $t('admin.users.unblock') }}
                  </button>
                  <button class="admin-btn admin-btn-danger" @click="handleDeleteUser(user.id)">{{ $t('admin.users.delete') }}</button>
                </div>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="admin-pagination" v-if="filteredUsers.length > 0">
        <button class="admin-page-btn" :disabled="currentPage === 1" @click="currentPage--">{{ $t('admin.users.previousPage') }}</button>
        <span class="admin-page-info">{{ $t('admin.users.pageInfo', { page: currentPage, total: totalPages }) }}</span>
        <button class="admin-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">{{ $t('admin.users.nextPage') }}</button>
      </div>
    </div>

    <!-- 添加用户弹窗 -->
    <div v-if="isAddUserModalOpen" class="admin-modal-overlay" @click="closeAddUserModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">{{ $t('admin.users.addUserModal') }}</h3>
          <button class="admin-modal-close" @click="closeAddUserModal">×</button>
        </div>
        <div class="admin-modal-body">
          <div class="admin-form">
            <div class="admin-form-group">
              <label for="add-username">{{ $t('admin.users.username') }}</label>
              <input 
                type="text" 
                id="add-username" 
                v-model="addUserForm.username"
                :placeholder="$t('admin.users.enterUsername')"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="add-phone">{{ $t('admin.users.phone') }}</label>
              <input 
                type="tel" 
                id="add-phone" 
                v-model="addUserForm.phone"
                :placeholder="$t('admin.users.enterPhone')"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="add-email">{{ $t('admin.users.email') }}</label>
              <input 
                type="email" 
                id="add-email" 
                v-model="addUserForm.email"
                :placeholder="$t('admin.users.enterEmail')"
              >
            </div>
            <div class="admin-form-group">
              <label for="add-password">{{ $t('admin.users.enterPassword') }}</label>
              <input 
                type="password" 
                id="add-password" 
                v-model="addUserForm.password"
                :placeholder="$t('admin.users.enterPassword')"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="add-plan">{{ $t('admin.users.planType') }}</label>
              <select 
                id="add-plan" 
                v-model="addUserForm.plan"
                class="select"
                required
              >
                <option v-for="plan in plans" :key="plan.id" :value="plan.name">
                  {{ plan.name }}
                </option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="add-expire">{{ $t('admin.users.expireDate') }}</label>
              <input 
                type="date" 
                id="add-expire" 
                v-model="addUserForm.expireDate"
                required
              >
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-secondary" @click="closeAddUserModal">{{ $t('admin.users.cancel') }}</button>
          <button class="admin-btn admin-btn-primary" @click="saveUser">{{ $t('admin.users.save') }}</button>
        </div>
      </div>
    </div>

    <!-- 查看用户详情弹窗 -->
    <div v-if="isViewUserModalOpen" class="admin-modal-overlay" @click="closeViewUserModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">{{ $t('admin.users.viewUserModal') }}</h3>
          <button class="admin-modal-close" @click="closeViewUserModal">×</button>
        </div>
        <div class="admin-modal-body">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.username') }}:</span>
              <span>{{ viewUserForm.username }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.phone') }}:</span>
              <span>{{ viewUserForm.phone }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.email') }}:</span>
              <span>{{ viewUserForm.email || $t('admin.users.notSet') }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.enterPassword') }}:</span>
              <span>{{ viewUserForm.password || '' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.planType') }}:</span>
              <span>{{ viewUserForm.plan }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.expireDate') }}:</span>
              <span>{{ formatTime(viewUserForm.expireDate) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.lastLoginTime') }}:</span>
              <span>{{ formatTime(viewUserForm.lastLogin) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.registerTime') }}:</span>
              <span>{{ formatTime(viewUserForm.registerTime) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.accountStatus') }}:</span>
              <span>{{ viewUserForm.status === 'normal' ? $t('admin.users.normal') : $t('admin.users.disabled') }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.totalMonitors') }}:</span>
              <span>{{ viewUserForm.maxMonitors }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ $t('admin.users.addedMonitors') }}:</span>
              <span>{{ viewUserForm.monitorCount }}</span>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-primary" @click="closeViewUserModal">{{ $t('admin.users.close') }}</button>
        </div>
      </div>
    </div>

    <!-- 编辑用户弹窗 -->
    <div v-if="isEditUserModalOpen" class="admin-modal-overlay" @click="closeEditUserModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">{{ $t('admin.users.editUserModal') }}</h3>
          <button class="admin-modal-close" @click="closeEditUserModal">×</button>
        </div>
        <div class="admin-modal-body">
          <div class="admin-form">
            <div class="admin-form-group">
              <label for="edit-username">{{ $t('admin.users.username') }}</label>
              <input 
                type="text" 
                id="edit-username" 
                v-model="editUserForm.username"
                :placeholder="$t('admin.users.enterUsername')"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-phone">{{ $t('admin.users.phone') }}</label>
              <input 
                type="tel" 
                id="edit-phone" 
                v-model="editUserForm.phone"
                :placeholder="$t('admin.users.enterPhone')"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-email">{{ $t('admin.users.email') }}</label>
              <input 
                type="email" 
                id="edit-email" 
                v-model="editUserForm.email"
                :placeholder="$t('admin.users.enterEmail')"
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-password">{{ $t('admin.users.enterPassword') }}</label>
              <input 
                type="password" 
                id="edit-password" 
                v-model="editUserForm.password"
                :placeholder="$t('admin.users.enterPasswordOptional')"
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-plan">{{ $t('admin.users.planType') }}</label>
              <select 
                id="edit-plan" 
                v-model="editUserForm.plan"
                class="select"
                required
              >
                <option value="未订阅">{{ $t('admin.users.notSubscribed') }}</option>
                <option v-for="plan in plans" :key="plan.id" :value="plan.name">
                  {{ plan.name }}
                </option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="edit-expire">{{ $t('admin.users.expireDate') }}</label>
              <input 
                type="date" 
                id="edit-expire" 
                v-model="editUserForm.expireDate"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-status">{{ $t('admin.users.accountStatus') }}</label>
              <select 
                id="edit-status" 
                v-model="editUserForm.status"
                class="select"
                required
              >
                <option value="normal">{{ $t('admin.users.normal') }}</option>
                <option value="disabled">{{ $t('admin.users.disabled') }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-secondary" @click="closeEditUserModal">{{ $t('admin.users.cancel') }}</button>
          <button class="admin-btn admin-btn-primary" @click="updateUser">{{ $t('admin.users.save') }}</button>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div v-if="isConfirmModalOpen" class="admin-modal-overlay" @click="closeConfirmModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">{{ $t('admin.users.confirmModal') }}</h3>
          <button class="admin-modal-close" @click="closeConfirmModal">×</button>
        </div>
        <div class="admin-modal-body">
          <p>{{ confirmMessage }}</p>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-secondary" @click="handleConfirm(false)">{{ $t('admin.users.cancel') }}</button>
          <button class="admin-btn admin-btn-primary" @click="handleConfirm(true)">{{ $t('admin.users.confirm') }}</button>
        </div>
      </div>
    </div>

    <!-- 消息提示侧边栏 -->
    <div v-if="isMessageModalOpen" class="admin-toast" @click="closeMessageModal">
      <div class="admin-toast-content">
        <div class="admin-toast-header">
          <h3 class="admin-toast-title">{{ $t('admin.users.alertModal') }}</h3>
          <button class="admin-toast-close" @click.stop="closeMessageModal">×</button>
        </div>
        <div class="admin-toast-body">
          <p>{{ messageText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminNavbar from '../../components/AdminNavbar.vue'
import apiService from '../../services/api.js'
import { debounce } from '../../utils/debounce-throttle.js'

const { t, locale } = useI18n()

// 监听语言变化，刷新数据
watch(locale, () => {
  fetchUsers()
  fetchPlans()
})

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('all')
const planFilter = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 用户数据
const users = ref([])
const isLoading = ref(false)

// 弹窗状态
const isAddUserModalOpen = ref(false)
const isViewUserModalOpen = ref(false)
const isEditUserModalOpen = ref(false)
const isConfirmModalOpen = ref(false)
const isMessageModalOpen = ref(false)

// 套餐列表
const plans = ref([])

// 计算属性：获取表格中已有的唯一套餐列表
const availablePlans = computed(() => {
  const planSet = new Set()
  originalUsers.value.forEach(user => {
    if (user.plan) {
      planSet.add(user.plan)
    }
  })
  return Array.from(planSet)
})

// 计算属性：过滤后的用户列表
const filteredUsers = computed(() => {
  return originalUsers.value.filter(user => {
    // 搜索过滤：支持搜索手机号、邮箱、用户名
    const searchMatch = !searchQuery.value || 
      (user.username && user.username.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (user.phone && user.phone.includes(searchQuery.value)) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    // 状态过滤
    const statusMatch = statusFilter.value === 'all' || user.status === statusFilter.value
    
    // 套餐过滤
    const planMatch = planFilter.value === 'all' || user.plan === planFilter.value
    
    return searchMatch && statusMatch && planMatch
  })
})

// 计算属性：分页后显示的用户列表
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredUsers.value.slice(startIndex, endIndex)
})

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / pageSize.value)
})

// 表单数据
const addUserForm = ref({
  username: '',
  phone: '',
  email: '',
  password: '',
  plan: 'basic',
  expireDate: ''
})

const viewUserForm = ref({
  username: '',
  phone: '',
  email: '',
  password: '',
  status: 'normal',
  plan: 'basic',
  expireDate: '',
  lastLogin: '',
  registerTime: '',
  monitorCount: 0,
  maxMonitors: 3
})

const editUserForm = ref({
  id: '',
  username: '',
  phone: '',
  email: '',
  password: '',
  plan: 'basic',
  expireDate: '',
  status: 'normal'
})

// 确认弹窗和消息弹窗
const confirmMessage = ref('')
const messageText = ref('')
const confirmCallback = ref(null)

// API 调用使用 apiService

// 原始用户数据（未过滤的）
const originalUsers = ref([])

// 获取用户列表
const fetchUsers = async () => {
  isLoading.value = true
  try {
    // 获取足够多的用户数据用于客户端过滤
    const params = {
      page: 1,
      size: 1000, // 获取1000条数据，足够用于客户端过滤
      search: '', // 不使用服务端搜索，由客户端处理
      status: '', // 不使用服务端状态过滤，由客户端处理
      plan: '' // 不使用服务端套餐过滤，由客户端处理
    }
    
    const data = await apiService.get('/admin/users', { params })
    
    if (data.code === 200) {
      originalUsers.value = data.data.records
    } else {
      showMessage(t('admin.users.fetchUserDetailsFailed'))
    }
  } catch (error) {
    showMessage(t('admin.users.networkError'))
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

// 打开添加用户弹窗
const openAddUserModal = () => {
  // 重置表单
  addUserForm.value = {
    username: '',
    phone: '',
    email: '',
    password: '',
    plan: plans.value.length > 0 ? plans.value[0].name : '',
    expireDate: new Date().toISOString().split('T')[0]
  }
  isAddUserModalOpen.value = true
}

// 关闭添加用户弹窗
const closeAddUserModal = () => {
  isAddUserModalOpen.value = false
}

// 保存用户
const saveUser = async () => {
  // 表单验证
  if (!addUserForm.value.username || !addUserForm.value.phone || !addUserForm.value.password || !addUserForm.value.expireDate) {
    showMessage(t('admin.users.fillRequiredFields'))
    return
  }

  isLoading.value = true
  try {
    const data = await apiService.post('/admin/users', {
      username: addUserForm.value.username,
      phone: addUserForm.value.phone,
      email: addUserForm.value.email,
      password: addUserForm.value.password,
      plan: addUserForm.value.plan,
      expireDate: addUserForm.value.expireDate
    })

    if (data.code === 200) {
      showMessage(t('admin.users.userAddedSuccess'))
      closeAddUserModal()
      await fetchUsers()
    } else {
      showMessage(data.message || t('admin.users.addUserFailed'))
    }
  } catch (error) {
    showMessage(t('admin.users.networkError'))
    console.error('Error adding user:', error)
  } finally {
    isLoading.value = false
  }
}

// 打开查看用户详情弹窗
const openViewUserModal = async (userId) => {
  isLoading.value = true
  try {
    const data = await apiService.get(`/admin/users/${userId}`)
    
    if (data.code === 200) {
      const user = data.data
      console.log('API返回的用户数据:', user)
      console.log('API返回的密码字段:', user.password)
      viewUserForm.value = {
        username: user.username,
        phone: user.phone,
        email: user.email,
        password: user.password || '',
        status: user.status,
        plan: user.plan,
        expireDate: user.expireDate,
        lastLogin: user.lastLogin || '-',
        registerTime: user.registerTime,
        monitorCount: user.monitorCount,
        maxMonitors: user.maxMonitors
      }
      console.log('设置后的viewUserForm:', viewUserForm.value)
      isViewUserModalOpen.value = true
    } else {
      showMessage(t('admin.users.fetchUserDetailsFailed'))
    }
  } catch (error) {
    showMessage(t('admin.users.networkError'))
    console.error('Error fetching user details:', error)
  } finally {
    isLoading.value = false
  }
}

// 关闭查看用户详情弹窗
const closeViewUserModal = () => {
  isViewUserModalOpen.value = false
}

// 打开编辑用户弹窗
const openEditUserModal = async (userId) => {
  isLoading.value = true
  try {
    const data = await apiService.get(`/admin/users/${userId}`)
    
    if (data.code === 200) {
      const user = data.data
      
      // 从套餐列表中查找对应的中文名称
      let planName = user.plan
      const plan = plans.value.find(p => p.type === user.plan)
      if (plan) {
        planName = plan.name
      }
      
      editUserForm.value = {
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        password: '',
        plan: planName,
        expireDate: user.expireDate,
        status: user.status
      }
      isEditUserModalOpen.value = true
    } else {
      showMessage(t('admin.users.fetchUserDetailsFailed'))
    }
  } catch (error) {
    showMessage(t('admin.users.networkError'))
    console.error('Error fetching user details:', error)
  } finally {
    isLoading.value = false
  }
}

// 关闭编辑用户弹窗
const closeEditUserModal = () => {
  isEditUserModalOpen.value = false
}

// 更新用户
const updateUser = async () => {
  // 表单验证
  if (!editUserForm.value.username || !editUserForm.value.phone || !editUserForm.value.expireDate) {
    showMessage(t('admin.users.fillRequiredFields'))
    return
  }

  isLoading.value = true
  try {
    // 构建请求数据
    const requestData = {
      username: editUserForm.value.username,
      phone: editUserForm.value.phone,
      email: editUserForm.value.email,
      password: editUserForm.value.password || undefined,
      plan: editUserForm.value.plan,
      expireDate: editUserForm.value.expireDate,
      status: editUserForm.value.status
    }
    
    // 如果选择的是未订阅套餐，设置监控最大数量为0
    if (editUserForm.value.plan === '未订阅') {
      requestData.maxMonitors = 0
    }
    
    const data = await apiService.put(`/admin/users/${editUserForm.value.id}`, requestData)

    if (data.code === 200) {
      showMessage(t('admin.users.userUpdatedSuccess'))
      closeEditUserModal()
      await fetchUsers()
    } else {
      showMessage(data.message || t('admin.users.updateUserFailed'))
    }
  } catch (error) {
    showMessage(t('admin.users.networkError'))
    console.error('Error updating user:', error)
  } finally {
    isLoading.value = false
  }
}

// 封禁/解封用户
const toggleUserStatus = async (userId) => {
  const user = originalUsers.value.find(u => u.id === userId)
  if (user) {
    const newStatus = user.status === 'normal' ? 'disabled' : 'normal'
    const actionText = newStatus === 'disabled' ? t('admin.users.block') : t('admin.users.unblock')
    const confirmKey = newStatus === 'disabled' ? 'admin.users.confirmBlockUser' : 'admin.users.confirmUnblockUser'
    const successKey = newStatus === 'disabled' ? 'admin.users.userBlockedSuccess' : 'admin.users.userUnblockedSuccess'
    const failKey = newStatus === 'disabled' ? 'admin.users.blockUserFailed' : 'admin.users.unblockUserFailed'
    
    showConfirm(t(confirmKey, { username: user.username }), async (confirmed) => {
      if (confirmed) {
        isLoading.value = true
        try {
          const data = await apiService.patch(`/admin/users/${userId}/status`, { status: newStatus })

          if (data.code === 200) {
            showMessage(t(successKey))
            await fetchUsers()
          } else {
            showMessage(data.message || t(failKey))
          }
        } catch (error) {
          showMessage(t('admin.users.networkError'))
          console.error(`Error toggling user status:`, error)
        } finally {
          isLoading.value = false
        }
      }
    })
  }
}

// 删除用户
const deleteUser = async (userId) => {
  const user = originalUsers.value.find(u => u.id === userId)
  if (user) {
    showConfirm(t('admin.users.confirmDeleteUser', { username: user.username }), async (confirmed) => {
      if (confirmed) {
        isLoading.value = true
        try {
          const data = await apiService.delete(`/admin/users/${userId}`)

          if (data.code === 200) {
            showMessage(t('admin.users.userDeletedSuccess'))
            await fetchUsers()
          } else {
            showMessage(data.message || t('admin.users.deleteUserFailed'))
          }
        } catch (error) {
          showMessage(t('admin.users.networkError'))
          console.error('Error deleting user:', error)
        } finally {
          isLoading.value = false
        }
      }
    })
  }
}

// 打开确认弹窗
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

// 处理确认操作
const handleConfirm = (confirmed) => {
  if (confirmCallback.value) {
    confirmCallback.value(confirmed)
  }
  closeConfirmModal()
}

// 格式化时间，移除ISO格式中的'T'分隔符
const formatTime = (timeString) => {
  if (!timeString || timeString === '-') return timeString
  return timeString.replace('T', ' ')
}

// 格式化日期为几几年几几月几几日的形式
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 显示消息提示
const showMessage = (message) => {
  messageText.value = message
  isMessageModalOpen.value = true
  
  // 2秒后自动关闭
  setTimeout(() => {
    closeMessageModal()
  }, 2000)
}

// 关闭消息提示
const closeMessageModal = () => {
  isMessageModalOpen.value = false
}

// 绑定按钮事件
const handleViewUser = (userId) => {
  openViewUserModal(userId)
}

const handleEditUser = (userId) => {
  openEditUserModal(userId)
}

const handleToggleUserStatus = (userId) => {
  toggleUserStatus(userId)
}

const handleDeleteUser = (userId) => {
  deleteUser(userId)
}

// 搜索用户
const searchUsers = debounce(() => {
  currentPage.value = 1
  fetchUsers()
}, 300)

// 监听筛选条件变化
watch([statusFilter, planFilter], () => {
  currentPage.value = 1
  // 筛选条件变化时，不需要重新加载数据，只需要重新计算filteredUsers
  // 因为filteredUsers是基于originalUsers计算的
})

// 监听页码变化
watch(currentPage, () => {
  // 页码变化时，不需要重新加载数据，只需要重新计算paginatedUsers
  // 因为paginatedUsers是基于filteredUsers计算的
})

// 获取套餐列表
const fetchPlans = async () => {
  try {
    const data = await apiService.get('/admin/plans')
    if (data.code === 200) {
      plans.value = data.data
    }
  } catch (error) {
    console.error('获取套餐列表失败:', error)
  }
}

// 组件挂载时获取用户列表和套餐列表
onMounted(async () => {
  await fetchPlans()
  fetchUsers()
})
</script>

<style scoped>
/* 页面特定样式 */
.btn-icon {
  font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .admin-search-box {
    flex-direction: column;
    align-items: stretch;
  }
  
  .admin-search-box input {
    width: 100%;
  }
  
  .admin-table {
    overflow-x: auto;
  }
  
  .flex.gap-2 {
    flex-direction: column;
  }
  
  .admin-btn {
    width: 100%;
    justify-content: center;
  }
}

/* 表格按钮间距 */
.flex.gap-2 {
  gap: 8px;
}

/* 选择框样式 */
.select {
  padding: 12px 16px;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-border-radius);
  font-size: 14px;
  transition: var(--admin-transition);
  background-color: #f9f9f9;
  min-width: 150px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 12 12'%3E%3Cpath d='M6 9L1 4h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
}

.select:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  background-color: white;
}

/* 移动端选择框样式 */
@media (max-width: 768px) {
  .select {
    padding: 10px 14px;
    font-size: 13px;
    min-width: 120px;
  }
}

/* 空间间距 */
.space-y-4 > * {
  margin-bottom: 1rem;
}

.space-y-4 > *:last-child {
  margin-bottom: 0;
}

/* 右上方侧边栏提示样式 */
.admin-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.admin-toast-content {
  background-color: white;
  border-radius: var(--admin-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  min-width: 300px;
  overflow: hidden;
  border-left: 4px solid var(--admin-primary);
}

.admin-toast-header {
  padding: 15px 20px;
  border-bottom: 1px solid var(--admin-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
}

.admin-toast-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--admin-text);
}

.admin-toast-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--admin-text-light);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: var(--admin-transition);
}

.admin-toast-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--admin-text);
}

.admin-toast-body {
  padding: 20px;
}

.admin-toast-body p {
  margin: 0;
  font-size: 14px;
  color: var(--admin-text);
  line-height: 1.5;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 加载状态样式 */
.admin-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
}

.admin-loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(52, 152, 219, 0.2);
  border-top: 4px solid var(--admin-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.admin-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
  text-align: center;
}

.admin-empty-state-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.admin-empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--admin-text);
  margin-bottom: 8px;
}

.admin-empty-state-desc {
  font-size: 14px;
  color: var(--admin-text-light);
  margin-bottom: 24px;
}

/* 表格容器样式 */
.admin-table-container {
  overflow-x: auto;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 表格样式调整 */
.admin-table {
  width: 100%;
  min-width: 800px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .admin-toast {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .admin-toast-content {
    max-width: none;
    min-width: unset;
  }
  
  .admin-loading-container,
  .admin-empty-state {
    height: 300px;
  }
  
  .admin-table {
    min-width: 600px;
  }
}
</style>