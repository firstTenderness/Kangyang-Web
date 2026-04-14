<template>
  <div class="service-plan">
    <!-- 导航栏 -->
    <AgentNavbar />
    
    <div class="plan-header">
      <h1>{{ t('agent.servicePlan.title') }}</h1>
      <div class="current-plan-info">
        <p class="current-plan">{{ t('agent.servicePlan.currentPlan') }}: <span class="plan-name">{{ currentPlan.name }}</span></p>
        <p class="expire-date" v-if="currentPlan.name !== t('agent.servicePlan.noPlan')">{{ t('agent.servicePlan.expireDate') }}: {{ currentPlan.daysRemaining }} {{ t('agent.servicePlan.days') }}</p>
      </div>
    </div>

    <div class="plan-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ t('common.loading') }}</p>
      </div>
      
      <template v-else>
        <div class="plan-description">
          <h2>{{ t('agent.servicePlan.choosePlan') }}</h2>
          <p>{{ t('agent.servicePlan.planDescription') }}</p>
        </div>

        <div class="plan-cards">
          <!-- 套餐卡片 -->
          <div 
            v-for="plan in plans.filter(p => !p.status || p.status !== 'inactive')" 
            :key="plan.id" 
            class="plan-card" 
            :class="{ 
              active: currentPlan.name === plan.name 
            }"
          >
            <div class="plan-badge" v-if="currentPlan.name === plan.name">{{ t('agent.servicePlan.currentPlan') }}</div>
            <div class="plan-header-card">
              <h3>{{ plan.name }}</h3>
              <div class="plan-price" v-if="plan.originalPrice && plan.originalPrice > plan.price">
                <div class="price-container">
                  <span class="original-price">¥{{ plan.originalPrice }}</span>
                  <span class="discounted-price">¥{{ plan.price }}<span class="period">/{{ plan.period }}</span></span>
                  <span class="discount-badge" v-if="plan.discount">{{ plan.discount }}折</span>
                </div>
                <div class="discount-end-time" v-if="plan.discountPeriod">
                  活动截止: {{ plan.discountPeriod }}
                </div>
              </div>
              <div class="plan-price" v-else>
                <span class="price">¥{{ plan.price }}</span>
                <span class="period">/{{ plan.period }}</span>
              </div>
            </div>
            <div class="plan-features">
              <ul>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ t('agent.servicePlan.maxCameras', { count: plan.maxCameras }) }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon" :class="{ 'cross-icon': plan.hasExclusiveService !== 1 }">{{ plan.hasExclusiveService === 1 ? '✓' : '✗' }}</span>
                  <span>{{ t('agent.servicePlan.exclusiveService') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ t('agent.servicePlan.smsCallNotification') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ (plan.aiType === '1' ? t('agent.servicePlan.none') : plan.aiType === '2' ? t('agent.servicePlan.standard') : plan.aiType === '3' ? t('agent.servicePlan.premium') : t('agent.servicePlan.enterprise')) }} {{ t('agent.servicePlan.aiRecognition') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ t('agent.servicePlan.alertRecordStorage') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ t('agent.servicePlan.videoStorage') }}</span>
                </li>
                <li class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>{{ t('agent.servicePlan.autoEmergencyCall') }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 统一订阅和续订框 -->
        <div class="subscription-box">
            <h3>{{ t('agent.servicePlan.planManagement') }}</h3>
            
            <!-- 订阅框 -->
            <div class="subscription-section" v-if="currentPlan.id === 0">
              <h4>{{ t('agent.servicePlan.subscribePlan') }}</h4>
              <div class="card-verification">
                <label for="subscription-card-code" class="card-code-label">{{ t('agent.servicePlan.cardVerification') }}</label>
                <input 
                  type="text" 
                  id="subscription-card-code"
                  v-model="subscriptionCardCode"
                  :placeholder="t('agent.servicePlan.enterCardCode')"
                  class="card-code-input"
                  :disabled="loading"
                >
                <button 
                  class="subscribe-btn"
                  @click="subscribeWithCard"
                  :disabled="loading"
                >
                  {{ t('agent.servicePlan.subscribe') }}
                </button>
              </div>
            </div>
            
            <!-- 续订框 -->
            <div class="subscription-section" v-else>
              <h4>{{ t('agent.servicePlan.renewPlan') }}</h4>
              <div class="card-verification">
                <label for="renewal-card-code" class="card-code-label">{{ t('agent.servicePlan.cardVerification') }}</label>
                <input 
                  type="text" 
                  id="renewal-card-code"
                  v-model="renewCardCode"
                  :placeholder="t('agent.servicePlan.enterCardCode')"
                  class="card-code-input"
                  :disabled="loading"
                >
                <button 
                  class="subscribe-btn"
                  @click="renewPlanWithCard(currentPlan.id)"
                  :disabled="loading"
                >
                  {{ t('agent.servicePlan.renew') }}
                </button>
              </div>
            </div>
          </div>

        <div class="plan-faq">
          <h2>{{ t('agent.servicePlan.faq') }}</h2>
          <div class="faq-items">
            <div class="faq-item">
              <h4>{{ t('agent.servicePlan.howToUpgrade') }}</h4>
              <p>{{ t('agent.servicePlan.upgradeAnswer') }}</p>
            </div>
            <div class="faq-item">
              <h4>{{ t('agent.servicePlan.whatAfterExpire') }}</h4>
              <p>{{ t('agent.servicePlan.expireAnswer') }}</p>
            </div>
            <div class="faq-item">
              <h4>{{ t('agent.servicePlan.canCancel') }}</h4>
              <p>{{ t('agent.servicePlan.cancelAnswer') }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- 统一的提示弹窗 -->
  <div v-if="isAlertModalOpen" class="modal-overlay" @click="closeAlertModal">
    <div class="modal-content alert-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ t('agent.common.appNotice') }}</h3>
        <button class="close-btn" @click="closeAlertModal">×</button>
      </div>
      <div class="modal-body">
        <p class="alert-message">{{ alertMessage }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="closeAlertModal">{{ t('agent.common.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AgentNavbar from '../../components/AgentNavbar.vue'
import apiService from '../../services/api.js'

const { t, locale } = useI18n()

// 监听语言变化，重新获取数据
watch(locale, async () => {
  await fetchPlans()
  await fetchUserInfo()
})

// 当前套餐
const currentPlan = ref({
  id: 1,
  name: '基础版',
  price: 9.9,
  expireDate: '2026-03-09', // 套餐到期日期
  daysRemaining: 30 // 剩余天数
})

// 卡密输入
const cardCodes = ref({
  1: '',
  2: '',
  3: ''
})

// 续订卡密输入
const renewCardCode = ref('')

// 订阅卡密输入
const subscriptionCardCode = ref('')

// 提示弹窗状态
const isAlertModalOpen = ref(false)
const alertMessage = ref('')

// 加载状态
const loading = ref(false)

// 续订时长选项
const renewalDurations = ref([
  { days: 30, label: '1个月' },
  { days: 90, label: '3个月' },
  { days: 180, label: '6个月' },
  { days: 365, label: '1年' }
])

// 套餐列表
const plans = ref([
  {
    id: 1,
    name: '基础版',
    price: 9.9,
    maxCameras: 3,
    storageDays: 7,
    durationDays: 30 // 套餐时长（天）
  },
  {
    id: 2,
    name: '标准版',
    price: 19.9,
    maxCameras: 8,
    storageDays: 30,
    durationDays: 90 // 套餐时长（天）
  },
  {
    id: 3,
    name: '高级版',
    price: 39.9,
    maxCameras: 15,
    storageDays: 90,
    durationDays: 180 // 套餐时长（天）
  }
])

// 获取套餐列表
const fetchPlans = async () => {
  try {
    loading.value = true
    // 使用管理员接口获取套餐列表
    const result = await apiService.get('/admin/plans')
    if (result.code === 200) {
      plans.value = result.data.map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        originalPrice: plan.originalPrice,
        discount: plan.discount,
        discountPeriod: plan.discountPeriod,
        period: plan.period,
        maxCameras: plan.maxCameras,
        storageDays: plan.storageDays,
        features: plan.features,
        durationDays: plan.period === '月' ? 30 : plan.period === '年' ? 365 : 0,
        status: plan.status,
        hasExclusiveService: plan.hasExclusiveService || 0,
        aiType: (plan.aiType !== undefined && plan.aiType !== null) ? plan.aiType.toString() : ((plan.aiLevel !== undefined && plan.aiLevel !== null) ? plan.aiLevel.toString() : '1')
      }))
    }
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    // 使用默认数据
  } finally {
    loading.value = false
  }
}

// 获取用户信息（包含当前套餐信息）
const fetchUserInfo = async () => {
  try {
    loading.value = true
    
    // 并行获取用户基本信息和套餐信息
    const [userInfoResult, dashboardResult] = await Promise.all([
      apiService.get('/user/info'),
      apiService.get('/user/dashboard')
    ])
    
    if (userInfoResult.code === 200 && dashboardResult.code === 200) {
      const userInfo = userInfoResult.data
      const dashboardInfo = dashboardResult.data
      
      // 当套餐为none时显示未订阅
      if (!userInfo.plan || userInfo.plan === 'none') {
        currentPlan.value = {
          id: 0,
          name: '未订阅',
          price: 0,
          expireDate: userInfo.expireDate,
          daysRemaining: userInfo.daysRemaining
        }
        return
      }
      
      // 从dashboard接口获取套餐名称
      const planName = dashboardInfo.currentPlan || '未订阅'
      
      // 从套餐列表中查找对应的套餐
      const plan = plans.value.find(p => p.name === userInfo.plan || p.name === planName)
      if (plan) {
        currentPlan.value = {
          id: plan.id,
          name: planName,
          price: plan.price,
          expireDate: userInfo.expireDate,
          daysRemaining: userInfo.daysRemaining
        }
      } else {
        // 即使没有找到对应的套餐，也直接显示dashboard返回的套餐名称
        currentPlan.value = {
          id: 1, // 设置为非0值，确保显示到期时间
          name: planName,
          price: 0,
          expireDate: userInfo.expireDate,
          daysRemaining: userInfo.daysRemaining
        }
      }
    } else {
      showAlert('获取用户信息失败：' + (userInfoResult.message || dashboardResult.message))
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    showAlert(t('agent.common.getUserInfoFailed'))
  } finally {
    loading.value = false
  }
}

// 订阅套餐
const subscribePlan = async (planId) => {
  const plan = plans.value.find(p => p.id === planId)
  if (plan) {
    const cardCode = cardCodes.value[planId]
    
    if (!cardCode) {
      showAlert(t('agent.common.enterCardCode'))
      return
    }
    
    try {
      loading.value = true
      
      // 使用卡密
      const useData = await apiService.post('/user/cards/use', { code: cardCode })
      if (useData.code === 200) {
        // 更新当前套餐信息
        currentPlan.value = {
          id: planId,
          name: plan.name,
          price: plan.price,
          expireDate: useData.data.expireDate,
          daysRemaining: useData.data.daysRemaining
        }
        showAlert(`卡密验证成功！成功开通 ${plan.name} 套餐！`)
        // 清空卡密输入
        cardCodes.value[planId] = ''
      } else {
        showAlert('使用卡密失败：' + useData.message)
      }
    } catch (error) {
      console.error('订阅套餐失败:', error)
      showAlert(t('agent.common.subscribePlanFailed'))
    } finally {
      loading.value = false
    }
  }
}

// 续订套餐
const renewPlan = async (planId, days) => {
  const plan = plans.value.find(p => p.id === planId)
  if (plan) {
    try {
      loading.value = true
      
      // 计算续订价格
      const price = (days / 30 * plan.price).toFixed(2)
      
      // 这里应该调用续订API，现在使用模拟数据
      // 实际项目中应该调用类似 /user/plans/renew 的接口
      
      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新当前套餐信息
      const newExpireDate = new Date()
      newExpireDate.setDate(newExpireDate.getDate() + days)
      
      currentPlan.value = {
        ...currentPlan.value,
        expireDate: newExpireDate.toISOString().split('T')[0],
        daysRemaining: days
      }
      
      const duration = days === 30 ? '1个月' : days === 90 ? '3个月' : days === 180 ? '6个月' : '1年'
      showAlert(t('agent.common.renewPlanSuccess', { plan: plan.name, duration }))
    } catch (error) {
      console.error('续订套餐失败:', error)
      showAlert(t('agent.common.renewPlanFailed'))
    } finally {
      loading.value = false
    }
  }
}

// 卡密续订套餐
const renewPlanWithCard = async (planId) => {
  const plan = plans.value.find(p => p.id === planId)
  if (plan) {
    const cardCode = renewCardCode.value
    
    if (!cardCode) {
      showAlert(t('agent.common.enterCardCode'))
      return
    }
    
    try {
      loading.value = true
      
      // 先验证卡密，获取卡密信息
      const verifyData = await apiService.post('/user/cards/verify', {
        code: cardCode
      })
      
      if (verifyData.code === 200) {
        const cardInfo = verifyData.data
        
        // 使用卡密
        const useData = await apiService.post('/user/cards/use', { code: cardCode })
        if (useData.code === 200) {
          // 更新当前套餐信息
          currentPlan.value = {
            ...currentPlan.value,
            expireDate: useData.data.expireDate,
            daysRemaining: useData.data.daysRemaining
          }
          showAlert(t('agent.common.cardVerificationSuccess', { plan: cardInfo.plan, validity: cardInfo.validity }))
          // 清空卡密输入
          renewCardCode.value = ''
        } else {
          let errorMessage = useData.message
          if (errorMessage.includes('卡密不存在')) {
            errorMessage = t('agent.common.cardNotFound')
          }
          showAlert(t('agent.common.cardUseFailed') + errorMessage)
        }
      } else {
        let errorMessage = verifyData.message
        if (errorMessage.includes('卡密不存在')) {
          errorMessage = t('agent.common.cardNotFound')
        }
        showAlert(t('agent.common.cardVerificationFailed') + errorMessage)
      }
    } catch (error) {
      console.error('续订套餐失败:', error)
      showAlert(t('agent.common.renewPlanFailed'))
    } finally {
      loading.value = false
    }
  }
}

// 使用卡密订阅套餐
const subscribeWithCard = async () => {
  const cardCode = subscriptionCardCode.value
  
  if (!cardCode) {
    showAlert(t('agent.common.enterCardCode'))
    return
  }
  
  try {
    loading.value = true
    
    // 先验证卡密，获取卡密信息
    const verifyData = await apiService.post('/user/cards/verify', {
      code: cardCode
    })
    
    if (verifyData.code === 200) {
      const cardInfo = verifyData.data
      
      // 使用卡密
      const useData = await apiService.post('/user/cards/use', { code: cardCode })
      if (useData.code === 200) {
        // 更新当前套餐信息
        const planName = useData.data.plan
        
        // 从套餐列表中查找对应的套餐
        const plan = plans.value.find(p => p.name === planName)
        
        currentPlan.value = {
          id: plan ? plan.id : 0,
          name: planName,
          price: plan ? plan.price : 0,
          expireDate: useData.data.expireDate,
          daysRemaining: useData.data.daysRemaining
        }
        showAlert(t('agent.common.cardVerificationSuccess', { plan: cardInfo.plan, validity: cardInfo.validity }))
        // 清空卡密输入
        subscriptionCardCode.value = ''
      } else {
        let errorMessage = useData.message
        if (errorMessage.includes('卡密不存在')) {
          errorMessage = t('agent.common.cardNotFound')
        }
        showAlert(t('agent.common.cardUseFailed') + errorMessage)
      }
    } else {
      let errorMessage = verifyData.message
      if (errorMessage.includes('卡密不存在')) {
        errorMessage = t('agent.common.cardNotFound')
      }
      showAlert(t('agent.common.cardVerificationFailed') + errorMessage)
    }
  } catch (error) {
    console.error('订阅套餐失败:', error)
    showAlert(t('agent.common.subscribePlanFailed'))
  } finally {
    loading.value = false
  }
}

// 页面加载时获取用户信息和套餐列表
onMounted(async () => {
  // 先获取套餐列表
  await fetchPlans()
  // 再获取用户信息
  await fetchUserInfo()
})

// 显示提示弹窗
const showAlert = (message) => {
  alertMessage.value = message
  isAlertModalOpen.value = true
}

// 关闭提示弹窗
const closeAlertModal = () => {
  isAlertModalOpen.value = false
  alertMessage.value = ''
}
</script>

<style scoped>
.service-plan {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.plan-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px;
  width: 100%;
}

.plan-content {
  width: 100%;
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.plan-header h1 {
  font-size: 28px;
  color: #1E88E5;
  margin: 0;
}

.current-plan {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.plan-name {
  font-weight: 600;
  color: #1E88E5;
}



.plan-description {
  text-align: center;
}

.plan-description h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 10px 0;
}

.plan-description p {
  font-size: 16px;
  color: #666;
  margin: 0;
  max-width: 800px;
  margin: 0 auto;
}

.current-plan-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.expire-date {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.plan-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.plan-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.plan-card.active {
  border: 2px solid #1E88E5;
  box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.1);
}

.plan-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: #1E88E5;
  color: white;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
}

.plan-header-card {
  padding: 30px 20px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.plan-header-card h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 15px 0;
}

.plan-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.price {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.original-price {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.discounted-price {
  font-size: 32px;
  font-weight: bold;
  color: #ff4757;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.discount-badge {
  background-color: #ff4757;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
}

.period {
  font-size: 14px;
  color: #666;
}

.discount-end-time {
  font-size: 12px;
  color: #ff4757;
  margin-top: 5px;
}

.plan-features {
  padding: 20px;
}

.plan-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #E8F5E9;
  color: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.cross-icon {
  background-color: #FFEBEE;
  color: #F44336;
}

.feature-item.disabled .feature-icon {
  background-color: #FFEBEE;
  color: #F44336;
}

.feature-item.disabled {
  opacity: 0.6;
}

.subscribe-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid #1E88E5;
  border-radius: 6px;
  background-color: white;
  color: #1E88E5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subscribe-btn:hover:not(:disabled) {
  background-color: #1E88E5;
  color: white;
}

.subscribe-btn:disabled {
  background-color: #f8f9fa;
  color: #999;
  border-color: #ddd;
  cursor: not-allowed;
}

/* 卡密验证样式 */
.card-verification {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-verification input {
  flex: 1;
}

.card-code-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 600;
}

.card-code-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.card-code-input:focus {
  outline: none;
  border-color: #1E88E5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.plan-faq {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.plan-faq h2 {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px 0;
}

.faq-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.faq-item h4 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.faq-item p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .plan-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .plan-cards {
    grid-template-columns: 1fr;
  }
  
  .plan-card.recommended {
    transform: none;
  }
  
  .plan-content {
    padding: 0;
  }
  
  .plan-faq {
    padding: 20px;
  }
}

/* 弹窗样式 */
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
  max-width: 500px;
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

.alert-message {
  font-size: 16px;
  color: #333;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.modal-footer {
  padding: 20px 25px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary {
  background-color: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

.btn-primary:hover {
  background-color: #1976D2;
  border-color: #1976D2;
}

.alert-modal {
  max-width: 500px;
  width: 90%;
}

/* 续订框样式 */
.renewal-box {
  margin-top: 20px;
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.renewal-box h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
  text-align: center;
}

.renewal-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
}

.renewal-btn {
  padding: 12px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 14px;
}

.renewal-btn:hover {
  background-color: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

.renewal-price {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  display: block;
}

.renewal-btn:hover .renewal-price {
  color: white;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .renewal-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 加载状态样式 */
.loading-overlay {
  position: relative;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 60px 20px;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
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

/* 统一订阅和续订框样式 */
.subscription-box {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-top: 30px;
}

.subscription-box h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.subscription-section {
  max-width: 500px;
  margin: 0 auto;
}

.subscription-section h4 {
  font-size: 16px;
  color: #666;
  margin: 0 0 15px 0;
  text-align: center;
  font-weight: 600;
}

.subscription-section .card-verification {
  margin-bottom: 20px;
}

.subscription-section .subscribe-btn {
  margin-top: 10px;
}
</style>