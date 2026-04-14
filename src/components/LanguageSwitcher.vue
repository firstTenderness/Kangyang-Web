<template>
  <div class="language-switcher">
    <button 
      class="language-btn" 
      :class="{ active: currentLocale === 'zh-CN' }"
      @click="switchLanguage('zh-CN')"
    >
      中文
    </button>
    <button 
      class="language-btn" 
      :class="{ active: currentLocale === 'en-US' }"
      @click="switchLanguage('en-US')"
    >
      English
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'

export default {
  name: 'LanguageSwitcher',
  emits: ['language-changed'],
  setup(props, { emit }) {
    const { locale } = useI18n()
    
    console.log('LanguageSwitcher initialized, current locale:', locale.value)
    
    // 监听locale变化
    watch(locale, (newLocale) => {
      console.log('Locale changed to:', newLocale)
    })
    
    const switchLanguage = (lang) => {
      console.log('Switching language to:', lang)
      // 只更新locale.value，这会自动触发所有组件的语言更新
      locale.value = lang
      localStorage.setItem('locale', lang)
      console.log('Language switched, new locale:', locale.value)
      console.log('LocalStorage locale:', localStorage.getItem('locale'))
      // 发送事件通知父组件关闭下拉菜单
      emit('language-changed')
    }
    
    return {
      currentLocale: locale,
      switchLanguage
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.language-btn {
  padding: 6px 12px;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #34495e;
  color: #ecf0f1;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.language-btn:hover {
  background-color: #4a637d;
  border-color: #3498db;
}

.language-btn.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}
</style>