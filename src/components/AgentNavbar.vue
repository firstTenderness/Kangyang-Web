<template>
  <!-- 阿里云风格的导航栏组件 -->
  <nav class="agent-navbar">
    <div class="navbar-brand">
      <div class="brand-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#1890FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="#1890FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="#1890FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2>{{ $t('agent.navbar.title') }}</h2>
    </div>
    <div class="navbar-menu">
      <router-link to="/agent" class="nav-item" :class="{ active: $route.path === '/agent' }">
        <span class="nav-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.75 3.375H2.25C1.83579 3.375 1.5 3.71079 1.5 4.125V13.875C1.5 14.2892 1.83579 14.625 2.25 14.625H15.75C16.1642 14.625 16.5 14.2892 16.5 13.875V4.125C16.5 3.71079 16.1642 3.375 15.75 3.375Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.5 8.25H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.5 11.25H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>{{ $t('agent.navbar.dashboard') }}</span>
      </router-link>
      <router-link to="/agent/video" class="nav-item" :class="{ active: $route.path === '/agent/video' }">
        <span class="nav-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.25 12L11.25 9.75L8.25 7.5V12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>{{ $t('agent.navbar.video') }}</span>
      </router-link>
      <router-link to="/agent/setcamera" class="nav-item" :class="{ active: $route.path === '/agent/setcamera' }">
        <span class="nav-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.25 9C14.25 11.933 11.933 14.25 9 14.25C6.06701 14.25 3.75 11.933 3.75 9C3.75 6.06701 6.06701 3.75 9 3.75C11.933 3.75 14.25 6.06701 14.25 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 7.5V9L10.125 10.125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 15.75V16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.75 9H16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.25 9H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 2.25V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.0902 4.90979L13.7574 5.57698" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.90979 13.0902L5.57698 13.7574" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.0902 13.0902L13.7574 12.423" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.90979 4.90979L5.57698 4.2426" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>{{ $t('agent.navbar.camera') }}</span>
      </router-link>
      <router-link to="/agent/service" class="nav-item" :class="{ active: $route.path === '/agent/service' }">
        <span class="nav-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 7.5H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.5 4.5V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.5 4.5V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>{{ $t('agent.navbar.service') }}</span>
      </router-link>
      <router-link to="/agent/set" class="nav-item" :class="{ active: $route.path === '/agent/set' }">
        <span class="nav-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4.5C10.933 4.5 12.5 6.06701 12.5 8.00001C12.5 9.93301 10.933 11.5 9 11.5C7.06701 11.5 5.5 9.93301 5.5 8.00001C5.5 6.06701 7.06701 4.5 9 4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 13.5C11.4853 13.5 13.5 11.4853 13.5 9C13.5 6.51472 11.4853 4.5 9 4.5C6.51472 4.5 4.5 6.51472 4.5 9C4.5 11.4853 6.51472 13.5 9 13.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>{{ $t('agent.navbar.settings') }}</span>
      </router-link>
    </div>
    <div class="navbar-actions">
      <div class="settings-dropdown">
        <button class="action-btn settings-btn" @click="toggleSettingsDropdown">
          <span class="btn-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3.33334C10.5785 3.33334 12.6667 5.42155 12.6667 8.00004C12.6667 10.5785 10.5785 12.6667 8 12.6667C5.42155 12.6667 3.33334 10.5785 3.33334 8.00004C3.33334 5.42155 5.42155 3.33334 8 3.33334Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 1V2.66667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 13.3333V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.3333 8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 8H2.66667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11.5 4.5L12.2929 5.29289" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.70711 10.7071L4.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11.5 11.5L12.2929 10.7071" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.70711 5.29289L4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span>{{ $t('agent.navbar.settingsBtn') }}</span>
        </button>
        <div class="dropdown-menu" v-if="showSettingsDropdown">
          <LanguageSwitcher @language-changed="closeSettingsDropdown" />
        </div>
      </div>
      <router-link to="/" class="action-btn home-btn">
        <span class="btn-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1.33334L1.33333 6.66668V13.3333C1.33333 13.7773 1.48333 14.2053 1.75 14.5417C2.01667 14.878 2.37733 15.1167 2.8 15.2333L8 16L13.2 15.2333C13.6227 15.1167 13.9833 14.878 14.25 14.5417C14.5167 14.2053 14.6667 13.7773 14.6667 13.3333V6.66668L8 1.33334Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 6.66668V13.3333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 6.66668H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>{{ $t('agent.navbar.home') }}</span>
      </router-link>
      <button class="action-btn logout-btn" @click="showLogoutConfirm">
        <span class="btn-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6667 12.6667H13.3333V3.33334H10.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 9.33334L4 5.33334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 9.33334L8 5.33334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span>{{ $t('agent.navbar.logout') }}</span>
      </button>
    </div>
    
    <!-- 自定义退出登录确认框 -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="cancelLogout">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('agent.navbar.logout') }}</h3>
          <button class="close-btn" @click="cancelLogout">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ $t('agent.navbar.logoutConfirm') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="cancelLogout">{{ $t('agent.navbar.cancel') }}</button>
          <button class="btn btn-confirm" @click="confirmLogout">{{ $t('agent.navbar.confirm') }}</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue';

