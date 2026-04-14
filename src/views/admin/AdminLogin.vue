<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">{{ $t('admin.login.title') }}</h1>
        <p class="login-subtitle">{{ $t('admin.login.subtitle') }}</p>
      </div>
      <div class="login-form">
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">{{ $t('admin.login.username') }}</label>
            <input 
              type="text" 
              id="username" 
              v-model="loginForm.username" 
              :placeholder="$t('admin.login.enterUsername')" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="password">{{ $t('admin.login.password') }}</label>
            <input 
              type="password" 
              id="password" 
              v-model="loginForm.password" 
              :placeholder="$t('admin.login.enterPassword')" 
              required 
            />
          </div>
          <div class="form-group remember">
            <input type="checkbox" id="remember" v-model="loginForm.remember" />
            <label for="remember">{{ $t('admin.login.remember') }}</label>
          </div>
          <button type="submit" class="login-btn">{{ $t('admin.login.loginBtn') }}</button>
        </form>
      </div>
      <div class="login-footer">
        <p>{{ $t('admin.login.copyright') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import apiService from '../../services/api.js';

const { t } = useI18n();
const router = useRouter();
const loginForm = ref({
  username: '',
  password: '',
  remember: false
});
const loading = ref(false);

// 检查登录状态
const checkLoginStatus = () => {
  // 检查是否已登录管理员账号
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    router.push('/admin');
  }
};

// 登录方法
const login = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert(t('admin.login.enterBoth'));
    return;
  }

  try {
    loading.value = true;
    
    // 发送登录请求
    const data = await apiService.post('/admin/auth/login', {
      username: loginForm.value.username,
      password: loginForm.value.password,
      remember: loginForm.value.remember
    });

    if (data.code === 200) {
      // 登录成功，保存token
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminLoggedIn', 'true');
      // 跳转到管理端首页
      router.push('/admin');
    } else {
      alert(t('admin.login.loginFailed') + data.message);
    }
  } catch (error) {
    console.error('登录失败:', error);
    alert(t('admin.login.loginCheckFailed'));
  } finally {
    loading.value = false;
  }
};

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus();
});
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-group.remember {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group.remember input {
  width: auto;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

.login-btn:hover {
  opacity: 0.9;
}

.login-footer {
  text-align: center;
  font-size: 12px;
  color: #999;
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
}
</style>