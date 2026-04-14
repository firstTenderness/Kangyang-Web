<template>
  <div id="app" class="home-page">
    <!-- 导航栏 -->
    <header class="navbar" id="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="navbar-container">
        <div class="navbar-content">
          <!-- Logo -->
          <div class="logo">
            <i class="fa fa-heartbeat logo-icon"></i>
            <span class="logo-text">{{ $t('footer.company') }}</span>
            <span class="logo-subtext">{{ $t('footer.slogan') }}</span>
          </div>
          
          <!-- 右侧按钮组 -->
          <div class="navbar-right">
            <!-- 语言切换下拉菜单 -->
            <div class="language-dropdown">
              <button class="language-dropdown-toggle" @click="toggleLanguageDropdown">
                <i class="fa fa-globe mr-2"></i>
                <span>{{ currentLang.startsWith('zh') ? '中文' : 'English' }}</span>
                <i class="fa fa-chevron-down ml-2"></i>
              </button>
              <div class="language-dropdown-menu" v-if="languageDropdownOpen">
                <button 
                  class="language-dropdown-item" 
                  :class="{ 'active': currentLang.startsWith('zh') }"
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
            
            <!-- 登录/注册按钮 -->
            <div class="auth-buttons">
              <router-link to="/login" class="login-button">{{ $t('nav.login') }}</router-link>
              <button class="trial-button">
                {{ $t('nav.trial') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 首页英雄区 -->
    <section id="home" class="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 to-green-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center">
          <!-- 文字内容 -->
          <div class="md:w-1/2 mb-10 md:mb-0">
            <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4">
              {{ $t('hero.title') }}
            </h1>
            <p class="text-lg text-gray-600 mb-8 max-w-lg">
              {{ $t('hero.subtitle') }}
            </p>
            <div class="flex flex-wrap gap-4">
              <button class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center" @click="navigateToService">
                <i class="fa fa-rocket mr-2"></i>{{ $t('hero.button1') }}
              </button>
              <button class="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center" @click="scrollToSection('demo')">
                <i class="fa fa-play-circle mr-2"></i>{{ $t('hero.button2') }}
              </button>
            </div>
            
            <!-- 核心优势标签 -->
            <div class="mt-10 flex flex-wrap gap-3">
              <div class="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <i class="fa fa-check-circle text-green-500 mr-2"></i>
                <span class="text-sm font-medium">{{ $t('hero.tags.noHardware') }}</span>
              </div>
              <div class="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <i class="fa fa-check-circle text-green-500 mr-2"></i>
                <span class="text-sm font-medium">{{ $t('hero.tags.aiRecognition') }}</span>
              </div>
              <div class="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <i class="fa fa-check-circle text-green-500 mr-2"></i>
                <span class="text-sm font-medium">{{ $t('hero.tags.dualAlert') }}</span>
              </div>
              <div class="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <i class="fa fa-check-circle text-green-500 mr-2"></i>
                <span class="text-sm font-medium">{{ $t('hero.tags.emergency') }}</span>
              </div>
            </div>
          </div>
          
          <!-- 首页图片 -->
          <div class="md:w-1/2">
            <div class="relative">
              <img :src="localImages.heroImage" alt="智慧老人监护平台演示" class="rounded-xl shadow-2xl w-full h-auto object-cover">
              <!-- 悬浮状态卡片 -->
              <div class="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 w-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hidden md:block">
                <div class="flex items-start">
                  <div class="bg-green-100 p-2 rounded-full mr-3">
                    <i class="fa fa-bell text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800">{{ $t('hero.monitoringStatus') }}</h4>
                    <p class="text-sm text-gray-500">{{ $t('hero.statusNormal') }} | {{ $t('hero.noAlertsToday') }}</p>
                    <div class="mt-2 flex items-center text-xs">
                      <div class="progress-container">
                        <div class="progress-fill-low" :style="{ width: '95%' }"></div>
                      </div>
                      <span class="ml-2 text-green-600 font-medium">95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 合作方/信任标识 -->
        <div class="mt-20">
          <p class="text-center text-gray-500 text-sm mb-6">{{ $t('hero.serviceScope') }}</p>
          <div class="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div class="text-xl font-bold text-gray-400">{{ $t('hero.partners.elderlyCareGroup') }}</div>
            <div class="text-xl font-bold text-gray-400">{{ $t('hero.partners.healthCareCenter') }}</div>
            <div class="text-xl font-bold text-gray-400">{{ $t('hero.partners.communityService') }}</div>
            <div class="text-xl font-bold text-gray-400">{{ $t('hero.partners.medicalGroup') }}</div>
            <div class="text-xl font-bold text-gray-400">{{ $t('hero.partners.insurance') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能区 -->
    <section id="features" class="py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{{ $t('features.title') }}</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">{{ $t('features.subtitle') }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- 功能卡片1 -->
          <div class="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100">
            <div class="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
              <i class="fa fa-video-camera text-blue-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-gray-800">{{ $t('features.cards.aiRecognition.title') }}</h3>
            <p class="text-gray-600">{{ $t('features.cards.aiRecognition.description') }}</p>
          </div>
          
          <!-- 功能卡片2 -->
          <div class="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100">
            <div class="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
              <i class="fa fa-bell text-yellow-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-gray-800">{{ $t('features.cards.multiAlert.title') }}</h3>
            <p class="text-gray-600">{{ $t('features.cards.multiAlert.description') }}</p>
          </div>
          
          <!-- 功能卡片3 -->
          <div class="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100">
            <div class="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
              <i class="fa fa-ambulance text-red-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-gray-800">{{ $t('features.cards.emergency.title') }}</h3>
            <p class="text-gray-600">{{ $t('features.cards.emergency.description') }}</p>
          </div>
          
          <!-- 功能卡片4 -->
          <div class="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100">
            <div class="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
              <i class="fa fa-desktop text-green-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-gray-800">{{ $t('features.cards.multiDevice.title') }}</h3>
            <p class="text-gray-600">{{ $t('features.cards.multiDevice.description') }}</p>
          </div>
        </div>
        
        <!-- 扩展功能 -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex items-start bg-white p-4 rounded-lg border border-gray-100">
            <div class="bg-blue-50 p-3 rounded-full mr-4">
              <i class="fa fa-plug text-blue-600"></i>
            </div>
            <div>
              <h4 class="font-medium mb-2 text-gray-800">{{ $t('features.extras.plugPlay.title') }}</h4>
              <p class="text-sm text-gray-600">{{ $t('features.extras.plugPlay.description') }}</p>
            </div>
          </div>
          
          <div class="flex items-start bg-white p-4 rounded-lg border border-gray-100">
            <div class="bg-blue-50 p-3 rounded-full mr-4">
              <i class="fa fa-users text-blue-600"></i>
            </div>
            <div>
              <h4 class="font-medium mb-2 text-gray-800">{{ $t('features.extras.multiRole.title') }}</h4>
              <p class="text-sm text-gray-600">{{ $t('features.extras.multiRole.description') }}</p>
            </div>
          </div>
          
          <div class="flex items-start bg-white p-4 rounded-lg border border-gray-100">
            <div class="bg-blue-50 p-3 rounded-full mr-4">
              <i class="fa fa-line-chart text-blue-600"></i>
            </div>
            <div>
              <h4 class="font-medium mb-2 text-gray-800">{{ $t('features.extras.behaviorAnalysis.title') }}</h4>
              <p class="text-sm text-gray-600">{{ $t('features.extras.behaviorAnalysis.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台演示区 -->
    <section id="demo" class="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{{ $t('demo.title') }}</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">{{ $t('demo.subtitle') }}</p>
        </div>
        
        <!-- 演示标签页 -->
        <div class="mb-8 border-b border-gray-200">
          <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="demoTab" role="tablist">
            <li class="mr-2" role="presentation">
              <button class="inline-block p-4 border-b-2 rounded-t-lg" 
                :class="activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300'"
                @click="activeTab = 'dashboard'"
                type="button" role="tab">{{ $t('demo.tabs.dashboard') }}</button>
            </li>
            <li class="mr-2" role="presentation">
              <button class="inline-block p-4 border-b-2 rounded-t-lg" 
                :class="activeTab === 'monitor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300'"
                @click="activeTab = 'monitor'"
                type="button" role="tab">{{ $t('demo.tabs.monitor') }}</button>
            </li>
            <li class="mr-2" role="presentation">
              <button class="inline-block p-4 border-b-2 rounded-t-lg" 
                :class="activeTab === 'alert' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300'"
                @click="activeTab = 'alert'"
                type="button" role="tab">{{ $t('demo.tabs.alert') }}</button>
            </li>
            <li role="presentation">
              <button class="inline-block p-4 border-b-2 rounded-t-lg" 
                :class="activeTab === 'analysis' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300'"
                @click="activeTab = 'analysis'"
                type="button" role="tab">{{ $t('demo.tabs.analysis') }}</button>
            </li>
          </ul>
        </div>
        
        <!-- 演示内容区 -->
        <div id="demoTabContent">
          <!-- 数据总览面板 -->
          <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100" id="dashboard" role="tabpanel" v-show="activeTab === 'dashboard'">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <!-- 数据卡片1 -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="text-gray-500 text-sm">{{ $t('demo.dashboard.titles.elderlyCount') }}</p>
                    <h3 class="text-3xl font-bold text-gray-800">1,258</h3>
                  </div>
                  <div class="bg-blue-100 p-3 rounded-full">
                    <i class="fa fa-user-o text-blue-600"></i>
                  </div>
                </div>
                <div class="flex items-center text-sm">
                  <span class="text-green-600 flex items-center font-medium"><i class="fa fa-arrow-up mr-1"></i>12.5%</span>
                  <span class="text-gray-500 ml-2">较上月</span>
                </div>
              </div>
              
              <!-- 数据卡片2 -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="text-gray-500 text-sm">{{ $t('demo.dashboard.titles.todayAlerts') }}</p>
                    <h3 class="text-3xl font-bold text-gray-800">18</h3>
                  </div>
                  <div class="bg-yellow-100 p-3 rounded-full">
                    <i class="fa fa-exclamation-triangle text-yellow-600"></i>
                  </div>
                </div>
                <div class="flex items-center text-sm">
                  <span class="text-red-600 flex items-center font-medium"><i class="fa fa-arrow-up mr-1"></i>8.3%</span>
                  <span class="text-gray-500 ml-2">较昨日</span>
                </div>
              </div>
              
              <!-- 数据卡片3 -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="text-gray-500 text-sm">{{ $t('demo.dashboard.titles.emergencyCount') }}</p>
                    <h3 class="text-3xl font-bold text-gray-800">5</h3>
                  </div>
                  <div class="bg-red-100 p-3 rounded-full">
                    <i class="fa fa-ambulance text-red-600"></i>
                  </div>
                </div>
                <div class="flex items-center text-sm">
                  <span class="text-green-600 flex items-center font-medium"><i class="fa fa-arrow-down mr-1"></i>15.2%</span>
                  <span class="text-gray-500 ml-2">较昨日</span>
                </div>
              </div>
              
              <!-- 数据卡片4 -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="text-gray-500 text-sm">{{ $t('demo.dashboard.titles.satisfaction') }}</p>
                    <h3 class="text-3xl font-bold text-gray-800">98.7%</h3>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <i class="fa fa-smile-o text-green-600"></i>
                  </div>
                </div>
                <div class="flex items-center text-sm">
                  <span class="text-green-600 flex items-center font-medium"><i class="fa fa-arrow-up mr-1"></i>1.2%</span>
                  <span class="text-gray-500 ml-2">较上月</span>
                </div>
              </div>
            </div>
            
            <!-- 图表区域 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="font-medium mb-4 text-gray-800">{{ $t('demo.dashboard.chart1') }}</h4>
                <div class="h-64">
                  <canvas ref="alertTypeChart"></canvas>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="font-medium mb-4 text-gray-800">{{ $t('demo.dashboard.chart2') }}</h4>
                <div class="h-64">
                  <canvas ref="alertTrendChart"></canvas>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 实时监护面板 -->
          <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100" id="monitor" role="tabpanel" v-show="activeTab === 'monitor'">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- 监控视频区域 -->
              <div class="lg:col-span-2 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <div class="p-3 bg-gray-800 flex justify-between items-center">
                  <div class="flex items-center">
                    <i class="fa fa-video-camera text-white mr-2"></i>
                    <span class="text-white text-sm">{{ $t('demo.monitor.title') }}</span>
                  </div>
                  <div class="flex space-x-3">
                    <button class="text-white text-sm bg-blue-900 hover:bg-blue-800 px-3 py-1 rounded flex items-center transition-colors" @click="refreshMonitor">
                      <i class="fa fa-refresh mr-1"></i>{{ $t('demo.monitor.buttons.refresh') }}
                    </button>
                    <button class="text-white text-sm bg-red-700 hover:bg-red-800 px-3 py-1 rounded flex items-center transition-colors" @click="emergencyCall">
                      <i class="fa fa-phone mr-1"></i>{{ $t('demo.monitor.buttons.emergency') }}
                    </button>
                  </div>
                </div>
                <img :src="localImages.monitorImage" alt="实时监控画面" class="w-full h-auto">
              </div>
              
              <!-- 状态信息区域 -->
              <div class="flex flex-col gap-6">
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <h4 class="font-medium mb-3 text-gray-800">{{ $t('demo.monitor.info.basic') }}</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">姓名</span>
                      <span class="font-medium text-gray-800">张三</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">年龄</span>
                      <span class="font-medium text-gray-800">78岁</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">健康状况</span>
                      <span class="font-medium text-gray-800">高血压、轻度认知障碍</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">紧急联系人</span>
                      <span class="font-medium text-gray-800">李五 13812341234</span>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <h4 class="font-medium mb-3 text-gray-800">{{ $t('demo.monitor.info.realTime') }}</h4>
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-gray-600">{{ $t('demo.monitor.info.currentStatus') }}</span>
                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{{ $t('demo.monitor.info.active') }}</span>
                  </div>
                  <div class="space-y-2">
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600">{{ $t('demo.monitor.info.activity') }}</span>
                        <span class="font-medium">68%</span>
                      </div>
                      <div class="progress-container">
                        <div class="progress-fill-medium" :style="{ width: '68%' }"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600">{{ $t('demo.monitor.info.indoorTime') }}</span>
                        <span class="font-medium">4.2小时</span>
                      </div>
                      <div class="progress-container">
                        <div class="progress-fill-primary" :style="{ width: '42%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 告警中心面板 -->
          <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100" id="alert" role="tabpanel" v-show="activeTab === 'alert'">
            <div class="flex justify-between items-center mb-6">
              <h4 class="font-medium text-gray-800">{{ $t('demo.alert.title') }}</h4>
              <div class="flex space-x-2">
                <select class="border rounded-lg px-3 py-1 text-sm text-gray-700 bg-white" v-model="selectedAlertType">
                  <option value="all">{{ $t('demo.alert.filters.all') }}</option>
                  <option value="fall">{{ $t('demo.alert.filters.fall') }}</option>
                  <option value="lie">{{ $t('demo.alert.filters.lie') }}</option>
                  <option value="wander">{{ $t('demo.alert.filters.wander') }}</option>
                </select>
                <select class="border rounded-lg px-3 py-1 text-sm text-gray-700 bg-white" v-model="selectedAlertStatus">
                  <option value="all">{{ $t('demo.alert.filters.allStatus') }}</option>
                  <option value="processed">{{ $t('demo.alert.filters.processed') }}</option>
                  <option value="pending">{{ $t('demo.alert.filters.pending') }}</option>
                  <option value="closed">{{ $t('demo.alert.filters.closed') }}</option>
                </select>
              </div>
            </div>
            
            <!-- 告警列表 -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 rounded-l-lg">{{ $t('demo.alert.table.time') }}</th>
                    <th class="px-6 py-3">{{ $t('demo.alert.table.name') }}</th>
                    <th class="px-6 py-3">{{ $t('demo.alert.table.type') }}</th>
                    <th class="px-6 py-3">{{ $t('demo.alert.table.level') }}</th>
                    <th class="px-6 py-3">{{ $t('demo.alert.table.status') }}</th>
                    <th class="px-6 py-3 rounded-r-lg">{{ $t('demo.alert.table.action') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b hover:bg-gray-50" v-for="alert in filteredAlerts" :key="alert.id">
                    <td class="px-6 py-4 text-gray-800">{{ alert.time }}</td>
                    <td class="px-6 py-4 text-gray-800">{{ alert.name }}</td>
                    <td class="px-6 py-4 text-gray-800">{{ alert.type }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getAlertLevelClass(alert.level)">
                        {{ alert.level }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getAlertStatusClass(alert.status)">
                        {{ alert.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button class="text-blue-600 hover:text-blue-800 font-medium" @click="viewAlertDetail(alert.id)">{{ $t('demo.alert.table.view') }}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- 行为分析面板 -->
          <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100" id="analysis" role="tabpanel" v-show="activeTab === 'analysis'">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="font-medium mb-4 text-gray-800">{{ $t('demo.analysis.chart1') }}</h4>
                <div class="h-64">
                  <canvas ref="activityPatternChart"></canvas>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="font-medium mb-4 text-gray-800">{{ $t('demo.analysis.chart2') }}</h4>
                <div class="space-y-4">
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-gray-600">{{ $t('demo.analysis.risks.fall') }}</span>
                      <span class="font-medium">75%</span>
                    </div>
                    <div class="progress-container">
                      <div class="progress-fill-high" :style="{ width: '75%' }"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-gray-600">{{ $t('demo.analysis.risks.activity') }}</span>
                      <span class="font-medium">60%</span>
                    </div>
                    <div class="progress-container">
                      <div class="progress-fill-medium" :style="{ width: '60%' }"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-gray-600">{{ $t('demo.analysis.risks.sleep') }}</span>
                      <span class="font-medium">85%</span>
                    </div>
                    <div class="progress-container">
                      <div class="progress-fill-low" :style="{ width: '85%' }"></div>
                    </div>
                  </div>
                  
                  <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h5 class="font-medium mb-2 text-gray-800">{{ $t('demo.analysis.warning') }}</h5>
                    <p class="text-sm text-gray-600">
                      {{ $t('demo.analysis.warningText') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 订阅方案区 -->
    <section id="pricing" class="py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{{ $t('pricing.title') }}</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">{{ $t('pricing.subtitle') }}</p>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">{{ $t('pricing.loading') }}</p>
        </div>
        
        <!-- 套餐卡片 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- 动态套餐卡片 -->
          <div 
            v-for="plan in plans.filter(p => !p.status || p.status !== 'inactive')" 
            :key="plan.id" 
            class="bg-gray-50 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-200"
          >
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-xl font-semibold mb-4 text-gray-800">{{ plan.name }}</h3>
              <div class="flex items-end mb-2">
                <span v-if="plan.originalPrice && plan.originalPrice > plan.price" class="text-3xl font-bold text-red-600">¥{{ plan.price }}</span>
                <span v-else class="text-3xl font-bold text-gray-800">¥{{ plan.price }}</span>
                <span class="text-gray-500 text-sm ml-2 mb-1">/{{ plan.period }}</span>
              </div>
              <div v-if="plan.originalPrice && plan.originalPrice > plan.price" class="flex items-center mt-1">
                <span class="text-gray-500 text-sm line-through">¥{{ plan.originalPrice }}</span>
                <span class="ml-2 text-red-600 text-xs bg-red-50 px-2 py-1 rounded-full">{{ plan.discount }}折</span>
              </div>
              <button 
                class="block w-full py-2 text-center rounded-lg transition-colors mt-4 font-medium bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                @click="selectPlan(plan.name.toLowerCase())"
              >
                {{ $t('pricing.button') }}
              </button>
            </div>
            <div class="p-6">
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="fa fa-check text-green-600 mt-1 mr-2"></i>
                  <span class="text-sm text-gray-700">{{ $t('pricing.features.cameras', { count: plan.maxCameras }) }}</span>
                </li>
                <li class="flex items-start">
                  <i class="fa" :class="plan.hasExclusiveService === 1 ? 'fa-check text-green-600 mt-1 mr-2' : 'fa-times text-red-600 mt-1 mr-2'"></i>
                  <span class="text-sm text-gray-700">{{ $t('pricing.features.service') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="fa fa-check text-green-600 mt-1 mr-2"></i>
                  <span class="text-sm text-gray-700">{{ plan.aiType === '1' ? $t('pricing.aiTypes.none') : plan.aiType === '2' ? $t('pricing.aiTypes.standard') : plan.aiType === '3' ? $t('pricing.aiTypes.advanced') : $t('pricing.aiTypes.enterprise') }} {{ $t('pricing.features.ai') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="fa fa-check text-green-600 mt-1 mr-2"></i>
                  <span class="text-sm text-gray-700">{{ $t('pricing.features.alert') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="fa fa-check text-green-600 mt-1 mr-2"></i>
                  <span class="text-sm text-gray-700">{{ $t('pricing.features.storage') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="fa fa-check text-green-600 mt-1 mr-2"></i>
                  <span class="text-sm text-gray-700">{{ $t('pricing.features.emergency') }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 开通流程区 -->
    <section class="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{{ $t('process.title') }}</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">{{ $t('process.subtitle') }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <!-- 步骤1 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-blue-600 text-xl font-bold">1</span>
            </div>
            <h3 class="font-medium mb-2 text-gray-800">{{ $t('process.steps.step1.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('process.steps.step1.description') }}</p>
          </div>
          
          <!-- 步骤2 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-blue-600 text-xl font-bold">2</span>
            </div>
            <h3 class="font-medium mb-2 text-gray-800">{{ $t('process.steps.step2.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('process.steps.step2.description') }}</p>
          </div>
          
          <!-- 步骤3 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-blue-600 text-xl font-bold">3</span>
            </div>
            <h3 class="font-medium mb-2 text-gray-800">{{ $t('process.steps.step3.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('process.steps.step3.description') }}</p>
          </div>
          
          <!-- 步骤4 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-blue-600 text-xl font-bold">4</span>
            </div>
            <h3 class="font-medium mb-2 text-gray-800">{{ $t('process.steps.step4.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('process.steps.step4.description') }}</p>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <button class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 inline-flex items-center mx-auto font-medium" @click="scrollToSection('pricing')">
            <i class="fa fa-rocket mr-2"></i>{{ $t('process.button') }}
          </button>
        </div>
      </div>
    </section>

    <!-- 联系我们区 -->
    <section id="contact" class="py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ $t('contact.title') }}</h2>
              <p class="text-gray-600 mb-8">
                {{ $t('contact.subtitle') }}
              </p>
              
              <div class="space-y-4 mb-8">
                <div class="flex items-start">
                  <div class="bg-blue-100 p-2 rounded-full mr-4">
                    <i class="fa fa-phone text-blue-600"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800">{{ $t('contact.info.phone') }}</h4>
                    <p class="text-gray-600">400-697-5963</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="bg-blue-100 p-2 rounded-full mr-4">
                    <i class="fa fa-envelope text-blue-600"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800">{{ $t('contact.info.email') }}</h4>
                    <p class="text-gray-600">kangyang@163.com</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="bg-blue-100 p-2 rounded-full mr-4">
                    <i class="fa fa-map-marker text-blue-600"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800">{{ $t('contact.info.address') }}</h4>
                    <p class="text-gray-600">广东建设职业技术学校</p>
                  </div>
                </div>
              </div>
              
              <div class="flex space-x-4">
                <button class="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                  <i class="fa fa-weixin"></i>
                </button>
                <button class="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                  <i class="fa fa-weibo"></i>
                </button>
                <button class="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                  <i class="fa fa-qq"></i>
                </button>
              </div>
            </div>
            
            <div>
              <form class="space-y-4" @submit.prevent="submitContactForm">
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700" for="name">{{ $t('contact.form.name') }}</label>
                  <input type="text" id="name" v-model="contactForm.name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" :placeholder="$t('contact.form.placeholder.name')" required>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700" for="phone">{{ $t('contact.form.phone') }}</label>
                  <input type="tel" id="phone" v-model="contactForm.phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" :placeholder="$t('contact.form.placeholder.phone')" required>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700" for="type">{{ $t('contact.form.type') }}</label>
                  <select id="type" v-model="contactForm.type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white">
                    <option value="product">{{ $t('contact.form.options.product') }}</option>
                    <option value="cooperation">{{ $t('contact.form.options.cooperation') }}</option>
                    <option value="service">{{ $t('contact.form.options.service') }}</option>
                    <option value="other">{{ $t('contact.form.options.other') }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700" for="message">{{ $t('contact.form.message') }}</label>
                  <textarea id="message" rows="4" v-model="contactForm.message" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" :placeholder="$t('contact.form.placeholder.message')" required></textarea>
                </div>
                
                <button type="submit" class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  {{ $t('contact.form.button') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center mb-4">
              <i class="fa fa-heartbeat text-blue-400 text-2xl mr-2"></i>
              <span class="text-xl font-bold">{{ $t('footer.company') }}</span>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              {{ $t('footer.slogan') }}
            </p>
            <div class="flex space-x-4">
              <button class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-weixin"></i>
              </button>
              <button class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-weibo"></i>
              </button>
              <button class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-qq"></i>
              </button>
            </div>
          </div>
          
          <div>
            <h4 class="font-medium mb-4">{{ $t('footer.sections.product') }}</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.aiService') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.institution') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.custom') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.api') }}</button></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-medium mb-4">{{ $t('footer.sections.about') }}</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.intro') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.team') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.news') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.jobs') }}</button></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-medium mb-4">{{ $t('footer.sections.help') }}</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.faq') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.tutorial') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.support') }}</button></li>
              <li><button class="hover:text-white transition-colors text-left">{{ $t('footer.links.privacy') }}</button></li>
            </ul>
          </div>
        </div>
        
        <div class="pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>{{ $t('footer.copyright') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '../services/api.js'
import i18n from '../i18n'

// 导入图片
import heroImage from '../assets/images/hero-image.jpg'
import monitorImage from '../assets/images/monitor-image.jpg'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    // 响应式数据
    const isScrolled = ref(false)
    const mobileMenuOpen = ref(false)
    const activeTab = ref('dashboard')
    const selectedAlertType = ref('all')
    const selectedAlertStatus = ref('all')
    const loading = ref(false)
    const activeNavItem = ref('home')
    const currentLang = ref(i18n.global.locale.value || 'zh')
    const languageDropdownOpen = ref(false)
    const plans = ref([
      {
        id: 1,
        name: '基础版',
        price: 39,
        maxCameras: 1,
        hasExclusiveService: 0,
        aiType: '1',
        period: '月'
      },
      {
        id: 2,
        name: '标准版',
        price: 69,
        maxCameras: 3,
        hasExclusiveService: 1,
        aiType: '2',
        period: '月'
      },
      {
        id: 3,
        name: '高级版',
        price: 99,
        maxCameras: 10,
        hasExclusiveService: 1,
        aiType: '3',
        period: '月'
      }
    ])
    
    // 本地图片路径
    const localImages = ref({
      heroImage,
      monitorImage
    })
    
    // 告警数据
    const alerts = ref([
      { id: 1, time: '2026-01-12 14:25', name: '张二', type: '久卧不起', level: '中风险', status: '已处理' },
      { id: 2, time: '2026-01-12 10:18', name: '李三', type: '跌倒检测', level: '高风险', status: '已处理' },
      { id: 3, time: '2026-01-11 18:45', name: '王一', type: '异常徘徊', level: '中风险', status: '待处理' },
      { id: 4, time: '2026-01-11 09:30', name: '赵四', type: '久卧不起', level: '中风险', status: '已关闭' },
      { id: 5, time: '2026-01-10 16:20', name: '孙五', type: '跌倒检测', level: '高风险', status: '已处理' }
    ])
    
    // 获取套餐列表
    const fetchPlans = async () => {
      try {
        loading.value = true
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
      } finally {
        loading.value = false
      }
    }
    
    // 订阅方案功能
    const basicFeatures = ref([
      '单摄像头AI监护',
      '跌倒/久卧识别告警',
      '短信告警通知'
    ])
    
    const basicExcludedFeatures = ref([
      '电话语音告警',
      '自动120急救呼叫',
      '行为数据分析报告'
    ])
    
    const standardFeatures = ref([
      '3摄像头AI监护',
      '全类型异常行为识别',
      '短信+电话双渠道告警',
      '自动120急救呼叫',
      '月度行为分析报告'
    ])
    
    const standardExcludedFeatures = ref([
      '多角色权限管理'
    ])
    
    const premiumFeatures = ref([
      '不限摄像头数量',
      '全类型异常行为识别',
      '多渠道智能告警',
      '应急联动处置',
      '每日/周/月分析报告',
      '多角色权限精细化管理'
    ])
    
    // 联系表单数据
    const contactForm = ref({
      name: '',
      phone: '',
      type: 'product',
      message: ''
    })
    
    // 图表引用
    const alertTypeChart = ref(null)
    const alertTrendChart = ref(null)
    const activityPatternChart = ref(null)
    
    // 计算属性
    const filteredAlerts = computed(() => {
      return alerts.value.filter(alert => {
        const typeMatch = selectedAlertType.value === 'all' || 
                         (selectedAlertType.value === 'fall' && alert.type === '跌倒检测') ||
                         (selectedAlertType.value === 'lie' && alert.type === '久卧不起') ||
                         (selectedAlertType.value === 'wander' && alert.type === '异常徘徊')
        
        const statusMatch = selectedAlertStatus.value === 'all' ||
                           (selectedAlertStatus.value === 'processed' && alert.status === '已处理') ||
                           (selectedAlertStatus.value === 'pending' && alert.status === '待处理') ||
                           (selectedAlertStatus.value === 'closed' && alert.status === '已关闭')
        
        return typeMatch && statusMatch
      })
    })
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const scrollToSection = (sectionId) => {
      mobileMenuOpen.value = false
      activeNavItem.value = sectionId
      
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
    
    const navigateToLogin = () => {
      // 这里可以跳转到您的登录页面
      alert('跳转到登录页面')
    }
    
    const refreshMonitor = () => {
      alert('刷新监控画面')
    }
    
    const emergencyCall = () => {
      if (confirm('确定要发起紧急呼叫吗？')) {
        alert('正在呼叫紧急联系人...')
      }
    }
    
    const getAlertLevelClass = (level) => {
      switch(level) {
        case '高风险': return 'bg-red-100 text-red-800'
        case '中风险': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getAlertStatusClass = (status) => {
      switch(status) {
        case '已处理': return 'bg-green-100 text-green-800'
        case '待处理': return 'bg-gray-100 text-gray-800'
        case '已关闭': return 'bg-blue-100 text-blue-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }
    
    // 语言切换方法
    const switchLanguage = (lang) => {
      i18n.global.locale = lang
      currentLang.value = lang
    }
    
    // 切换语言下拉菜单显示状态
    const toggleLanguageDropdown = () => {
      languageDropdownOpen.value = !languageDropdownOpen.value
    }
    
    const viewAlertDetail = (id) => {
      alert(`查看告警详情 ID: ${id}`)
    }
    
    const selectPlan = (plan) => {
      // 检查用户是否已登录到用户端
      const isUserLoggedIn = localStorage.getItem('userLoggedIn');
      if (isUserLoggedIn) {
        // 已登录，跳转到用户端的套餐管理界面
        router.push('/agent/service');
      } else {
        // 未登录，跳转到用户端的登录界面
        router.push('/login');
      }
    }
    
    const navigateToService = () => {
      // 检查用户是否已登录到用户端
      const isUserLoggedIn = localStorage.getItem('userLoggedIn');
      if (isUserLoggedIn) {
        // 已登录，跳转到用户端的套餐管理界面
        router.push('/agent/service');
      } else {
        // 未登录，跳转到用户端的登录界面
        router.push('/login');
      }
    }
    
    const submitContactForm = () => {
      console.log('提交联系表单:', contactForm.value)
      alert('咨询信息已提交，我们会尽快与您联系！')
      // 重置表单
      contactForm.value = {
        name: '',
        phone: '',
        type: 'product',
        message: ''
      }
    }
    
    // 初始化图表
    const initCharts = () => {
      // 检查Chart.js是否可用
      if (typeof Chart === 'undefined') {
        console.warn('Chart.js 未加载，图表将无法显示')
        return
      }
      
      // 告警类型分布图表
      if (alertTypeChart.value) {
        new Chart(alertTypeChart.value.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['跌倒检测', '久卧不起', '异常徘徊', '其他'],
            datasets: [{
              data: [45, 30, 20, 5],
              backgroundColor: ['#F87171', '#FBBF24', '#3B82F6', '#10B981'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        })
      }
      
      // 告警趋势图表
      if (alertTrendChart.value) {
        new Chart(alertTrendChart.value.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['1月6日', '1月7日', '1月8日', '1月9日', '1月10日', '1月11日', '1月12日'],
            datasets: [{
              label: '告警数量',
              data: [12, 15, 10, 18, 14, 20, 18],
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
      
      // 活动规律图表
      if (activityPatternChart.value) {
        new Chart(activityPatternChart.value.getContext('2d'), {
          type: 'bar',
          data: {
            labels: ['6-8点', '8-10点', '10-12点', '12-14点', '14-16点', '16-18点', '18-20点', '20-22点'],
            datasets: [{
              label: '活动频次',
              data: [15, 35, 40, 20, 30, 45, 30, 25],
              backgroundColor: '#3B82F6'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    }
    
    // 生命周期钩子
    onMounted(() => {
      // 滚动监听
      const handleScroll = () => {
        isScrolled.value = window.scrollY > 50
      }
      
      window.addEventListener('scroll', handleScroll)
      
      // 获取套餐列表
      fetchPlans()
      
      // 初始化图表
      setTimeout(() => {
        initCharts()
      }, 500)
      
      // 清理函数
      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
      })
    })
    
    return {
      // 响应式数据
      isScrolled,
      mobileMenuOpen,
      activeTab,
      selectedAlertType,
      selectedAlertStatus,
      alerts,
      plans,
      loading,
      contactForm,
      currentLang,
      localImages,
      activeNavItem,
      languageDropdownOpen,
      
      // 图表引用
      alertTypeChart,
      alertTrendChart,
      activityPatternChart,
      
      // 计算属性
      filteredAlerts,
      
      // 方法
      toggleMobileMenu,
      scrollToSection,
      navigateToLogin,
      refreshMonitor,
      emergencyCall,
      getAlertLevelClass,
      getAlertStatusClass,
      viewAlertDetail,
      selectPlan,
      navigateToService,
      submitContactForm,
      switchLanguage,
      toggleLanguageDropdown
    }
  }
}
</script>

<style>
/* 全局样式，不使用scoped以应用自定义类 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* 首页样式 */
.home-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
}

.desktop-menu {
  gap: 40px;
}

/* Logo样式 */
.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  font-size: 24px;
  color: #1E88E5;
  margin-right: 10px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #1E88E5;
}

.logo-subtext {
  font-size: 14px;
  color: #666;
  margin-left: 10px;
  display: none;
}

@media (min-width: 768px) {
  .logo-subtext {
    display: inline;
  }
}

/* 桌面菜单样式 */
.desktop-menu {
  display: none;
  gap: 32px;
}

@media (min-width: 992px) {
  .desktop-menu {
    display: flex;
  }
}

.nav-item {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 0;
  position: relative;
  z-index: 1;
}

.nav-item:hover {
  color: #1E88E5;
}

.nav-item.active {
  color: #1E88E5;
  font-weight: 600;
}

/* 语言切换按钮样式 */
.language-switcher {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 20px;
}

.language-btn {
  padding: 6px 12px;
  border: 1px solid #E5E7EB;
  background-color: white;
  color: #4B5563;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-btn:hover {
  border-color: #1E88E5;
  color: #1E88E5;
}

.language-btn.active {
  background-color: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

/* 移动端语言切换样式 */
.mobile-language-switcher {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #F3F4F6;
}

.mobile-language-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #E5E7EB;
  background-color: white;
  color: #4B5563;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.mobile-language-btn:hover {
  border-color: #1E88E5;
  color: #1E88E5;
}

.mobile-language-btn.active {
  background-color: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1E88E5;
  border-radius: 1px;
  z-index: -1;
}

.nav-item:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1E88E5;
  border-radius: 1px;
  opacity: 0.5;
  z-index: -1;
}

/* 右侧按钮组 */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
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

/* 登录按钮样式 */
.auth-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.login-button {
  padding: 8px 16px;
  border: 1px solid #1E88E5;
  border-radius: 8px;
  color: #1E88E5;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: rgba(30, 136, 229, 0.05);
}

.trial-button {
  padding: 8px 16px;
  background-color: #1E88E5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.trial-button:hover {
  background-color: #1976D2;
}

/* 移动端菜单按钮 */
.mobile-menu-button {
  display: block;
}

@media (min-width: 992px) {
  .mobile-menu-button {
    display: none;
  }
}

.mobile-menu-button button {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

/* 移动端菜单样式 */
.mobile-menu {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  z-index: 999;
}

.mobile-menu.open {
  max-height: 400px;
}

.mobile-menu-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-item {
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 12px 0;
  text-align: left;
  position: relative;
  z-index: 1;
}

.mobile-nav-item:hover {
  color: #1E88E5;
}

.mobile-nav-item.active {
  color: #1E88E5;
  font-weight: 600;
}

.mobile-nav-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #1E88E5;
  border-radius: 2px;
  z-index: -1;
}

.mobile-nav-item:hover::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #1E88E5;
  border-radius: 2px;
  opacity: 0.5;
  z-index: -1;
}

.mobile-auth-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.mobile-login-button {
  flex: 1;
  padding: 12px;
  border: 1px solid #1E88E5;
  border-radius: 8px;
  color: #1E88E5;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.mobile-login-button:hover {
  background-color: rgba(30, 136, 229, 0.05);
}

.mobile-trial-button {
  flex: 1;
  padding: 12px;
  background-color: #1E88E5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.mobile-trial-button:hover {
  background-color: #1976D2;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 进度条容器 */
.progress-container {
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

/* 进度条填充 */
.progress-fill-low {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill-medium {
  height: 100%;
  background-color: #FFC107;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill-high {
  height: 100%;
  background-color: #F44336;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill-primary {
  height: 100%;
  background-color: #1E88E5;
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .progress-container {
    height: 4px;
  }
  
  .navbar-content {
    height: 72px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .mobile-menu {
    top: 72px;
  }
  
  /* 移动端导航栏文字大小调整 */
  .mobile-nav-item {
    font-size: 14px;
  }
  
  .mobile-login-button,
  .mobile-trial-button {
    font-size: 13px;
  }
  
  .language-dropdown-toggle {
    font-size: 13px;
    padding: 6px 10px;
  }
  
  .login-button,
  .trial-button {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>
