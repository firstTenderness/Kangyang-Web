<!-- src/App.vue -->
<template>
  <!-- 唯一内容：路由出口，所有页面组件都渲染在这里 -->
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<!-- 可选：如果需要全局样式（比如页面重置）就保留，不需要则删除 -->
<style>
/* 极简全局样式（可选）：仅做基础重置，无任何布局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: sans-serif;
}
</style>