export default {
  name: 'AgentNavbar',
  components: {
    LanguageSwitcher
  },
  data() {
    return {
      showLogoutModal: false,
      showSettingsDropdown: false
    };
  },
  methods: {
    showLogoutConfirm() {
      this.showLogoutModal = true;
    },
    cancelLogout() {
      this.showLogoutModal = false;
    },
    confirmLogout() {
      // 清除登录状态
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      // 跳转到登录页面
      this.$router.push('/login');
    },
    toggleSettingsDropdown() {
      this.showSettingsDropdown = !this.showSettingsDropdown;
    },
    closeSettingsDropdown() {
      this.showSettingsDropdown = false;
    }
  }
};
</script>

<style scoped>
/* 阿里云风格导航栏 */
.agent-navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* 品牌区域 */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-brand h2 {
  font-size: 18px;
  color: #1890FF;
  margin: 0;
  font-weight: 600;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 导航菜单 */
.navbar-menu {
  display: flex;
  gap: 4px;
  flex: 1;
  justify-content: center;
  max-width: 800px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.nav-item:hover {
  background-color: #f0f7ff;
  color: #1890FF;
}

.nav-item.active {
  background-color: #e6f7ff;
  color: #1890FF;
  border-bottom: 2px solid #1890FF;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 操作区域 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px 0;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
  background-color: white;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  cursor: pointer;
}

.action-btn:hover {
  border-color: #1890FF;
  color: #1890FF;
  background-color: #f0f7ff;
}

.home-btn:hover {
  border-color: #1890FF;
  color: #1890FF;
}

.logout-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
  background-color: #fff1f0;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .nav-item span:not(.nav-icon) {
    display: none;
  }
  
  .nav-item {
    padding: 8px;
    border-radius: 4px;
    width: 36px;
    height: 36px;
    justify-content: center;
  }
  
  .action-btn span:not(.btn-icon) {
    display: none;
  }
  
  .action-btn {
    padding: 8px;
    border-radius: 4px;
    width: 36px;
    height: 36px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .agent-navbar {
    padding: 0 16px;
  }
  
  .navbar-brand h2 {
    font-size: 16px;
  }
  
  .navbar-menu {
    gap: 2px;
  }
  
  .nav-item {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

/* 退出登录确认框样式 */
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
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333333;
  font-weight: 600;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #999999;
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
  background-color: #f5f5f5;
  color: #333333;
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.modal-body p {
  margin: 0;
  font-size: 14px;
  color: #333333;
  line-height: 1.5;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.modal-footer {
  padding: 16px 24px;
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
  color: #333333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.btn-cancel:hover {
  border-color: #1890FF;
  color: #1890FF;
}

.btn-confirm {
  background-color: #ff4d4f;
  color: white;
  border-color: #ff4d4f;
}

.btn-confirm:hover {
  background-color: #ff7875;
  border-color: #ff7875;
}
</style>