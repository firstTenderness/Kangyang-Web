<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <AdminNavbar />
    
    <!-- 主要内容区域 -->
    <main class="admin-content">
      <!-- 页面标题 -->
      <h1 class="admin-page-title">{{ $t('admin.cards.title') }}</h1>
      
      <!-- 搜索和生成区域 -->
      <div class="admin-action-bar">
        <div style="display: flex; gap: 15px; align-items: center;">
          <div class="admin-search-box">
            <input type="text" :placeholder="$t('admin.cards.searchPlaceholder')" v-model="searchQuery" @input="filterCards" />
          </div>
          <div class="admin-search-box">
            <select v-model="planFilter" @change="filterCards" class="admin-form-group select">
              <option value="all">{{ $t('admin.cards.allPlans') }}</option>
              <option v-for="plan in plans" :key="plan.id" :value="plan.name">
                {{ plan.name }}
              </option>
            </select>
          </div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="admin-btn admin-btn-danger" @click="batchDeleteCards" :disabled="selectedCards.length === 0">
            {{ $t('admin.cards.batchDelete') }} ({{ selectedCards.length }})
          </button>
          <button class="admin-btn admin-btn-warning" @click="deleteUsedCards">
            {{ $t('admin.cards.deleteUsed') }}
          </button>
          <button class="admin-btn admin-btn-primary" @click="openGenerateModal">{{ $t('admin.cards.generateCard') }}</button>
        </div>
      </div>
      
      <!-- 卡密列表 -->
      <div class="admin-card">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="admin-loading-container">
          <div class="admin-loading-spinner"></div>
          <p>{{ $t('common.loading') }}</p>
        </div>
        
        <!-- 数据为空状态 -->
        <div v-else-if="filteredCards.length === 0" class="admin-empty-state">
          <div class="admin-empty-state-icon">💳</div>
          <div class="admin-empty-state-title">{{ $t('common.noData') }}</div>
          <div class="admin-empty-state-desc">{{ $t('common.noCardData') }}</div>
          <button class="admin-btn admin-btn-primary" @click="fetchCards">{{ $t('common.refresh') }}</button>
        </div>
        
        <!-- 表格容器 -->
        <div class="admin-table-container" v-else>
          <!-- 表格 -->
          <table class="admin-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              </th>
              <th>{{ $t('admin.cards.cardId') }}</th>
              <th>{{ $t('admin.cards.cardNumber') }}</th>
              <th>{{ $t('admin.cards.type') }}</th>
              <th>{{ $t('admin.cards.plan') }}</th>
              <th>{{ $t('admin.cards.planDuration') }}</th>
              <th>{{ $t('common.status') }}</th>
              <th>{{ $t('admin.cards.generateTime') }}</th>
              <th>{{ $t('admin.cards.useTime') }}</th>
              <th>{{ $t('admin.cards.useUser') }}</th>
              <th>{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in paginatedCards" :key="card.id">
              <td>
                <input type="checkbox" v-model="selectedCards" :value="card.id" @change="updateSelectAll" />
              </td>
              <td>{{ card.id }}</td>
              <td>{{ card.code }}</td>
              <td>{{ getCardTypeText(card.type) }}</td>
              <td>{{ card.plan }}</td>
              <td>{{ card.validity }}</td>
              <td>
                <span class="admin-status-badge" :class="getStatusCode(card.status)">{{ card.status }}</span>
              </td>
              <td>{{ formatTime(card.generateTime) }}</td>
              <td>{{ formatTime(card.useTime) }}</td>
              <td>{{ card.userPhone || '-' }}</td>
              <td>
                <button class="admin-btn admin-btn-danger" @click="deleteCard(card.id)">{{ $t('common.delete') }}</button>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="admin-pagination">
        <button class="admin-page-btn" :disabled="currentPage === 1" @click="currentPage--">{{ $t('admin.cards.previousPage') }}</button>
        <span class="admin-page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
        <button class="admin-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">{{ $t('admin.cards.nextPage') }}</button>
      </div>
      
      <!-- 生成卡密弹窗 -->
      <div class="admin-modal-overlay" v-if="showGenerateModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ $t('admin.cards.generateCard') }}</h2>
            <button class="admin-modal-close" @click="showGenerateModal = false">&times;</button>
          </div>
          <div class="admin-modal-body">
            <form class="admin-form" @submit.prevent="generateCards">
              <div class="admin-form-group">
                <label>{{ $t('admin.cards.cardType') }}</label>
                <select v-model="generateForm.type" required @change="updateDefaultDays">
                  <option value="天卡">{{ $t('admin.cards.dayCard') }}</option>
                  <option value="周卡">{{ $t('admin.cards.weekCard') }}</option>
                  <option value="月卡">{{ $t('admin.cards.monthCard') }}</option>
                  <option value="年卡">{{ $t('admin.cards.yearCard') }}</option>
                  <option value="永久卡">{{ $t('admin.cards.permanentCard') }}</option>
                  <option value="自定义">{{ $t('admin.cards.custom') }}</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.cards.planType') }}</label>
                <select v-model="generateForm.plan" required>
                  <option v-for="plan in plans" :key="plan.id" :value="plan.name">
                    {{ plan.name }}
                  </option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.cards.generateCount') }}</label>
                <input type="number" v-model="generateForm.count" min="1" max="100" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.cards.planDuration') }}</label>
                <input type="number" v-model="generateForm.days" min="1" v-if="generateForm.type !== '永久卡'" />
                <span v-else class="admin-mt-2">{{ $t('admin.cards.permanent') }}</span>
              </div>
              <div class="admin-form-row" style="justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="admin-btn admin-btn-secondary" @click="showGenerateModal = false">{{ $t('common.cancel') }}</button>
                <button type="submit" class="admin-btn admin-btn-primary">{{ $t('admin.cards.generate') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- 确认框弹窗 -->
      <div class="admin-modal-overlay" v-if="showConfirmModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ $t('admin.users.confirmModal') }}</h2>
            <button class="admin-modal-close" @click="closeConfirmModal">&times;</button>
          </div>
          <div class="admin-modal-body">
            <p style="font-size: 16px; line-height: 1.5; margin: 0; text-align: center; white-space: pre-line;">{{ confirmMessage }}</p>
          </div>
          <div class="admin-modal-footer">
            <button class="admin-btn admin-btn-secondary" @click="handleConfirm(false)">{{ $t('common.cancel') }}</button>
            <button class="admin-btn admin-btn-primary" @click="handleConfirm(true)">{{ $t('common.confirm') }}</button>
          </div>
        </div>
      </div>
      
      <!-- 消息提示弹窗 -->
      <div class="admin-modal-overlay" v-if="showMessageModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ $t('admin.users.alertModal') }}</h2>
            <button class="admin-modal-close" @click="closeMessageModal">&times;</button>
          </div>
          <div class="admin-modal-body">
            <p style="font-size: 16px; line-height: 1.5; margin: 0; text-align: center; white-space: pre-line;">{{ messageText }}</p>
          </div>
          <div class="admin-modal-footer">
            <button class="admin-btn admin-btn-primary" @click="closeMessageModal">{{ $t('common.confirm') }}</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import AdminNavbar from '../../components/AdminNavbar.vue';
import apiService from '../../services/api.js';

export default {
  name: 'CardManagement',
  components: {
    AdminNavbar
  },
  data() {
    return {
      cards: [],
      filteredCards: [],
      plans: [],
      searchQuery: '',
      planFilter: 'all',
      showGenerateModal: false,
      generateForm: {
        type: '天卡',
        plan: '基础版',
        count: 1,
        days: 1
      },
      selectedCards: [],
      selectAll: false,
      currentPage: 1,
      pageSize: 20,
      isLoading: false,
      showMessageModal: false,
      messageText: '',
      showConfirmModal: false,
      confirmMessage: '',
      confirmCallback: null
    };
  },
  mounted() {
    this.fetchPlans();
    this.fetchCards();
    
    // 监听语言变化，重新加载数据
    this.$watch('$i18n.locale', () => {
      this.fetchCards();
    });
  },
  computed: {
    // 计算当前页显示的卡密
    paginatedCards() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredCards.slice(startIndex, endIndex);
    },
    // 计算总页数
    totalPages() {
      return Math.ceil(this.filteredCards.length / this.pageSize);
    }
  },
  methods: {
    getStatusCode(status) {
      if (status === '未使用' || status === 'Unused') {
        return 'admin-status-active';
      } else if (status === '已使用' || status === 'Used') {
        return 'admin-status-danger';
      } else if (status === '已过期' || status === 'Expired') {
        return 'admin-status-inactive';
      }
      return '';
    },
    async fetchPlans() {
      try {
        const data = await apiService.get('/admin/plans');
        if (data.code === 200) {
          this.plans = data.data.filter(p => !p.status || p.status !== 'inactive');
        }
      } catch (error) {
        console.error('获取套餐列表失败:', error);
      }
    },
    async fetchCards() {
      this.isLoading = true;
      try {
        // 获取所有卡密数据到客户端，用于客户端过滤和分页
        const params = {
          page: 1,
          size: 1000 // 假设最多有1000个卡密
        };
        
        const data = await apiService.get('/admin/cards', { params });
        
        if (data.code === 200) {
          // 转换状态为当前语言
          this.cards = data.data.records.map(card => {
            let status = card.status;
            if (status === 'unused') {
              status = this.$t('admin.cards.unused');
            } else if (status === 'used') {
              status = this.$t('admin.cards.used');
            } else if (status === 'expired') {
              status = this.$t('admin.cards.expired');
            }
            return {
              ...card,
              status
            };
          });
          // 过滤数据
          this.filterCards();
          // 重置选中状态
          this.selectedCards = [];
          this.selectAll = false;
        } else {
          alert(this.$t('admin.cards.fetchFailed'));
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
        alert(this.$t('admin.system.networkError'));
      } finally {
        this.isLoading = false;
      }
    },
    filterCards() {
      let result = [...this.cards];
      
      // 按套餐过滤
      if (this.planFilter !== 'all') {
        result = result.filter(card => card.plan === this.planFilter);
      }
      
      // 按搜索关键词过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(card => {
          return (
            card.code.toLowerCase().includes(query) ||
            card.type.toLowerCase().includes(query) ||
            card.plan.toLowerCase().includes(query) ||
            card.userPhone?.toLowerCase().includes(query)
          );
        });
      }
      
      // 按状态排序：未使用 > 已使用 > 已过期
      result.sort((a, b) => {
        const statusOrder = {
          [this.$t('admin.cards.unused')]: 0,
          [this.$t('admin.cards.used')]: 1,
          [this.$t('admin.cards.expired')]: 2
        };
        return statusOrder[a.status] - statusOrder[b.status];
      });
      
      this.filteredCards = result;
      // 重置选中状态
      this.selectedCards = [];
      this.selectAll = false;
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedCards = this.filteredCards.map(card => card.id);
      } else {
        this.selectedCards = [];
      }
    },
    updateSelectAll() {
      this.selectAll = this.selectedCards.length === this.filteredCards.length && this.filteredCards.length > 0;
    },
    async batchDeleteCards() {
      if (this.selectedCards.length === 0) {
        this.showMessage(this.$t('admin.cards.fetchFailed'));
        return;
      }
      
      // 显示自定义确认框
      this.showConfirm(this.$t('admin.cards.confirmDeleteMultiple', { count: this.selectedCards.length }), async (confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          try {
            // 循环删除每个选中的卡密
            let successCount = 0;
            for (const id of this.selectedCards) {
              try {
                const data = await apiService.delete(`/admin/cards/${id}`);
                if (data.code === 200) {
                  successCount++;
                }
              } catch (error) {
                console.error(`Error deleting card ${id}:`, error);
              }
            }
            
            // 使用自定义消息提示而不是alert
            this.showMessage(this.$t('admin.cards.deleteMultipleSuccess', { count: successCount }));
            await this.fetchCards();
          } catch (error) {
            console.error('Error batch deleting cards:', error);
            // 使用自定义消息提示而不是alert
            this.showMessage(this.$t('admin.system.networkError'));
          } finally {
            this.isLoading = false;
          }
        }
      });
    },
    async deleteUsedCards() {
      // 显示自定义确认框
      this.showConfirm(this.$t('admin.cards.confirmDeleteUsed'), async (confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          try {
            // 获取所有卡密
            const allCardsData = await apiService.get('/admin/cards', {
              params: {
                page: 1,
                size: 1000 // 假设最多有1000个卡密
              }
            });
            
            if (allCardsData.code === 200) {
              const allCards = allCardsData.data.records;
              // 过滤已使用的卡密（使用英文状态值）
              const usedCards = allCards.filter(card => card.status === 'used');
              
              // 循环删除每个已使用的卡密
              let successCount = 0;
              for (const card of usedCards) {
                try {
                  const data = await apiService.delete(`/admin/cards/${card.id}`);
                  if (data.code === 200) {
                    successCount++;
                  }
                } catch (error) {
                  console.error(`Error deleting used card ${card.id}:`, error);
                }
              }
              
              // 使用自定义消息提示而不是alert
              this.showMessage(this.$t('admin.cards.deleteMultipleSuccess', { count: successCount }));
              await this.fetchCards();
            } else {
              // 使用自定义消息提示而不是alert
              this.showMessage(this.$t('admin.cards.fetchFailed'));
            }
          } catch (error) {
            console.error('Error deleting used cards:', error);
            // 使用自定义消息提示而不是alert
            this.showMessage(this.$t('admin.system.networkError'));
          } finally {
            this.isLoading = false;
          }
        }
      });
    },
    openGenerateModal() {
      this.generateForm = {
        type: '天卡',
        plan: '基础版',
        count: 1,
        days: 1
      };
      this.showGenerateModal = true;
    },
    updateDefaultDays() {
      // 根据选择的卡密类型自动设置默认的套餐天数
      switch (this.generateForm.type) {
        case '天卡':
          this.generateForm.days = 1;
          break;
        case '周卡':
          this.generateForm.days = 7;
          break;
        case '月卡':
          this.generateForm.days = 30;
          break;
        case '年卡':
          this.generateForm.days = 365;
          break;
        case '自定义':
          // 自定义类型不自动设置，保持当前值
          break;
        default:
          // 永久卡不需要设置天数
          break;
      }
    },
    async generateCards() {
      const { type, plan, count, days } = this.generateForm;
      let validityDays = days;
      
      // 永久卡设置为36500天
      if (type === '永久卡') {
        validityDays = 36500;
      }
      
      this.isLoading = true;
      try {
        const data = await apiService.post('/admin/cards/generate', {
          type,
          plan: plan,
          count,
          validity: validityDays
        });
        
        if (data.code === 200) {
          // 使用自定义消息提示而不是alert，包含套餐的名字、时间和数量，一行一个内容
          let validityText = type === '永久卡' ? this.$t('admin.cards.permanent') : `${days} ${this.$t('admin.cards.day')}`;
          this.showMessage(this.$t('admin.cards.generateSuccess') + `\n${this.$t('admin.cards.planType')}:${plan}\n${this.$t('admin.cards.cardType')}:${type}\n${this.$t('admin.cards.validity')}:${validityText}`);
          this.showGenerateModal = false;
          await this.fetchCards();
        } else {
          // 使用自定义消息提示而不是alert
          this.showMessage(this.$t('admin.cards.deleteFailed'));
        }
      } catch (error) {
        console.error('Error generating cards:', error);
        // 使用自定义消息提示而不是alert
        this.showMessage(this.$t('admin.system.networkError'));
      } finally {
        this.isLoading = false;
      }
    },
    async deleteCard(id) {
      // 显示自定义确认框
      this.showConfirm(this.$t('admin.cards.confirmDeleteOne'), async (confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          try {
            const data = await apiService.delete(`/admin/cards/${id}`);
            
            if (data.code === 200) {
              // 使用自定义消息提示而不是alert
              this.showMessage(this.$t('admin.cards.deleteSuccess'));
              await this.fetchCards();
            } else {
              // 使用自定义消息提示而不是alert
              this.showMessage(this.$t('admin.cards.deleteFailed'));
            }
          } catch (error) {
            console.error('Error deleting card:', error);
            // 使用自定义消息提示而不是alert
            this.showMessage(this.$t('admin.system.networkError'));
          } finally {
            this.isLoading = false;
          }
        }
      });
    },
    // 格式化时间，移除ISO格式中的'T'分隔符
    formatTime(timeString) {
      if (!timeString) return '-';
      return timeString.replace('T', ' ');
    },
    // 显示自定义消息提示
    showMessage(message) {
      this.messageText = message;
      this.showMessageModal = true;
    },
    // 关闭消息提示
    closeMessageModal() {
      this.showMessageModal = false;
      this.messageText = '';
    },
    // 显示自定义确认框
    showConfirm(message, callback) {
      this.confirmMessage = message;
      this.confirmCallback = callback;
      this.showConfirmModal = true;
    },
    // 关闭确认框
    closeConfirmModal() {
      this.showConfirmModal = false;
      this.confirmMessage = '';
      this.confirmCallback = null;
    },
    // 处理确认操作
    handleConfirm(confirmed) {
      if (this.confirmCallback) {
        this.confirmCallback(confirmed);
      }
      this.closeConfirmModal();
    },
    // 获取卡密类型文本
    getCardTypeText(type) {
      const types = {
        '天卡': this.$t('admin.cards.dayCard'),
        '周卡': this.$t('admin.cards.weekCard'),
        '月卡': this.$t('admin.cards.monthCard'),
        '年卡': this.$t('admin.cards.yearCard'),
        '永久卡': this.$t('admin.cards.permanentCard'),
        '自定义': this.$t('admin.cards.custom')
      };
      return types[type] || type;
    }
  }
};
</script>

