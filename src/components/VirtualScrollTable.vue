<template>
  <div class="virtual-scroll-table">
    <!-- 表格头部 -->
    <table class="admin-table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index" :style="{ width: column.width || 'auto' }">
            {{ column.title }}
          </th>
        </tr>
      </thead>
    </table>
    
    <!-- 虚拟滚动区域 -->
    <div 
      class="virtual-scroll-container" 
      ref="scrollContainer"
      @scroll="handleScroll"
      :style="{ height: height + 'px' }"
    >
      <!-- 占位元素，用于撑开容器高度 -->
      <div 
        class="virtual-scroll-placeholder" 
        :style="{ height: totalHeight + 'px' }"
      ></div>
      
      <!-- 实际渲染的行 -->
      <div 
        class="virtual-scroll-content" 
        :style="{ transform: `translateY(${startOffset}px)` }"
      >
        <table class="admin-table virtual-scroll-body">
          <tbody>
            <tr 
              v-for="(item, index) in visibleItems" 
              :key="item.id || index"
              @click="$emit('row-click', item)"
            >
              <td v-for="(column, colIndex) in columns" :key="colIndex" :style="{ width: column.width || 'auto' }">
                <slot name="cell" :item="item" :column="column" :index="index"></slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  // 数据列表
  items: {
    type: Array,
    default: () => []
  },
  // 表格列配置
  columns: {
    type: Array,
    required: true
  },
  // 容器高度
  height: {
    type: Number,
    default: 500
  },
  // 每行高度
  rowHeight: {
    type: Number,
    default: 60
  }
})

const emit = defineEmits(['row-click'])

const scrollContainer = ref(null)
const scrollTop = ref(0)

// 计算总高度
const totalHeight = computed(() => {
  return props.items.length * props.rowHeight
})

// 计算可见项的起始索引
const startIndex = computed(() => {
  return Math.floor(scrollTop.value / props.rowHeight)
})

// 计算可见项的结束索引（多渲染一些以避免滚动时出现空白）
const endIndex = computed(() => {
  if (!scrollContainer.value) return props.items.length
  const containerHeight = scrollContainer.value.clientHeight
  return Math.min(
    props.items.length,
    Math.ceil((scrollTop.value + containerHeight) / props.rowHeight) + 5
  )
})

// 计算可见项
const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value)
})

// 计算起始偏移量
const startOffset = computed(() => {
  return startIndex.value * props.rowHeight
})

// 处理滚动事件
const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop
}

// 监听数据变化，重置滚动位置
watch(() => props.items.length, () => {
  scrollTop.value = 0
})
</script>

<style scoped>
.virtual-scroll-table {
  width: 100%;
  overflow: hidden;
  border-radius: var(--admin-border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.virtual-scroll-container {
  width: 100%;
  overflow-y: auto;
  position: relative;
  border: 1px solid var(--admin-border);
  border-top: none;
}

.virtual-scroll-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.virtual-scroll-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}

.virtual-scroll-body {
  border: none;
}

.virtual-scroll-body tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.virtual-scroll-body tr:hover {
  background-color: rgba(52, 152, 219, 0.05);
}

/* 自定义滚动条 */
.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>