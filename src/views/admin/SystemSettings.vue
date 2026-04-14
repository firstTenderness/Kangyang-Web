<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <AdminNavbar />
    
    <!-- 主要内容区域 -->
    <main class="admin-content">
      <!-- 页面标题 -->
      <h1 class="admin-page-title">{{ $t('admin.system.title') }}</h1>
      
      <!-- 设置表单 -->
      <div class="admin-card">
        <form class="admin-form" @submit.prevent="saveSettings">
          <!-- 网站基本信息 -->
          <div class="admin-card admin-mb-6">
            <h2 class="admin-page-title text-lg font-bold mb-6">{{ $t('admin.system.websiteInfo') }}</h2>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>{{ $t('admin.system.websiteTitle') }}</label>
                <input type="text" v-model="settings.siteTitle" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.websiteDomain') }}</label>
                <input type="text" v-model="settings.siteDomain" placeholder="https://example.com" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.websiteIcp') }}</label>
                <input type="text" v-model="settings.icp" :placeholder="$t('admin.system.websiteIcpPlaceholder')" />
              </div>
            </div>
          </div>
          
          <!-- 系统配置 -->
          <div class="admin-card admin-mb-6">
            <h2 class="admin-page-title text-lg font-bold mb-6">{{ $t('admin.system.systemConfig') }}</h2>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>{{ $t('admin.system.systemName') }}</label>
                <input type="text" v-model="settings.systemName" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.systemVersion') }}</label>
                <input type="text" v-model="settings.systemVersion" disabled />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.adminEmail') }}</label>
                <input type="email" v-model="settings.adminEmail" />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.adminPhone') }}</label>
                <input type="tel" v-model="settings.adminPhone" />
              </div>
            </div>
          </div>
          
          <!-- 通知配置 -->
          <div class="admin-card admin-mb-6">
            <h2 class="admin-page-title text-lg font-bold mb-6">{{ $t('admin.system.notificationConfig') }}</h2>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>{{ $t('admin.system.smsApiKey') }}</label>
                <input type="password" v-model="settings.smsApiKey" />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.emailServer') }}</label>
                <input type="text" v-model="settings.emailServer" />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.emailPort') }}</label>
                <input type="number" v-model="settings.emailPort" />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.senderEmail') }}</label>
                <input type="email" v-model="settings.emailSender" />
              </div>
            </div>
          </div>
          
          <!-- 微信配置 -->
          <div class="admin-card admin-mb-6">
            <h2 class="admin-page-title text-lg font-bold mb-6">{{ $t('admin.system.wechatConfig') }}</h2>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>{{ $t('admin.system.wechatAppId') }}</label>
                <input type="text" v-model="settings.wechatAppId" />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.wechatAppSecret') }}</label>
                <input type="password" v-model="settings.wechatAppSecret" />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.system.wechatTemplateId') }}</label>
                <input type="text" v-model="settings.wechatTemplateId" />
              </div>
            </div>
          </div>
          
          <!-- 保存按钮 -->
          <div class="admin-form-row" style="justify-content: flex-start; margin-top: 30px;">
            <button type="submit" class="admin-btn admin-btn-primary">{{ $t('admin.system.save') }}</button>
            <button type="button" class="admin-btn admin-btn-secondary" @click="resetSettings">{{ $t('admin.system.reset') }}</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AdminNavbar from '../../components/AdminNavbar.vue';
import apiService from '../../services/api.js';

const { t } = useI18n();

// 系统设置数据
const settings = ref({
  // 网站基本信息
  siteTitle: '',
  siteDomain: '',
  icp: '',
  
  // 系统配置
  systemName: '',
  systemVersion: '',
  adminEmail: '',
  adminPhone: '',
  
  // 通知配置
  smsApiKey: '',
  emailServer: '',
  emailPort: '',
  emailSender: '',
  
  // 微信配置
  wechatAppId: '',
  wechatAppSecret: '',
  wechatTemplateId: ''
});

const loading = ref(false);
const originalSettings = ref({});

// 获取系统设置
const fetchSettings = async () => {
  try {
    loading.value = true;
    console.log('=== 开始获取系统设置 ===');
    console.log('调用API地址:', '/admin/settings');
    
    // 使用apiService发送请求，使用相对路径，apiService会自动添加/api前缀
    const result = await apiService.get('/admin/settings');
    console.log('=== API响应详情 ===');
    console.log('状态码:', result ? result.code : '无响应');
    console.log('响应数据:', result);
    
    if (result && result.code === 200) {
      console.log('=== 获取系统设置成功 ===');
      console.log('API返回的数据:', result.data);
      
      // 只更新现有settings对象中有的字段，忽略新增的字段
      const existingFields = Object.keys(settings.value);
      console.log('现有设置字段:', existingFields);
      
      const filteredData = {};
      existingFields.forEach(field => {
        if (result.data[field] !== undefined) {
          filteredData[field] = result.data[field];
          console.log(`更新字段 ${field}: ${result.data[field]}`);
        }
      });
      
      settings.value = { ...settings.value, ...filteredData };
      originalSettings.value = { ...filteredData };
      
      console.log('=== 获取系统设置完成 ===');
    } else {
      const errorMessage = result && result.message ? result.message : t('admin.system.unknownError');
      console.error('=== 获取系统设置失败 ===');
      console.error('错误信息:', errorMessage);
      alert(t('admin.system.fetchFailed') + errorMessage);
    }
  } catch (error) {
    console.error('=== 获取系统设置异常 ===');
    console.error('异常详情:', error);
    console.error('异常堆栈:', error.stack);
    const errorMessage = error.message || t('admin.system.networkError');
    alert(t('admin.system.fetchFailed') + errorMessage);
  } finally {
    loading.value = false;
    console.log('=== 获取系统设置请求结束 ===');
  }
};

// 保存系统设置
const saveSettings = async () => {
  try {
    loading.value = true;
    console.log('=== 开始保存系统设置 ===');
    console.log('调用API地址:', '/admin/settings');
    
    // 只发送现有settings对象中的字段
    console.log('保存的设置数据:', settings.value);
    
    // 使用apiService发送请求，使用相对路径，apiService会自动添加/api前缀
    const result = await apiService.put('/admin/settings', settings.value);
    console.log('=== 保存设置API响应详情 ===');
    console.log('状态码:', result ? result.code : '无响应');
    console.log('响应数据:', result);
    
    if (result && result.code === 200) {
      console.log('=== 保存系统设置成功 ===');
      
      alert(t('admin.system.saveSuccess'));
      originalSettings.value = { ...settings.value };
      console.log('=== 保存系统设置完成 ===');
    } else {
      const errorMessage = result && result.message ? result.message : t('admin.system.unknownError');
      console.error('=== 保存系统设置失败 ===');
      console.error('错误信息:', errorMessage);
      alert(t('admin.system.saveFailed') + errorMessage);
    }
  } catch (error) {
    console.error('=== 保存系统设置异常 ===');
    console.error('异常详情:', error);
    console.error('异常堆栈:', error.stack);
    const errorMessage = error.message || t('admin.system.networkError');
    alert(t('admin.system.saveFailed') + errorMessage);
  } finally {
    loading.value = false;
    console.log('=== 保存系统设置请求结束 ===');
  }
};

// 重置设置
const resetSettings = () => {
  if (confirm(t('admin.system.confirmReset'))) {
    settings.value = { ...originalSettings.value };
  }
};

// 页面加载时获取设置
onMounted(() => {
  fetchSettings();
});
</script>

<style scoped>
/* 响应式调整 */
@media (max-width: 768px) {
  .admin-form-row {
    flex-direction: column;
  }
}
</style>