<style scoped>
/* 自定义选择框样式 */
.admin-search-box select {
  padding: 12px 16px;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-border-radius);
  font-size: 14px;
  transition: var(--admin-transition);
  background-color: #f9f9f9;
  min-width: 150px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 12 12'%3E%3Cpath d='M6 9L1 4h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
}

.admin-search-box select:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  background-color: white;
}

/* 移动端选择框样式 */
@media (max-width: 768px) {
  .admin-search-box select {
    padding: 10px 14px;
    font-size: 13px;
    min-width: 120px;
  }
}

/* 调整表格操作按钮间距 */
.admin-table td button {
  margin-right: 8px;
  margin-bottom: 8px;
}

/* 加载状态样式 */
.admin-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
}

.admin-loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(52, 152, 219, 0.2);
  border-top: 4px solid var(--admin-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.admin-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
  text-align: center;
}

.admin-empty-state-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.admin-empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--admin-text);
  margin-bottom: 8px;
}

.admin-empty-state-desc {
  font-size: 14px;
  color: var(--admin-text-light);
  margin-bottom: 24px;
}

/* 表格容器样式 */
.admin-table-container {
  overflow-x: auto;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 表格样式调整 */
.admin-table {
  width: 100%;
  min-width: 1000px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .admin-action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .admin-search-box {
    width: 100%;
    max-width: none;
  }
  
  /* 调整移动端按钮大小 */
  .admin-action-bar > div:last-child {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }
  
  .admin-action-bar button {
    flex: 1;
    min-width: 120px;
    font-size: 12px;
    padding: 8px 12px;
  }
  
  .admin-table {
    font-size: 14px;
    min-width: 800px;
  }
  
  .admin-table th,
  .admin-table td {
    padding: 12px 16px;
  }
  
  .admin-page-title {
    font-size: 24px;
  }
  
  .admin-modal {
    width: 95%;
    max-width: none;
  }
  
  .admin-modal-header,
  .admin-modal-body,
  .admin-modal-footer {
    padding: 20px;
  }
  
  .admin-loading-container,
  .admin-empty-state {
    height: 300px;
  }
}
</style>