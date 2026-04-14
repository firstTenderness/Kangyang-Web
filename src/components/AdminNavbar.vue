<template>
  <nav class="admin-navbar">
    <div class="navbar-brand">
      <h2>{{ $t('admin.navbar.title') }}</h2>
    </div>
    <div class="navbar-menu">
      <router-link to="/admin" class="nav-item" :class="{ active: $route.path === '/admin' || $route.path === '/admin/' }">
        <span class="nav-icon">📊</span>
        <span>{{ $t('admin.navbar.dashboard') }}</span>
      </router-link>
      <router-link to="/admin/users" class="nav-item" :class="{ active: $route.path === '/admin/users' || $route.path === '/admin/users/' }">
        <span class="nav-icon">👥</span>
        <span>{{ $t('admin.navbar.users') }}</span>
      </router-link>
      <router-link to="/admin/plans" class="nav-item" :class="{ active: $route.path === '/admin/plans' || $route.path === '/admin/plans/' }">
        <span class="nav-icon">💼</span>
        <span>{{ $t('admin.navbar.plans') }}</span>
      </router-link>
      <router-link to="/admin/notification" class="nav-item" :class="{ active: $route.path === '/admin/notification' || $route.path === '/admin/notification/' }">
        <span class="nav-icon">🔔</span>
        <span>{{ $t('admin.navbar.notifications') }}</span>
      </router-link>
      <router-link to="/admin/card" class="nav-item" :class="{ active: $route.path === '/admin/card' || $route.path === '/admin/card/' }">
        <span class="nav-icon">💳</span>
        <span>{{ $t('admin.navbar.cards') }}</span>
      </router-link>
      <router-link to="/admin/monitoring" class="nav-item" :class="{ active: $route.path === '/admin/monitoring' || $route.path === '/admin/monitoring/' }">
        <span class="nav-icon">📹</span>
        <span>{{ $t('admin.navbar.monitoring') }}</span>
      </router-link>
      <router-link to="/admin/settings" class="nav-item" :class="{ active: $route.path === '/admin/settings' || $route.path === '/admin/settings/' }">
        <span class="nav-icon">⚙️</span>
        <span>{{ $t('admin.navbar.settings') }}</span>
      </router-link>
    </div>
    <div class="navbar-actions">
      <div class="settings-dropdown">
        <button class="action-btn settings-btn" @click="toggleSettingsDropdown">
          <span class="btn-icon">⚙️</span>
          <span>{{ $t('admin.navbar.settingsBtn') }}</span>
        </button>
        <div class="dropdown-menu" v-if="showSettingsDropdown">
          <LanguageSwitcher @language-changed="closeSettingsDropdown" />
        </div>
      </div>
      <button class="action-btn logout-btn" @click="showLogoutConfirm">
        <span class="btn-icon">🚪</span>
        <span>{{ $t('admin.navbar.logout') }}</span>
      </button>
    </div>
    
    <!-- 自定义退出登录确认框 -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="cancelLogout">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('admin.navbar.logout') }}</h3>
          <button class="close-btn" @click="cancelLogout">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ $t('admin.navbar.logoutConfirm') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="cancelLogout">{{ $t('admin.navbar.cancel') }}</button>
          <button class="btn btn-confirm" @click="confirmLogout">{{ $t('admin.navbar.confirm') }}</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue';

export default {
  name: 'AdminNavbar',
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
      localStorage.removeItem('adminLoggedIn');
      // 跳转到登录页面
      this.$router.push('/admin/login');
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
.admin-navbar {
  background-color: #2c3e50;
  border-bottom: 1px solid #34495e;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 0 30px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-brand h2 {
  font-size: 18px;
  color: white;
  margin: 0;
  font-weight: 600;
}

.navbar-menu {
  display: flex;
  gap: 20px;
  flex: 1;
  justify-content: center;
  max-width: 1000px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  color: #bdc3c7;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.nav-item:hover {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.nav-item.active {
  background-color: #3498db;
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.nav-item.active:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 16px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.settings-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: #2c3e50;
  border: 1px solid #34495e;
  border-radius: 8px;
  padding: 10px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
}

/* 菜单样式增强 */
.dropdown-menu {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border: 1px solid #4a637b;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

/* 移动端下拉菜单大小调整 */
@media (max-width: 768px) {
  .dropdown-menu {
    min-width: 160px;
    padding: 8px;
    margin-top: 6px;
  }
  
  /* 移动端菜单样式调整 */
  .dropdown-menu {
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.settings-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #3498db;
  color: #3498db;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  color: #bdc3c7;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #34495e;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #3498db;
  color: #3498db;
}

.logout-btn:hover {
  background-color: rgba(231, 76, 60, 0.2);
  border-color: #e74c3c;
  color: #e74c3c;
}

.btn-icon {
  font-size: 16px;
}

@media (max-width: 1200px) {
  .nav-item span:not(.nav-icon) {
    display: none;
  }
  
  .nav-item {
    padding: 10px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    justify-content: center;
  }
  
  .action-btn span:not(.btn-icon) {
    display: none;
  }
  
  .action-btn {
    padding: 10px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .navbar-brand h2 {
    display: none;
  }
  
  .navbar-menu {
    gap: 8px;
  }
  
  .nav-item {
    width: 34px;
    height: 34px;
    font-size: 13px;
  }
  
  .action-btn {
    width: 34px;
    height: 34px;
    font-size: 13px;
  }
  
  .admin-navbar {
    padding: 0 15px;
  }
  

}

/* 自定义退出登录确认框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2c3e50;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border: 1px solid #34495e;
}

.modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #34495e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: white;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #bdc3c7;
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
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-body {
  padding: 25px;
  text-align: center;
}

.modal-body p {
  margin: 0;
  font-size: 16px;
  color: #ecf0f1;
}

.modal-footer {
  padding: 20px 25px;
  border-top: 1px solid #34495e;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: 1px solid #34495e;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #bdc3c7;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.btn-cancel:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #34495e;
  color: white;
}

.btn-confirm {
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.btn-confirm:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}
</style>