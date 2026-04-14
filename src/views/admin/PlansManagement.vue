<template>
  <div class="admin-container">
    <!-- 导航栏 -->
    <AdminNavbar />
    
    <!-- 主要内容区域 -->
    <main class="admin-content">
      <!-- 页面标题和操作栏 -->
      <div class="admin-action-bar" style="margin-bottom: 30px;">
        <h1 class="admin-page-title" style="margin: 0;">{{ $t('adminPlans.title') }}</h1>
        <button class="admin-btn admin-btn-primary" @click="openAddPlanModal">
          <span class="btn-icon">➕</span>
          <span>{{ $t('adminPlans.addPlan') }}</span>
        </button>
      </div>

      <!-- 套餐列表 -->
      <div class="admin-card">
        <h2 style="font-size: 20px; margin-bottom: 20px; color: var(--admin-text); font-weight: 600;">{{ $t('adminPlans.planList') }}</h2>
        <div class="plans-grid">
          <div v-for="plan in plans" :key="plan.id" class="plan-card">
            <div class="plan-header">
              <h3>{{ plan.name }}</h3>
              <span class="admin-status-badge" :class="plan.status === 'active' ? 'admin-status-active' : 'admin-status-inactive'">
                {{ plan.status === 'active' ? $t('adminPlans.enable') : $t('adminPlans.disable') }}
              </span>
            </div>
            <div class="plan-details">
              <div class="plan-price">
                <template v-if="plan.discount && plan.discount > 0 && plan.originalPrice !== undefined && plan.originalPrice !== null">
                  <span class="original-price">¥{{ plan.originalPrice }}</span>
                  <span class="price">{{ plan.price }}</span>
                  <span class="period">{{ plan.period }}</span>
                  <div class="discount-info">
                    <span class="discount-label">{{ $t('adminPlans.activityDiscount') }}</span>
                    <span class="discount-value">{{ plan.discount }}折</span>
                  </div>
                  <div class="expiry-date" v-if="plan.discountPeriod">
                    {{ $t('adminPlans.endDate') }}: {{ getExpiryDate(plan.discountPeriod) }}
                  </div>
                </template>
                <template v-else>
                  <span class="price">{{ plan.price }}</span>
                  <span class="period">{{ plan.period }}</span>
                </template>
              </div>
              <ul class="plan-features">
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ $t('adminPlans.maxDevices', { count: plan.maxCameras }) }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon" :class="{ 'cross-icon': plan.hasExclusiveService !== 1 }">{{ plan.hasExclusiveService === 1 ? '✓' : '✗' }}</span>
                  <span>{{ $t('adminPlans.service24h') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ $t('adminPlans.smsPhoneAlert') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ getAiTypeName(plan.aiType) }} {{ $t('adminPlans.aiRecognition') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ $t('adminPlans.longTermAlert') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ $t('adminPlans.longTermVideo') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ $t('adminPlans.autoEmergencyCall') }}</span>
                </li>
              </ul>
              
            </div>
            <div class="plan-actions">
              <button class="admin-btn admin-btn-primary" @click="handleViewPlan(plan.id)">{{ $t('adminPlans.view') }}</button>
              <button class="admin-btn admin-btn-warning" @click="handleEditPlan(plan.id)">{{ $t('adminPlans.edit') }}</button>
              <button class="admin-btn admin-btn-danger" @click="handleDeletePlan(plan.id)">{{ $t('adminPlans.delete') }}</button>
            </div>
          </div>
        </div>
        <div v-if="plans.length === 0" class="admin-empty-state">
          <div class="admin-empty-state-icon">📋</div>
          <div class="admin-empty-state-title">{{ $t('common.noData') }}</div>
          <div class="admin-empty-state-description">{{ $t('common.noPlanData') }}</div>
        </div>
      </div>
    </main>

    <!-- 添加套餐弹窗 -->
    <div class="admin-modal-overlay" v-if="isAddPlanModalOpen" @click="closeAddPlanModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h2 class="admin-modal-title">{{ $t('adminPlans.addPlan') }}</h2>
          <button class="admin-modal-close" @click="closeAddPlanModal">×</button>
        </div>
        <div class="admin-modal-body">
          <form class="admin-form">
            <div class="admin-form-group">
              <label for="add-plan-name">{{ $t('adminPlans.enterPlanName') }}</label>
              <input 
                type="text" 
                id="add-plan-name" 
                v-model="addPlanForm.name"
                :placeholder="$t('adminPlans.enterPlanName')"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="add-plan-price">{{ $t('adminPlans.enterPrice') }}</label>
              <input 
                type="number" 
                id="add-plan-price" 
                v-model="addPlanForm.price"
                :placeholder="$t('adminPlans.enterPrice')"
                step="0.1"
                min="0"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="add-plan-discount">{{ $t('adminPlans.enterDiscount') }}</label>
              <input 
                type="number" 
                id="add-plan-discount" 
                v-model="addPlanForm.discount"
                :placeholder="$t('adminPlans.enterDiscount')"
                step="0.1"
                min="0"
                max="10"
              >
            </div>
            <div class="admin-form-group" v-if="addPlanForm.discount && addPlanForm.price">
              <label>{{ $t('adminPlans.discountPrice') }}</label>
              <div class="discount-price">
                ¥{{ (parseFloat(addPlanForm.price) * (parseFloat(addPlanForm.discount) / 10)).toFixed(2) }}
              </div>
            </div>
            <div class="admin-form-group" v-if="addPlanForm.discount && addPlanForm.discount > 0">
              <label for="add-plan-discount-days">{{ $t('adminPlans.enterActivityDays') }}</label>
              <input 
                type="number" 
                id="add-plan-discount-days" 
                v-model="addPlanForm.discountDays"
                :placeholder="$t('adminPlans.enterActivityDays')"
                min="1"
              >
            </div>
            <div class="admin-form-group">
              <label for="add-plan-cameras">{{ $t('adminPlans.enterMonitorCount') }}</label>
              <input 
                type="number" 
                id="add-plan-cameras" 
                v-model="addPlanForm.maxCameras"
                :placeholder="$t('adminPlans.enterMonitorCount')"
                min="1"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="add-plan-period-type">{{ $t('adminPlans.planDuration') }}</label>
              <select 
                id="add-plan-period-type" 
                v-model="addPlanForm.periodType"
                required
              >
                <option value="体验">{{ $t('adminPlans.trial') }}</option>
                <option value="天">{{ $t('adminPlans.day') }}</option>
                <option value="周">{{ $t('adminPlans.week') }}</option>
                <option value="月">{{ $t('adminPlans.month') }}</option>
                <option value="季">{{ $t('adminPlans.quarter') }}</option>
                <option value="年">{{ $t('adminPlans.year') }}</option>
                <option value="永久">{{ $t('adminPlans.permanent') }}</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="add-plan-ai">{{ $t('adminPlans.aiRecognition') }}</label>
              <select 
                id="add-plan-ai" 
                v-model="addPlanForm.aiType"
                required
              >
                <option value="1">{{ $t('adminPlans.none') }}</option>
                <option value="2">{{ $t('adminPlans.standard') }}</option>
                <option value="3">{{ $t('adminPlans.premium') }}</option>
                <option value="4">{{ $t('adminPlans.enterprise') }}</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="add-plan-exclusive">{{ $t('adminPlans.exclusiveService') }}</label>
              <select 
                id="add-plan-exclusive" 
                v-model="addPlanForm.exclusiveService"
                required
              >
                <option value="0">{{ $t('common.cancel') }}</option>
                <option value="1">{{ $t('common.confirm') }}</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="add-plan-status">{{ $t('common.status') }}</label>
              <select 
                id="add-plan-status" 
                v-model="addPlanForm.status"
                required
              >
                <option value="active">{{ $t('adminPlans.enable') }}</option>
                <option value="inactive">{{ $t('adminPlans.disable') }}</option>
              </select>
            </div>
          </form>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-secondary" @click="closeAddPlanModal">{{ $t('common.cancel') }}</button>
          <button class="admin-btn admin-btn-primary" @click="savePlan">{{ $t('common.save') }}</button>
        </div>
      </div>
    </div>

    <!-- 查看套餐弹窗 -->
    <div class="admin-modal-overlay" v-if="isViewPlanModalOpen" @click="closeViewPlanModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h2 class="admin-modal-title">{{ $t('adminPlans.view') }} {{ $t('adminPlans.title') }}</h2>
          <button class="admin-modal-close" @click="closeViewPlanModal">×</button>
        </div>
        <div class="admin-modal-body">
          <div v-if="viewPlanForm">
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('adminPlans.enterPlanName') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.name }}</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('adminPlans.enterPrice') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.price || '¥0' }}</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('adminPlans.enterDiscount') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.discount && viewPlanForm.discount > 0 ? viewPlanForm.discount + '折' : $t('adminPlans.none') }}</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('adminPlans.enterActivityDays') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.discountPeriod ? viewPlanForm.discountPeriod + ' 天' : $t('adminPlans.none') }}</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('adminPlans.planDuration') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.period }}</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('adminPlans.aiRecognition') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ getAiTypeName(viewPlanForm.aiType) }}</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('adminPlans.enterMonitorCount') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.maxCameras }} 个</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('common.status') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.status === 'active' ? $t('adminPlans.enable') : $t('adminPlans.disable') }}</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">{{ $t('adminPlans.exclusiveService') }}:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.exclusiveService === '1' ? $t('common.confirm') : $t('common.cancel') }}</span>
            </div>
            <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
              <label style="width: 120px; font-weight: 500; color: #666;">开通的用户数量:</label>
              <span style="flex: 1; color: #333; word-break: break-word;">{{ viewPlanForm.userCount || 0 }} 个</span>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-primary" @click="closeViewPlanModal">{{ $t('common.cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- 编辑套餐弹窗 -->
    <div class="admin-modal-overlay" v-if="isEditPlanModalOpen" @click="closeEditPlanModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h2 class="admin-modal-title">{{ $t('adminPlans.edit') }} {{ $t('adminPlans.title') }}</h2>
          <button class="admin-modal-close" @click="closeEditPlanModal">×</button>
        </div>
        <div class="admin-modal-body">
          <form class="admin-form">
            <div class="admin-form-group">
              <label for="edit-plan-name">{{ $t('adminPlans.enterPlanName') }}</label>
              <input 
                type="text" 
                id="edit-plan-name" 
                v-model="editPlanForm.name"
                :placeholder="$t('adminPlans.enterPlanName')"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-plan-price">{{ $t('adminPlans.enterPrice') }}</label>
              <input 
                type="number" 
                id="edit-plan-price" 
                v-model="editPlanForm.price"
                :placeholder="$t('adminPlans.enterPrice')"
                step="0.1"
                min="0"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-plan-discount">{{ $t('adminPlans.enterDiscount') }}</label>
              <input 
                type="number" 
                id="edit-plan-discount" 
                v-model="editPlanForm.discount"
                :placeholder="$t('adminPlans.enterDiscount')"
                step="0.1"
                min="0"
                max="10"
              >
            </div>
            <div class="admin-form-group" v-if="editPlanForm.discount && editPlanForm.price">
              <label>{{ $t('adminPlans.discountPrice') }}</label>
              <div class="discount-price">
                ¥{{ (parseFloat(editPlanForm.price) * (parseFloat(editPlanForm.discount) / 10)).toFixed(2) }}
              </div>
            </div>
            <div class="admin-form-group" v-if="editPlanForm.discount && editPlanForm.discount > 0">
              <label for="edit-plan-discount-days">{{ $t('adminPlans.enterActivityDays') }}</label>
              <input 
                type="number" 
                id="edit-plan-discount-days" 
                v-model="editPlanForm.discountDays"
                :placeholder="$t('adminPlans.enterActivityDays')"
                min="1"
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-plan-cameras">{{ $t('adminPlans.enterMonitorCount') }}</label>
              <input 
                type="number" 
                id="edit-plan-cameras" 
                v-model="editPlanForm.maxCameras"
                :placeholder="$t('adminPlans.enterMonitorCount')"
                min="1"
                required
              >
            </div>
            <div class="admin-form-group">
              <label for="edit-plan-period-type">{{ $t('adminPlans.planDuration') }}</label>
              <select 
                id="edit-plan-period-type" 
                v-model="editPlanForm.periodType"
                required
              >
                <option value="体验">{{ $t('adminPlans.trial') }}</option>
                <option value="天">{{ $t('adminPlans.day') }}</option>
                <option value="周">{{ $t('adminPlans.week') }}</option>
                <option value="月">{{ $t('adminPlans.month') }}</option>
                <option value="季">{{ $t('adminPlans.quarter') }}</option>
                <option value="年">{{ $t('adminPlans.year') }}</option>
                <option value="永久">{{ $t('adminPlans.permanent') }}</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="edit-plan-ai">{{ $t('adminPlans.aiRecognition') }}</label>
              <select 
                id="edit-plan-ai" 
                v-model="editPlanForm.aiType"
                required
              >
                <option value="1">{{ $t('adminPlans.none') }}</option>
                <option value="2">{{ $t('adminPlans.standard') }}</option>
                <option value="3">{{ $t('adminPlans.premium') }}</option>
                <option value="4">{{ $t('adminPlans.enterprise') }}</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="edit-plan-exclusive">{{ $t('adminPlans.exclusiveService') }}</label>
              <select 
                id="edit-plan-exclusive" 
                v-model="editPlanForm.exclusiveService"
                required
              >
                <option value="0">{{ $t('common.cancel') }}</option>
                <option value="1">{{ $t('common.confirm') }}</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="edit-plan-status">{{ $t('common.status') }}</label>
              <select 
                id="edit-plan-status" 
                v-model="editPlanForm.status"
                required
              >
                <option value="active">{{ $t('adminPlans.enable') }}</option>
                <option value="inactive">{{ $t('adminPlans.disable') }}</option>
              </select>
            </div>
          </form>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-secondary" @click="closeEditPlanModal">{{ $t('common.cancel') }}</button>
          <button class="admin-btn admin-btn-primary" @click="updatePlan">{{ $t('common.save') }}</button>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div class="admin-modal-overlay" v-if="isConfirmModalOpen" @click="closeConfirmModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h2 class="admin-modal-title">{{ $t('admin.users.confirmModal') }}</h2>
          <button class="admin-modal-close" @click="closeConfirmModal">×</button>
        </div>
        <div class="admin-modal-body">
          <p style="text-align: center; font-size: 16px; color: #333; margin-bottom: 24px; line-height: 1.5;">{{ confirmMessage }}</p>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-secondary" @click="handleConfirm(false)">{{ $t('common.cancel') }}</button>
          <button class="admin-btn admin-btn-primary" @click="handleConfirm(true)">{{ $t('common.confirm') }}</button>
        </div>
      </div>
    </div>

    <!-- 消息提示弹窗 -->
    <div class="admin-modal-overlay" v-if="isMessageModalOpen" @click="closeMessageModal">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h2 class="admin-modal-title">{{ $t('admin.users.alertModal') }}</h2>
          <button class="admin-modal-close" @click="closeMessageModal">×</button>
        </div>
        <div class="admin-modal-body">
          <p style="text-align: center; font-size: 16px; color: #333; margin-bottom: 24px; line-height: 1.5;">{{ messageText }}</p>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-primary" @click="closeMessageModal">{{ $t('common.confirm') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminNavbar from '../../components/AdminNavbar.vue'
