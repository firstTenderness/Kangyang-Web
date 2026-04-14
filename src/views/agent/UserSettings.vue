<template>
  <div class="user-settings">
    <!-- 导航栏 -->
    <AgentNavbar />
    
    <div class="settings-header">
      <h1>{{ t('agent.userSettings.title') }}</h1>
    </div>

    <div class="settings-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ t('common.loading') }}</p>
      </div>
      
      <form v-else class="settings-form">
        <!-- 基本信息 -->
        <div class="form-section">
          <h2>{{ t('agent.userSettings.basicInfo') }}</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="user-name">{{ t('agent.userSettings.username') }}</label>
              <input 
                type="text" 
                id="user-name" 
                v-model="formData.userName"
                :placeholder="t('agent.userSettings.enterUsername')"
                class="form-input"
                required
                :disabled="loading"
              >
            </div>
            <div class="form-group">
              <label for="user-phone">{{ t('agent.userSettings.phone') }}</label>
              <input 
                type="tel" 
                id="user-phone" 
                v-model="formData.phone"
                :placeholder="t('agent.userSettings.enterPhone')"
                class="form-input"
                required
                :disabled="loading"
              >
            </div>
          </div>
          <div class="form-group">
            <label for="user-email">{{ t('agent.userSettings.email') }}</label>
            <input 
              type="email" 
              id="user-email" 
              v-model="formData.email"
              :placeholder="t('agent.userSettings.enterEmail')"
              class="form-input"
              :disabled="loading"
            >
          </div>
        </div>

        <!-- 密码修改 -->
        <div class="form-section">
          <h2>{{ t('agent.userSettings.passwordChange') }}</h2>
          <div class="form-group">
            <label for="current-password">{{ t('agent.userSettings.currentPassword') }}</label>
            <input 
              type="password" 
              id="current-password" 
              v-model="formData.currentPassword"
              :placeholder="t('agent.userSettings.enterCurrentPassword')"
              class="form-input"
              :disabled="loading"
            >
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="new-password">{{ t('agent.userSettings.newPassword') }}</label>
              <input 
                type="password" 
                id="new-password" 
                v-model="formData.newPassword"
                :placeholder="t('agent.userSettings.enterNewPassword')"
                class="form-input"
                :disabled="loading"
              >
            </div>
            <div class="form-group">
              <label for="confirm-password">{{ t('agent.userSettings.confirmPassword') }}</label>
              <input 
                type="password" 
                id="confirm-password" 
                v-model="formData.confirmPassword"
                :placeholder="t('agent.userSettings.confirmNewPassword')"
                class="form-input"
                :disabled="loading"
              >
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="submit" class="save-btn" @click.prevent="saveSettings" :disabled="loading">{{ t('agent.userSettings.saveSettings') }}</button>
        </div>
      </form>
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
  await fetchUserInfo()
})

// 表单数据
const formData = ref({
  userName: '',
  phone: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 提示弹窗状态
const isAlertModalOpen = ref(false)
const alertMessage = ref('')
const loading = ref(false)

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

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true
    const data = await apiService.get('/user/info')
    if (data.code === 200) {
      const userInfo = data.data
      formData.value = {
        ...formData.value,
        userName: userInfo.username,
        phone: userInfo.phone,
        email: userInfo.email
      }
    } else {
      showAlert('获取用户信息失败：' + data.message)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    showAlert(t('agent.common.getUserInfoFailed'))
  } finally {
    loading.value = false
  }
}

// 保存设置
const saveSettings = async () => {
  try {
    loading.value = true
    
    // 密码修改验证
    if (formData.value.newPassword) {
      if (formData.value.newPassword !== formData.value.confirmPassword) {
        showAlert(t('agent.common.passwordsNotMatch'))
        return
      }
      if (!formData.value.currentPassword) {
        showAlert(t('agent.common.enterCurrentPassword'))
        return
      }
      
      // 修改密码
      const passwordData = await apiService.put('/user/password', {
        oldPassword: formData.value.currentPassword,
        newPassword: formData.value.newPassword
      })
      
      if (passwordData.code !== 200) {
        showAlert('修改密码失败：' + passwordData.message)
        return
      }
      
      // 清空密码字段
      formData.value.currentPassword = ''
      formData.value.newPassword = ''
      formData.value.confirmPassword = ''
    }
    
    // 更新用户信息
    const userData = await apiService.put('/user/info', {
      username: formData.value.userName,
      email: formData.value.email
    })
    
    if (userData.code === 200) {
      showAlert(t('agent.common.saveSettingsSuccess'))
    } else {
      showAlert(t('agent.common.updateUserInfoFailed') + userData.message)
    }
  } catch (error) {
    console.error('保存设置失败:', error)
    showAlert(t('agent.common.saveSettingsFailed'))
  } finally {
    loading.value = false
  }
}

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.user-settings {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.settings-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px;
  width: 100%;
}

.settings-content {
  width: 100%;
  padding: 0 20px 20px;
}

.settings-header h1 {
  font-size: 28px;
  color: #1E88E5;
  margin: 0;
}



.settings-form {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.form-section h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 250px;
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #1E88E5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  margin-bottom: 10px;
}

.checkbox-label:last-child {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.save-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  background-color: #1E88E5;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
  font-weight: 600;
}

.save-btn:hover {
  background-color: #1976D2;
}

.form-actions {
  justify-content: center;
}

@media (max-width: 768px) {
  .settings-content {
    max-width: 100%;
  }
  
  .settings-form {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .form-group {
    min-width: auto;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .save-btn {
    width: 100%;
    text-align: center;
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

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
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
</style>