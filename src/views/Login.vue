<template>
  <div id="login-app" class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 font-sans text-gray-800">
    <!-- 导航栏 -->
    <header class="fixed w-full bg-white/95 shadow-sm z-50 transition-all duration-300">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <i class="fa fa-heartbeat text-blue-600 text-2xl mr-2"></i>
            <span class="text-xl font-bold text-blue-600">{{ $t('footer.company') }}</span>
            <span class="text-sm text-gray-500 ml-1 hidden md:block">{{ $t('footer.slogan') }}</span>
          </div>
          
          <!-- 右侧：语言切换和首页按钮 -->
          <div class="flex items-center space-x-4">
            <!-- 语言切换下拉菜单 -->
            <div class="language-dropdown">
              <button class="language-dropdown-toggle" @click="toggleLanguageDropdown">
                <i class="fa fa-globe mr-2"></i>
                <span>{{ currentLang === 'zh' ? '中文' : 'English' }}</span>
                <i class="fa fa-chevron-down ml-2"></i>
              </button>
              <div class="language-dropdown-menu" v-if="languageDropdownOpen">
                <button 
                  class="language-dropdown-item" 
                  :class="{ 'active': currentLang === 'zh' }"
                  @click="switchLanguage('zh'); toggleLanguageDropdown()"
                >
                  中文
                </button>
                <button 
                  class="language-dropdown-item" 
                  :class="{ 'active': currentLang === 'en' }"
                  @click="switchLanguage('en'); toggleLanguageDropdown()"
                >
                  English
                </button>
              </div>
            </div>
            
            <!-- 返回首页按钮 -->
             <router-link to="/home" class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <i class="fa fa-home mr-2"></i>{{ $t('common.home') }}
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="pt-24 pb-16 md:pt-32 md:pb-24 min-h-screen">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <!-- 欢迎标题 -->
          <div class="text-center mb-12">
            <h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{{ $t('loginPage.welcome') }}</h1>
            <p class="text-gray-600 max-w-2xl mx-auto">{{ $t('loginPage.welcomeSubtitle') }}</p>
          </div>
          
          <!-- 主要内容区域 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- 左侧：宣传信息 -->
            <div class="hidden lg:block">
              <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div class="mb-8">
                  <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa fa-heartbeat text-blue-600 text-3xl"></i>
                  </div>
                  <h2 class="text-2xl font-bold text-center mb-4 text-gray-800">{{ $t('loginPage.sectionTitle') }}</h2>
                  <p class="text-gray-600 text-center mb-6">
                    {{ $t('loginPage.sectionSubtitle') }}
                  </p>
                </div>
                
                <!-- 特色功能列表 -->
                <div class="space-y-4">
                  <div class="flex items-center bg-gray-50 p-4 rounded-lg">
                    <div class="bg-blue-100 p-2 rounded-full mr-4">
                      <i class="fa fa-check text-blue-600"></i>
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-800">{{ $t('loginPage.features.aiRecognition.title') }}</h4>
                      <p class="text-sm text-gray-600">{{ $t('loginPage.features.aiRecognition.description') }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center bg-gray-50 p-4 rounded-lg">
                    <div class="bg-blue-100 p-2 rounded-full mr-4">
                      <i class="fa fa-check text-blue-600"></i>
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-800">{{ $t('loginPage.features.multiAlert.title') }}</h4>
                      <p class="text-sm text-gray-600">{{ $t('loginPage.features.multiAlert.description') }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center bg-gray-50 p-4 rounded-lg">
                    <div class="bg-blue-100 p-2 rounded-full mr-4">
                      <i class="fa fa-check text-blue-600"></i>
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-800">{{ $t('loginPage.features.emergency.title') }}</h4>
                      <p class="text-sm text-gray-600">{{ $t('loginPage.features.emergency.description') }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- 统计数据 -->
                <div class="mt-8 pt-8 border-t border-gray-200">
                  <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div class="text-2xl font-bold text-blue-600">1,258+</div>
                      <div class="text-sm text-gray-500">{{ $t('loginPage.stats.elderly') }}</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-green-600">98.7%</div>
                      <div class="text-sm text-gray-500">{{ $t('loginPage.stats.satisfaction') }}</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-orange-600">50+</div>
                      <div class="text-sm text-gray-500">{{ $t('loginPage.stats.institutions') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右侧：登录/注册表单 -->
            <div>
              <!-- 切换选项卡 -->
              <div class="flex border-b border-gray-200 mb-8">
                <button 
                  class="flex-1 py-4 text-center font-medium text-lg transition-colors"
                  :class="activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'"
                  @click="activeTab = 'login'"
                >
                  {{ $t('login.title') }}
                </button>
                <button 
                  class="flex-1 py-4 text-center font-medium text-lg transition-colors"
                  :class="activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'"
                  @click="activeTab = 'register'"
                >
                  {{ $t('register.title') }}
                </button>
              </div>
              
              <!-- 登录表单 -->
              <div v-if="activeTab === 'login'" class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ $t('login.title') }}</h2>
                
                <form @submit.prevent="handleLogin" class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium mb-2 text-gray-700" for="login-username">{{ $t('login.phone') }}</label>
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="fa fa-phone"></i>
                      </div>
                      <input 
                        type="tel" 
                        id="login-username" 
                        v-model="loginForm.username"
                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        :placeholder="$t('login.phone')"
                        required
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2 text-gray-700" for="login-password">{{ $t('login.password') }}</label>
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="fa fa-lock"></i>
                      </div>
                      <input 
                        :type="showLoginPassword ? 'text' : 'password'" 
                        id="login-password" 
                        v-model="loginForm.password"
                        class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        :placeholder="$t('login.password')"
                        required
                      >
                      <button 
                        type="button" 
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        @click="showLoginPassword = !showLoginPassword"
                      >
                        <i :class="showLoginPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remember-me" 
                        v-model="loginForm.remember"
                        class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      >
                      <label for="remember-me" class="ml-2 text-sm text-gray-600">{{ $t('login.remember') }}</label>
                    </div>
                    <button type="button" class="text-sm text-blue-600 hover:text-blue-800 font-medium" @click="showForgotPassword = true">
                      {{ $t('login.forgot') }}
                    </button>
                  </div>
                  
                  <div>
                    <button 
                      type="submit" 
                      class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center justify-center"
                      :disabled="isLoggingIn"
                    >
                      <i v-if="isLoggingIn" class="fa fa-spinner fa-spin mr-2"></i>
                      <span v-else><i class="fa fa-sign-in mr-2"></i>{{ $t('login.title') }}</span>
                    </button>
                  </div>
                  
                  <!-- 第三方登录 -->
                  <div class="pt-6 border-t border-gray-200">
                    <p class="text-center text-gray-600 mb-4">{{ $t('login.thirdParty') }}</p>
                    <div class="flex justify-center space-x-4">
                      <button type="button" class="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors" @click="handleThirdPartyLogin('weixin')">
                        <i class="fa fa-weixin"></i>
                      </button>
                      <button type="button" class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors" @click="handleThirdPartyLogin('qq')">
                        <i class="fa fa-qq"></i>
                      </button>
                      <button type="button" class="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors" @click="handleThirdPartyLogin('weibo')">
                        <i class="fa fa-weibo"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              
              <!-- 注册表单 -->
              <div v-if="activeTab === 'register'" class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ $t('register.title') }}</h2>
                
                <form @submit.prevent="handleRegister" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium mb-2 text-gray-700" for="register-firstname">{{ $t('loginPage.form.firstName') }}</label>
                      <input 
                        type="text" 
                        id="register-firstname" 
                        v-model="registerForm.firstName"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        :placeholder="$t('loginPage.form.firstNamePlaceholder')"
                        required
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium mb-2 text-gray-700" for="register-lastname">{{ $t('loginPage.form.lastName') }}</label>
                      <input 
                        type="text" 
                        id="register-lastname" 
                        v-model="registerForm.lastName"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        :placeholder="$t('loginPage.form.lastNamePlaceholder')"
                        required
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2 text-gray-700" for="register-phone">{{ $t('register.phone') }}</label>
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="fa fa-phone"></i>
                      </div>
                      <input 
                        type="tel" 
                        id="register-phone" 
                        v-model="registerForm.phone"
                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        :placeholder="$t('register.phone')"
                        required
                        pattern="[0-9]{11}"
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2 text-gray-700" for="register-email">{{ $t('register.email') }} <span class="text-gray-500 text-xs">({{ currentLang === 'zh' ? '可选' : 'Optional' }})</span></label>
                    <div class="relative">
                      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="fa fa-envelope"></i>
                      </div>
                      <input 
                        type="email" 
                        id="register-email" 
                        v-model="registerForm.email"
                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        :placeholder="$t('register.email')"
                      >
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium mb-2 text-gray-700" for="register-password">{{ $t('register.password') }}</label>
                      <div class="relative">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <i class="fa fa-lock"></i>
                        </div>
                        <input 
                          :type="showRegisterPassword ? 'text' : 'password'" 
                          id="register-password" 
                          v-model="registerForm.password"
                          class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                          :placeholder="$t('register.password')"
                          required
                          minlength="6"
                        >
                        <button 
                          type="button" 
                          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          @click="showRegisterPassword = !showRegisterPassword"
                        >
                          <i :class="showRegisterPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium mb-2 text-gray-700" for="register-confirm-password">{{ $t('register.confirmPassword') }}</label>
                      <div class="relative">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <i class="fa fa-lock"></i>
                        </div>
                        <input 
                          :type="showConfirmPassword ? 'text' : 'password'" 
                          id="register-confirm-password" 
                          v-model="registerForm.confirmPassword"
                          class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                          :placeholder="$t('register.confirmPassword')"
                          required
                        >
                        <button 
                          type="button" 
                          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          @click="showConfirmPassword = !showConfirmPassword"
                        >
                          <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      id="accept-terms" 
                      v-model="registerForm.acceptTerms"
                      class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      required
                    >
                    <label for="accept-terms" class="ml-2 text-sm text-gray-600">
                      {{ $t('register.agreement') }}
                      <button type="button" class="text-blue-600 hover:text-blue-800" @click="openAgreementModal('terms')">{{ $t('register.userAgreement') }}</button>
                      {{ $t('common.and') }}
                      <button type="button" class="text-blue-600 hover:text-blue-800" @click="openAgreementModal('privacy')">{{ $t('register.privacyPolicy') }}</button>
                    </label>
                  </div>
                  
                  <div>
                    <button 
                      type="submit" 
                      class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg flex items-center justify-center"
                      :disabled="isRegistering"
                    >
                      <i v-if="isRegistering" class="fa fa-spinner fa-spin mr-2"></i>
                      <span v-else><i class="fa fa-user-plus mr-2"></i>{{ $t('register.title') }}</span>
                    </button>
                  </div>
                  
                  <div class="text-center text-sm text-gray-600">
                    {{ $t('register.login') }}？ 
                    <button type="button" class="text-blue-600 hover:text-blue-800 font-medium" @click="activeTab = 'login'">
                      {{ $t('login.title') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div class="flex items-center mb-4">
              <i class="fa fa-heartbeat text-blue-400 text-2xl mr-2"></i>
              <span class="text-xl font-bold">{{ $t('loginPage.footer.company') }}</span>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              {{ $t('loginPage.footer.slogan') }}
            </p>
          </div>
          
          <div>
            <h4 class="font-medium mb-4">{{ $t('loginPage.footer.contact') }}</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li class="flex items-start">
                <i class="fa fa-phone mr-2 mt-1"></i>
                <span>{{ $t('loginPage.footer.phone') }}</span>
              </li>
              <li class="flex items-start">
                <i class="fa fa-envelope mr-2 mt-1"></i>
                <span>{{ $t('loginPage.footer.email') }}</span>
              </li>
              <li class="flex items-start">
                <i class="fa fa-map-marker mr-2 mt-1"></i>
                <span>{{ $t('loginPage.footer.address') }}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-medium mb-4">{{ $t('loginPage.footer.follow') }}</h4>
            <div class="flex space-x-4">
              <button class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-weixin text-xl"></i>
              </button>
              <button class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-weibo text-xl"></i>
              </button>
              <button class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-qq text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>{{ $t('loginPage.footer.copyright') }}</p>
        </div>
      </div>
    </footer>

    <!-- 忘记密码弹窗 -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all" @click.stop>
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-800">{{ $t('loginPage.forgotPassword.title') }}</h3>
            <button @click="showForgotPassword = false" class="text-gray-400 hover:text-gray-600">
              <i class="fa fa-times"></i>
            </button>
          </div>
          
          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700" for="forgot-email">{{ $t('loginPage.forgotPassword.email') }}</label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <i class="fa fa-envelope"></i>
                </div>
                <input 
                  type="email" 
                  id="forgot-email" 
                  v-model="forgotPasswordForm.email"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  :placeholder="$t('loginPage.forgotPassword.emailPlaceholder')"
                  required
                >
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                :disabled="isSendingResetLink"
              >
                <i v-if="isSendingResetLink" class="fa fa-spinner fa-spin mr-2"></i>
                <span v-else>{{ $t('loginPage.forgotPassword.button') }}</span>
              </button>
            </div>
            
            <p class="text-sm text-gray-600 text-center">
              {{ $t('loginPage.forgotPassword.message') }}
            </p>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 自定义消息提示框 -->
    <div v-if="showMessage" class="fixed top-6 right-6 z-50 max-w-sm">
      <div class="flex items-center p-4 rounded-lg shadow-lg" :class="{
        'bg-blue-100 text-blue-800': messageType === 'info',
        'bg-green-100 text-green-800': messageType === 'success',
        'bg-red-100 text-red-800': messageType === 'error'
      }">
        <div class="flex-shrink-0">
          <i v-if="messageType === 'info'" class="fa fa-info-circle text-xl"></i>
          <i v-else-if="messageType === 'success'" class="fa fa-check-circle text-xl"></i>
          <i v-else-if="messageType === 'error'" class="fa fa-exclamation-circle text-xl"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">{{ messageText }}</p>
        </div>
        <button class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" @click="showMessage = false">
          <span class="sr-only">关闭</span>
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>

    <!-- 协议弹窗 -->
    <div v-if="showAgreementModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all" @click.stop>
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-800">{{ agreementTitle }}</h3>
            <button @click="showAgreementModal = false" class="text-gray-400 hover:text-gray-600">
              <i class="fa fa-times"></i>
            </button>
          </div>
          
          <div class="max-h-96 overflow-y-auto pr-2">
            <div v-if="agreementType === 'terms'" class="text-gray-700 space-y-4">
              <h4 class="font-bold text-lg">1. 协议的接受</h4>
              <p>欢迎使用康养云端智慧老人安全监护平台（以下简称"本平台"）。本用户协议（以下简称"本协议"）是您与本平台之间关于使用本平台服务所订立的协议。</p>
              <p>您在注册或使用本平台服务前，应当仔细阅读并理解本协议的全部内容。您点击"同意"或使用本平台服务的行为，即表示您已同意接受本协议的约束。</p>
              
              <h4 class="font-bold text-lg">2. 用户注册与账号管理</h4>
              <p>2.1 您应当提供真实、准确、完整的个人信息，并在信息变更时及时更新。</p>
              <p>2.2 您应当妥善保管账号及密码，对使用您账号进行的所有操作承担责任。</p>
              <p>2.3 如发现账号被他人非法使用，您应当立即通知本平台。</p>
              
              <h4 class="font-bold text-lg">3. 服务内容与使用规则</h4>
              <p>3.1 本平台提供智慧老人安全监护相关服务，包括但不限于异常行为识别、多渠道预警、应急处置等。</p>
              <p>3.2 您应当按照本平台的要求使用服务，不得利用本平台从事违法违规活动。</p>
              <p>3.3 您应当遵守法律法规，尊重他人合法权益，不得侵犯他人隐私。</p>
              
              <h4 class="font-bold text-lg">4. 隐私保护</h4>
              <p>本平台重视用户隐私保护，将按照《隐私政策》的规定处理您的个人信息。</p>
              
              <h4 class="font-bold text-lg">5. 协议的变更与终止</h4>
              <p>5.1 本平台有权根据法律法规的变更或业务发展需要修改本协议。</p>
              <p>5.2 如您违反本协议的规定，本平台有权终止向您提供服务。</p>
              
              <h4 class="font-bold text-lg">6. 免责声明</h4>
              <p>本平台仅提供技术服务，不承担因使用本平台服务而产生的任何直接或间接损失。</p>
              
              <h4 class="font-bold text-lg">7. 法律适用与争议解决</h4>
              <p>本协议的订立、执行、解释及争议的解决均适用中华人民共和国法律。</p>
              <p>如发生争议，双方应协商解决；协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼。</p>
            </div>
            
            <div v-else-if="agreementType === 'privacy'" class="text-gray-700 space-y-4">
              <h4 class="font-bold text-lg">1. 隐私政策的适用范围</h4>
              <p>本隐私政策适用于本平台收集、使用、存储和共享您的个人信息的行为。</p>
              
              <h4 class="font-bold text-lg">2. 收集的信息</h4>
              <p>2.1 您在注册或使用本平台服务时提供的个人信息，如姓名、手机号、邮箱等。</p>
              <p>2.2 您使用本平台服务时产生的信息，如登录记录、操作记录等。</p>
              <p>2.3 监控设备收集的信息，如老人的活动状态、异常行为等。</p>
              
              <h4 class="font-bold text-lg">3. 信息的使用</h4>
              <p>3.1 用于提供、维护和改进本平台服务。</p>
              <p>3.2 用于向您发送服务相关的通知。</p>
              <p>3.3 用于分析和统计，以提升服务质量。</p>
              
              <h4 class="font-bold text-lg">4. 信息的共享</h4>
              <p>4.1 未经您的同意，本平台不会向第三方共享您的个人信息。</p>
              <p>4.2 法律、法规要求或政府部门要求的除外。</p>
              
              <h4 class="font-bold text-lg">5. 信息的保护</h4>
              <p>本平台采取多种安全措施保护您的个人信息，防止信息泄露、丢失或被滥用。</p>
              
              <h4 class="font-bold text-lg">6. 您的权利</h4>
              <p>6.1 您有权访问、修改和删除您的个人信息。</p>
              <p>6.2 您有权拒绝本平台收集和使用您的个人信息，但可能会影响部分服务的使用。</p>
              
              <h4 class="font-bold text-lg">7. 隐私政策的变更</h4>
              <p>本平台有权根据法律法规的变更或业务发展需要修改本隐私政策。</p>
            </div>
          </div>
          
          <div class="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <button @click="showAgreementModal = false" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t('loginPage.agreement.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      // 响应式数据
      activeTab: 'login',
      showLoginPassword: false,
      showRegisterPassword: false,
      showConfirmPassword: false,
      showForgotPassword: false,
      isLoggingIn: false,
      isRegistering: false,
      isSendingResetLink: false,
      currentLang: this.$i18n.locale,
      languageDropdownOpen: false,
      
      // 表单数据
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      registerForm: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      forgotPasswordForm: {
        email: ''
      },
      
      // 消息提示框状态
      showMessage: false,
      messageText: '',
      messageType: 'info', // info, success, error
      
      // 协议弹窗状态
      showAgreementModal: false,
      agreementType: 'terms', // terms, privacy
      agreementTitle: '用户协议'
    }
  },
  computed: {
    fullName() {
      return `${this.registerForm.firstName}${this.registerForm.lastName}`
    },
    passwordMatch() {
      return this.registerForm.password === this.registerForm.confirmPassword
    }
  },
  mounted() {
    // 组件加载时检查登录状态
    this.checkLoginStatus()
  },
  methods: {
    // 检查登录状态，如果已登录则跳转到用户端界面
    checkLoginStatus() {
      const isUserLoggedIn = localStorage.getItem('userLoggedIn')
      if (isUserLoggedIn) {
        // 已登录，跳转到用户端界面
        this.$router.push('/agent')
      }
    },
    
    // 显示自定义消息提示框
    showCustomMessage(text, type = 'info') {
      this.messageText = text
      this.messageType = type
      this.showMessage = true
      
      // 3秒后自动关闭
      setTimeout(() => {
        this.showMessage = false
      }, 3000)
    },
    
    // 登录方法
    async handleLogin() {
      this.isLoggingIn = true
      
      try {
        console.log('=== 开始登录 ===')
        console.log('登录表单数据:', this.loginForm)
        
        const result = await this.$api.post('/auth/login', this.loginForm)
        console.log('登录API响应:', result)
        
        if (result.code === 200) {
          console.log('登录成功，用户信息:', result.data)
          console.log('用户token:', result.data.token)
          
          this.showCustomMessage(this.$t('loginPage.messages.loginSuccess', { username: result.data.username || this.$t('common.user') }), 'success')
          
          // 清除旧的登录状态
          localStorage.removeItem('userLoggedIn')
          localStorage.removeItem('userToken')
          localStorage.removeItem('userId')
          console.log('已清除旧的登录状态')
          
          // 设置用户登录状态
          localStorage.setItem('userLoggedIn', 'true')
          localStorage.setItem('userToken', result.data.token)
          localStorage.setItem('userId', result.data.id || '')
          console.log('已保存新用户的登录状态、token和用户ID')
          console.log('用户ID:', result.data.id)
          
          // 验证保存是否成功
          const savedToken = localStorage.getItem('userToken')
          console.log('保存的token:', savedToken)
          
          // 延时跳转到用户界面，让用户有时间看到登录成功的提示
          console.log('跳转到用户界面...')
          setTimeout(() => {
            this.$router.push('/agent')
          }, 1000)
        } else {
          console.error('登录失败:', result.message)
          let errorMessage = result.message
          // 处理常见的中文错误消息，转换为对应的翻译键
          if (errorMessage.includes('密码错误')) {
            errorMessage = this.$t('loginPage.messages.loginPasswordError')
          } else if (errorMessage.includes('用户不存在')) {
            errorMessage = this.$t('loginPage.messages.loginUserNotFound')
          }
          this.showCustomMessage(errorMessage || this.$t('loginPage.messages.loginError'), 'error')
        }
      } catch (error) {
        console.error('登录异常:', error)
        this.showCustomMessage(this.$t('loginPage.messages.loginError'), 'error')
      } finally {
        this.isLoggingIn = false
        console.log('=== 登录流程结束 ===')
      }
    },
    
    // 注册方法
    async handleRegister() {
      // 验证表单
      if (!this.passwordMatch) {
        this.showCustomMessage(this.$t('loginPage.messages.registerPasswordError'), 'error')
        return
      }
      
      if (!this.registerForm.acceptTerms) {
        this.showCustomMessage(this.$t('loginPage.messages.registerTermsError'), 'error')
        return
      }
      
      this.isRegistering = true
      
      try {
        const result = await this.$api.post('/auth/register', this.registerForm)
        if (result.code === 200) {
          this.showCustomMessage(this.$t('loginPage.messages.registerSuccess', { fullName: this.fullName }), 'success')
          
          // 切换到登录标签
          this.activeTab = 'login'
          
          // 清空注册表单
          Object.keys(this.registerForm).forEach(key => {
            this.registerForm[key] = ''
          })
          this.registerForm.acceptTerms = false
        } else {
          this.showCustomMessage(result.message || this.$t('loginPage.messages.registerError'), 'error')
        }
      } catch (error) {
        console.error('注册失败:', error)
        this.showCustomMessage(this.$t('loginPage.messages.registerError'), 'error')
      } finally {
        this.isRegistering = false
      }
    },
    
    // 忘记密码方法
    async handleForgotPassword() {
      this.isSendingResetLink = true
      
      try {
        const result = await this.$api.post('/auth/forgot-password', this.forgotPasswordForm)
        if (result.code === 200) {
          this.showCustomMessage(this.$t('loginPage.messages.forgotPasswordSuccess', { email: this.forgotPasswordForm.email }), 'success')
          
          // 关闭弹窗
          this.showForgotPassword = false
          this.forgotPasswordForm.email = ''
        } else {
          this.showCustomMessage(result.message || this.$t('loginPage.messages.forgotPasswordError'), 'error')
        }
      } catch (error) {
        console.error('发送重置链接失败:', error)
        this.showCustomMessage(this.$t('loginPage.messages.forgotPasswordError'), 'error')
      } finally {
        this.isSendingResetLink = false
      }
    },
    
    // 第三方登录处理
    async handleThirdPartyLogin(platform) {
      // 显示暂未开放第三方登录的提示
      this.showCustomMessage(this.$t('loginPage.thirdPartyNotAvailable'), 'info')
    },
    
    // 打开协议弹窗
    openAgreementModal(type) {
      this.agreementType = type
      this.agreementTitle = type === 'terms' ? this.$t('loginPage.agreement.terms') : this.$t('loginPage.agreement.privacy')
      this.showAgreementModal = true
    },
    
    // 跳转到首页
    goToHome() {
      this.$router.push('/')
    },
    
    // 语言切换方法
    switchLanguage(lang) {
      this.$i18n.locale = lang
      this.currentLang = lang
    },
    
    // 切换语言下拉菜单显示状态
    toggleLanguageDropdown() {
      this.languageDropdownOpen = !this.languageDropdownOpen
    }
  }
}
</script>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 表单输入框焦点样式 */
input:focus, select:focus, textarea:focus {
  outline: none;
}

/* 按钮悬停效果 */
button {
  transition: all 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* FontAwesome图标确保显示 */
.fa {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 语言下拉菜单 */
.language-dropdown {
  position: relative;
}

.language-dropdown-toggle {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background-color: white;
  color: #4B5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-dropdown-toggle:hover {
  border-color: #1E88E5;
  color: #1E88E5;
}

.language-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 120px;
  background-color: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
}

.language-dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border: none;
  background: none;
  font-size: 14px;
  color: #4B5563;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-dropdown-item:hover {
  background-color: #F3F4F6;
  color: #1E88E5;
}

.language-dropdown-item.active {
  background-color: #E3F2FD;
  color: #1E88E5;
}

/* 弹窗动画 */
.fixed {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>