import apiService from '../../services/api.js'

const { t } = useI18n()

// 套餐数据
const plans = ref([])
const loading = ref(false)

// 获取套餐列表
const fetchPlans = async () => {
  try {
    loading.value = true
    const data = await apiService.get('/admin/plans')
    if (data.code === 200) {
      // 格式化套餐数据
        plans.value = data.data.map(plan => {
          // 格式化价格显示
          let priceDisplay = `¥${plan.price}`
          
          // 格式化周期
          let periodText = ''
          switch (plan.period) {
            case '月':
              periodText = '/月'
              break
            case '年':
              periodText = '/年'
              break
            case '永久':
              periodText = '/永久'
              break
            default:
              periodText = `/${plan.period}`
          }
          
          return {
            ...plan,
            price: priceDisplay,
            period: periodText,
            hasExclusiveService: plan.hasExclusiveService || 0,
            aiType: (plan.aiType !== undefined && plan.aiType !== null) ? plan.aiType.toString() : ((plan.aiLevel !== undefined && plan.aiLevel !== null) ? plan.aiLevel.toString() : '1')
          }
        })
    } else {
      showMessage('获取套餐列表失败：' + data.message)
    }
  } catch (error) {
    showMessage('获取套餐列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取套餐列表
onMounted(() => {
  fetchPlans()
})

// 弹窗状态
const isAddPlanModalOpen = ref(false)
const isViewPlanModalOpen = ref(false)
const isEditPlanModalOpen = ref(false)
const isConfirmModalOpen = ref(false)
const isMessageModalOpen = ref(false)

// 表单数据
const addPlanForm = ref({
  name: '',
  price: '',
  discount: '',
  discountDays: '',
  periodType: '月',
  maxCameras: '',
  aiType: '1',
  exclusiveService: '0',
  status: 'active'
})

const viewPlanForm = ref({
  name: '',
  price: '',
  discount: '',
  discountPeriod: '',
  period: '',
  maxCameras: '',
  aiType: '1',
  exclusiveService: '0',
  features: [],
  status: 'active',
  userCount: 0
})

const editPlanForm = ref({
  id: '',
  name: '',
  price: '',
  discount: '',
  discountDays: '',
  periodType: '月',
  maxCameras: '',
  aiType: '1',
  exclusiveService: '0',
  status: 'active'
})

// 确认弹窗和消息弹窗
const confirmMessage = ref('')
const messageText = ref('')
const confirmCallback = ref(null)

// 获取AI类型名称
const getAiTypeName = (aiType) => {
  const aiTypes = {
    '1': t('adminPlans.none'),
    '2': t('adminPlans.standard'),
    '3': t('adminPlans.premium'),
    '4': t('adminPlans.enterprise')
  }
  return aiTypes[aiType] || t('adminPlans.none')
}

// 获取套餐时长类型文本
const getPeriodTypeText = (periodType) => {
  const periodTypes = {
    month: '/月',
    year: '/年',
    quarter: '/季度',
    week: '/周',
    trial: '/体验'
  }
  return periodTypes[periodType] || '/月'
}

// 直接展示接口数据中的日期字段
const getExpiryDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 打开添加套餐弹窗
const openAddPlanModal = () => {
  // 重置表单
  addPlanForm.value = {
    name: '',
    price: '',
    discount: '',
    discountDays: '',
    periodType: '月',
    maxCameras: '',
    aiType: '1',
    exclusiveService: '0',
    status: 'active'
  }
  isAddPlanModalOpen.value = true
}

// 关闭添加套餐弹窗
const closeAddPlanModal = () => {
  isAddPlanModalOpen.value = false
}

// 保存套餐
const savePlan = async () => {
  // 表单验证
  if (!addPlanForm.value.name || !addPlanForm.value.price || !addPlanForm.value.maxCameras) {
    showMessage(t('admin.users.fillRequiredFields'))
    return
  }

  try {
    loading.value = true
    
    // 生成特性列表
    const features = [
      `${getAiTypeName(addPlanForm.value.aiType)} ${t('adminPlans.aiRecognition')}`,
      t('adminPlans.service24h'),
      t('adminPlans.smsPhoneAlert'),
      t('adminPlans.maxDevices', { count: parseInt(addPlanForm.value.maxCameras) }),
      t('adminPlans.longTermAlert'),
      t('adminPlans.longTermVideo'),
      t('adminPlans.autoEmergencyCall')
    ]

    // 计算折扣到期日期
    let discountPeriod = null
    if (addPlanForm.value.discountDays && addPlanForm.value.discountDays > 0) {
      const date = new Date()
      date.setDate(date.getDate() + parseInt(addPlanForm.value.discountDays))
      discountPeriod = date.toISOString().split('T')[0]
    }
    
    // 计算折扣后的价格
    const originalPrice = parseFloat(addPlanForm.value.price)
    const discount = addPlanForm.value.discount ? parseFloat(addPlanForm.value.discount) : 0
    const discountedPrice = discount > 0 ? (originalPrice * (discount / 10)).toFixed(2) : originalPrice
    
    // 准备请求数据
    const requestData = {
      name: addPlanForm.value.name,
      price: parseFloat(discountedPrice),
      originalPrice: originalPrice,
      discount: discount,
      discountPeriod: discountPeriod,
      period: addPlanForm.value.periodType,
      maxCameras: parseInt(addPlanForm.value.maxCameras),
      aiLevel: parseInt(addPlanForm.value.aiType),
      hasExclusiveService: parseInt(addPlanForm.value.exclusiveService),
      status: addPlanForm.value.status,
      features: features
    }

    // 调试：打印请求数据
    console.log('添加套餐请求数据:', requestData);
    
    // 发送请求
    const data = await apiService.post('/admin/plans', requestData)

    if (data.code === 200) {
      showMessage(t('adminPlans.addSuccess'))
      closeAddPlanModal()
      // 重新获取套餐列表
      fetchPlans()
    } else {
      showMessage(t('adminPlans.addFailed') + data.message)
    }
  } catch (error) {
    showMessage(t('adminPlans.addFailed') + error.message)
  } finally {
    loading.value = false
  }
}

// 打开查看套餐弹窗
const openViewPlanModal = async (planId) => {
  try {
    loading.value = true
    const data = await apiService.get(`/admin/plans/${planId}`)
    if (data.code === 200) {
      const plan = data.data
      // 计算活动时长（天）
      let activityDays = ''
      if (plan.discountPeriod) {
        const endDate = new Date(plan.discountPeriod)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        const diffTime = endDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        activityDays = diffDays > 0 ? diffDays : 0
      }
      // 将数字类型的aiLevel转换为字符串类型
      let aiTypeNumber = '1';
      if (plan.aiLevel !== undefined && plan.aiLevel !== null) {
        aiTypeNumber = typeof plan.aiLevel === 'number' ? plan.aiLevel.toString() : plan.aiLevel;
      } else if (plan.aiType !== undefined && plan.aiType !== null) {
        aiTypeNumber = typeof plan.aiType === 'number' ? plan.aiType.toString() : plan.aiType;
      }
      
      // 确保aiTypeNumber是有效的数字字符串
      if (!['1', '2', '3', '4'].includes(aiTypeNumber)) {
        aiTypeNumber = '1';
      }
      
      viewPlanForm.value = {
        name: plan.name,
        price: `¥${plan.price}`,
        discount: plan.discount || 0,
        discountPeriod: activityDays,
        period: plan.period,
        maxCameras: plan.maxCameras,
        aiType: aiTypeNumber,
        exclusiveService: (plan.hasExclusiveService === 1 ? '1' : '0'),
        features: plan.features || [],
        status: plan.status,
        userCount: plan.userCount || 0
      }
      isViewPlanModalOpen.value = true
    } else {
      showMessage('获取套餐详情失败：' + data.message)
    }
  } catch (error) {
    showMessage('获取套餐详情失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 关闭查看套餐弹窗
const closeViewPlanModal = () => {
  isViewPlanModalOpen.value = false
}

// 打开编辑套餐弹窗
const openEditPlanModal = async (planId) => {
  try {
    loading.value = true
    const data = await apiService.get(`/admin/plans/${planId}`)
    if (data.code === 200) {
      const plan = data.data
      // 计算活动时长（天）
      let discountDays = ''
      if (plan.discountPeriod) {
        const endDate = new Date(plan.discountPeriod)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        const diffTime = endDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        discountDays = diffDays > 0 ? diffDays.toString() : ''
      } else if (plan.discount && plan.discount > 0) {
        // 如果有折扣但没有折扣到期日期，默认设置为30天
        discountDays = '30'
      }
      // 从originalPrice字段读取原价作为编辑框的默认价格
      const priceToEdit = plan.originalPrice || plan.price
      
      // 将数字类型的aiType转换为字符串类型
      let aiTypeNumber = '1';
      if (plan.aiLevel !== undefined && plan.aiLevel !== null) {
        aiTypeNumber = typeof plan.aiLevel === 'number' ? plan.aiLevel.toString() : plan.aiLevel;
      } else if (plan.aiType !== undefined && plan.aiType !== null) {
        aiTypeNumber = typeof plan.aiType === 'number' ? plan.aiType.toString() : plan.aiType;
      }
      
      // 确保aiTypeNumber是有效的数字字符串
      if (!['1', '2', '3', '4'].includes(aiTypeNumber)) {
        aiTypeNumber = '1';
      }
      
      editPlanForm.value = {
        id: plan.id,
        name: plan.name,
        price: typeof priceToEdit === 'number' ? priceToEdit.toString() : priceToEdit,
        discount: plan.discount ? (typeof plan.discount === 'number' ? plan.discount.toString() : plan.discount) : '',
        discountDays: discountDays,
        periodType: plan.period,
        maxCameras: typeof plan.maxCameras === 'number' ? plan.maxCameras.toString() : plan.maxCameras,
        aiType: aiTypeNumber,
        exclusiveService: (plan.hasExclusiveService === 1 ? '1' : '0'),
        status: plan.status
      }
      isEditPlanModalOpen.value = true
    } else {
      showMessage('获取套餐详情失败：' + data.message)
    }
  } catch (error) {
    showMessage('获取套餐详情失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 关闭编辑套餐弹窗
const closeEditPlanModal = () => {
  isEditPlanModalOpen.value = false
}

// 更新套餐
const updatePlan = async () => {
  // 表单验证
  if (!editPlanForm.value.name || !editPlanForm.value.price || !editPlanForm.value.maxCameras) {
    showMessage(t('admin.users.fillRequiredFields'))
    return
  }

  try {
    loading.value = true
    
    // 生成特性列表
    const features = [
      `${getAiTypeName(editPlanForm.value.aiType)} ${t('adminPlans.aiRecognition')}`,
      t('adminPlans.service24h'),
      t('adminPlans.smsPhoneAlert'),
      t('adminPlans.maxDevices', { count: parseInt(editPlanForm.value.maxCameras) }),
      t('adminPlans.longTermAlert'),
      t('adminPlans.longTermVideo'),
      t('adminPlans.autoEmergencyCall')
    ]

    // 计算折扣到期日期
    let discountPeriod = null
    if (editPlanForm.value.discountDays && editPlanForm.value.discountDays > 0) {
      const date = new Date()
      date.setDate(date.getDate() + parseInt(editPlanForm.value.discountDays))
      discountPeriod = date.toISOString().split('T')[0]
    }
    
    // 计算折扣后的价格
    const originalPrice = parseFloat(editPlanForm.value.price) || 0
    const discount = editPlanForm.value.discount ? parseFloat(editPlanForm.value.discount) : 0
    const discountedPrice = discount > 0 ? (originalPrice * (discount / 10)).toFixed(2) : originalPrice
    
    // 准备请求数据
    const requestData = {
      name: editPlanForm.value.name,
      price: parseFloat(discountedPrice),
      originalPrice: originalPrice,
      discount: discount,
      discountPeriod: discountPeriod,
      period: editPlanForm.value.periodType,
      maxCameras: parseInt(editPlanForm.value.maxCameras),
      aiLevel: parseInt(editPlanForm.value.aiType),
      hasExclusiveService: parseInt(editPlanForm.value.exclusiveService),
      status: editPlanForm.value.status,
      features: features
    }
    
    // 确保所有数字字段都是数字类型
    Object.keys(requestData).forEach(key => {
      if (['price', 'originalPrice', 'discount', 'maxCameras', 'aiLevel', 'hasExclusiveService'].includes(key)) {
        if (typeof requestData[key] === 'string') {
          requestData[key] = parseFloat(requestData[key]) || 0
        } else if (typeof requestData[key] === 'number' && isNaN(requestData[key])) {
          requestData[key] = 0
        }
      }
    })

    // 调试：打印请求数据
    console.log('更新套餐请求数据:', requestData);
    
    // 发送请求
    const data = await apiService.put(`/admin/plans/${editPlanForm.value.id}`, requestData)

    if (data.code === 200) {
      showMessage(t('adminPlans.updateSuccess'))
      closeEditPlanModal()
      // 重新获取套餐列表
      fetchPlans()
    } else {
      showMessage(t('adminPlans.updateFailed') + data.message)
    }
  } catch (error) {
    showMessage(t('adminPlans.updateFailed') + error.message)
  } finally {
    loading.value = false
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

// 显示消息提示
const showMessage = (message) => {
  messageText.value = message
  isMessageModalOpen.value = true
}

// 关闭消息提示
const closeMessageModal = () => {
  isMessageModalOpen.value = false
}

// 删除套餐
const deletePlan = async (planId) => {
  const plan = plans.value.find(p => p.id === planId)
  if (plan) {
    showConfirm(t('adminPlans.confirmDelete'), async (confirmed) => {
      if (confirmed) {
        try {
          loading.value = true
          
          // 发送删除请求
          const data = await apiService.delete(`/admin/plans/${planId}`)

          if (data.code === 200) {
            showMessage(t('adminPlans.deleteSuccess'))
            // 重新获取套餐列表
            fetchPlans()
          } else {
            showMessage(t('adminPlans.deleteFailed') + data.message)
          }
        } catch (error) {
          showMessage(t('adminPlans.deleteFailed') + error.message)
        } finally {
          loading.value = false
        }
      }
    })
  }
}

// 监听折扣变化，实时计算折扣价格
watch(
  () => [addPlanForm.value.price, addPlanForm.value.discount],
  ([newPrice, newDiscount]) => {
    // 这里不需要修改 addPlanForm.value.price，因为我们在保存时才计算最终价格
    // 但我们可以添加一个计算属性来显示实时折扣价格
  }
)

watch(
  () => [editPlanForm.value.price, editPlanForm.value.discount],
  ([newPrice, newDiscount]) => {
    // 同样，这里不需要修改 editPlanForm.value.price
  }
)

// 绑定按钮事件
const handleViewPlan = (planId) => {
  openViewPlanModal(planId)
}

const handleEditPlan = (planId) => {
  openEditPlanModal(planId)
}

const handleDeletePlan = (planId) => {
  deletePlan(planId)
}
</script>

<style scoped>
/* 套餐卡片样式 */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.plan-card {
  background-color: var(--admin-card-background);
  border-radius: var(--admin-border-radius);
  box-shadow: var(--admin-shadow);
  overflow: hidden;
  transition: var(--admin-transition);
  border: 1px solid var(--admin-border);
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--admin-primary);
}

.plan-header {
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--admin-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-header h3 {
  font-size: 18px;
  color: var(--admin-text);
  margin: 0;
  font-weight: 600;
}

.plan-details {
  padding: 20px;
}

.plan-price {
  margin-bottom: 20px;
}

.price {
  font-size: 28px;
  font-weight: bold;
  color: var(--admin-danger);
}

.original-price {
  font-size: 18px;
  color: var(--admin-text-light);
  text-decoration: line-through;
  margin-right: 10px;
}

.period {
  font-size: 14px;
  color: var(--admin-text-light);
  margin-left: 5px;
}

.discount-info {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.discount-label {
  font-size: 14px;
  color: var(--admin-text-light);
}

.discount-value {
  font-size: 14px;
  font-weight: bold;
  color: var(--admin-danger);
}

.expiry-date {
  margin-top: 5px;
  font-size: 12px;
  color: var(--admin-text-light);
}

.discount-price {
  font-size: 16px;
  font-weight: bold;
  color: var(--admin-danger);
  margin-top: 5px;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.plan-features li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--admin-text);
}

.feature-icon {
  color: var(--admin-success);
  font-weight: bold;
  margin-top: 2px;
  flex-shrink: 0;
}

.cross-icon {
  color: var(--admin-danger);
}

.plan-actions {
  padding: 20px;
  border-top: 1px solid var(--admin-border);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* 下拉菜单样式 */
select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-border-radius);
  background-color: var(--admin-background);
  color: var(--admin-text);
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
  cursor: pointer;
  transition: var(--admin-transition);
}

select:hover {
  border-color: var(--admin-primary);
}

select:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 2px rgba(51, 102, 255, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .plan-actions {
    flex-direction: column;
  }
  
  .admin-btn {
    width: 100%;
    justify-content: center;
  }
  
  /* 移动端下拉菜单样式 */
  select {
    padding: 8px 12px;
    font-size: 13px;
    background-size: 14px;
    background-position: right 10px center;
  }
}
</style>