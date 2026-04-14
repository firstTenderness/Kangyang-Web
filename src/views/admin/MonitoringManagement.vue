<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <AdminNavbar />
    
    <!-- 主要内容区域 -->
    <main class="admin-content">
      <!-- 页面标题 -->
      <h1 class="admin-page-title">{{ $t('admin.monitoring.title') }}</h1>
      
      <!-- 搜索和分类区域 -->
      <div class="admin-action-bar">
        <div class="admin-search-box">
          <input type="text" :placeholder="$t('admin.monitoring.searchPlaceholder')" v-model="searchQuery" @input="filterMonitorings" />
          <button class="admin-btn admin-btn-primary" @click="filterMonitorings">{{ $t('common.search') }}</button>
        </div>
        <div class="admin-search-box">
          <select v-model="statusFilter" @change="filterMonitorings" class="admin-form-group select">
            <option value="">{{ $t('admin.monitoring.allStatus') }}</option>
            <option :value="$t('admin.monitoring.online')">{{ $t('admin.monitoring.online') }}</option>
            <option :value="$t('admin.monitoring.offline')">{{ $t('admin.monitoring.offline') }}</option>
          </select>
        </div>
      </div>
      
      <!-- 监控列表 -->
      <div class="admin-card">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="admin-loading-container">
          <div class="admin-loading-spinner"></div>
          <p>{{ $t('common.loading') }}</p>
        </div>
        
        <!-- 数据为空状态 -->
        <div v-else-if="monitorings.length === 0" class="admin-empty-state">
          <div class="admin-empty-state-icon">📊</div>
          <div class="admin-empty-state-title">{{ $t('common.noData') }}</div>
          <div class="admin-empty-state-desc">{{ $t('common.noMonitoringData') }}</div>
          <button class="admin-btn admin-btn-primary" @click="fetchMonitorings">{{ $t('common.refresh') }}</button>
        </div>
        
        <!-- 表格容器 -->
        <div class="admin-table-container" v-else>
          <!-- 表格 -->
          <table class="admin-table">
          <thead>
            <tr>
              <th>{{ $t('admin.monitoring.index') }}</th>
              <th>{{ $t('admin.monitoring.monitorId') }}</th>
              <th>{{ $t('admin.monitoring.username') }}</th>
              <th>{{ $t('admin.monitoring.monitorName') }}</th>
              <th>{{ $t('admin.monitoring.monitorAddress') }}</th>
              <th>{{ $t('common.status') }}</th>
              <th>{{ $t('admin.monitoring.health') }}</th>
              <th>{{ $t('admin.monitoring.addTime') }}</th>
              <th>{{ $t('admin.monitoring.lastOnline') }}</th>
              <th>{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in monitorings" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.username }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.url }}</td>
              <td>
                <span class="admin-status-badge" :class="getStatusCode(item.status)">{{ getStatusText(item.status) }}</span>
              </td>
              <td>
                <span class="admin-status-badge" :class="getHealthStatusCode(item.healthStatus)">{{ getHealthStatusText(item.healthStatus) }}</span>
              </td>
              <td>{{ formatTime(item.addTime) }}</td>
              <td>{{ formatTime(item.lastOnline) }}</td>
              <td>
                <button class="admin-btn admin-btn-primary" @click="viewMonitoring(item)">{{ $t('admin.monitoring.view') }}</button>
                <button class="admin-btn admin-btn-success" @click="openEditModal(item)">{{ $t('admin.monitoring.edit') }}</button>
                <button class="admin-btn" :class="item.healthStatus === $t('admin.monitoring.normal') ? 'admin-btn-warning' : 'admin-btn-success'" @click="toggleBlock(item)">{{ item.healthStatus === $t('admin.monitoring.normal') ? $t('admin.monitoring.banned') : $t('admin.monitoring.unban') }}</button>
                <button class="admin-btn admin-btn-danger" @click="deleteMonitoring(item.id)">{{ $t('common.delete') }}</button>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="admin-pagination">
        <button class="admin-page-btn" :disabled="currentPage === 1" @click="currentPage--; filterMonitorings()">{{ $t('admin.monitoring.previousPage') }}</button>
        <span class="admin-page-info">{{ $t('common.pageInfo', { page: currentPage, total: totalPages }) }}</span>
        <button class="admin-page-btn" :disabled="currentPage === totalPages" @click="currentPage++; filterMonitorings()">{{ $t('admin.monitoring.nextPage') }}</button>
      </div>
      
      <!-- 添加/编辑弹窗 -->
      <div class="admin-modal-overlay" v-if="showModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ isEdit ? $t('admin.monitoring.editMonitor') : $t('admin.monitoring.addMonitor') }}</h2>
            <button class="admin-modal-close" @click="showModal = false">&times;</button>
          </div>
          <div class="admin-modal-body">
            <form class="admin-form" @submit.prevent="saveMonitoring">
              <div class="admin-form-group">
                <label>{{ $t('admin.monitoring.monitorName') }}</label>
                <input type="text" v-model="formData.name" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.monitoring.monitorAddress') }}</label>
                <input type="text" v-model="formData.url" :placeholder="$t('admin.monitoring.cameraUrlPlaceholder')" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('common.status') }}</label>
                <select v-model="formData.status" required>
                  <option :value="$t('admin.monitoring.online')">{{ $t('admin.monitoring.online') }}</option>
                  <option :value="$t('admin.monitoring.offline')">{{ $t('admin.monitoring.offline') }}</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('admin.monitoring.healthStatus') }}</label>
                <select v-model="formData.healthStatus" required>
                  <option :value="$t('admin.monitoring.normal')">{{ $t('admin.monitoring.normal') }}</option>
                  <option :value="$t('admin.monitoring.banned')">{{ $t('admin.monitoring.banned') }}</option>
                </select>
              </div>
              <!-- 紧急联系人 -->
              <div class="admin-form-group">
                <label>{{ $t('admin.monitoring.emergencyContact') }}</label>
                <div class="admin-form-row">
                  <button 
                    type="button"
                    v-if="formData.contacts.length < 5" 
                    class="admin-btn admin-btn-primary" 
                    @click="addContact"
                  >
                    {{ $t('admin.monitoring.addContact') }}
                  </button>
                </div>
                <div v-for="(contact, index) in formData.contacts" :key="index" class="admin-card admin-mt-4">
                  <div class="admin-form-row">
                    <div class="admin-form-group">
                      <label>{{ $t('admin.monitoring.contact') }} {{ index + 1 }}</label>
                      <div class="admin-form-row">
                        <div class="admin-form-group">
                          <label>{{ $t('admin.monitoring.name') }}</label>
                          <input type="text" v-model="contact.name" :placeholder="$t('admin.monitoring.enterName')" />
                        </div>
                        <div class="admin-form-group">
                          <label>{{ $t('admin.monitoring.phone') }}</label>
                          <input type="tel" v-model="contact.phone" :placeholder="$t('admin.monitoring.enterPhone')" />
                        </div>
                        <button 
                          type="button"
                          v-if="formData.contacts.length > 1" 
                          class="admin-btn admin-btn-danger" 
                          @click="removeContact(index)"
                          style="align-self: flex-end; margin-bottom: 16px;"
                        >
                          {{ $t('common.delete') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="admin-mt-2" style="font-size: 14px; color: var(--admin-text-light);">{{ $t('admin.monitoring.maxContacts') }}</p>
              </div>
              <div class="admin-form-row" style="justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="admin-btn admin-btn-secondary" @click="showModal = false">{{ $t('common.cancel') }}</button>
                <button type="submit" class="admin-btn admin-btn-primary">{{ $t('common.save') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- 查看监控弹窗 -->
      <div class="admin-modal-overlay" v-if="showViewModal">
        <div class="admin-modal" style="max-width: 800px;">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ $t('admin.monitoring.view') }} {{ $t('admin.monitoring.title') }}</h2>
            <button class="admin-modal-close" @click="showViewModal = false">&times;</button>
          </div>
          <div class="admin-modal-body">
            <div v-if="selectedMonitoring">
              <div class="admin-form-row" style="margin-bottom: 20px;">
                <div class="admin-form-group" style="flex: 1;">
                  <label>{{ $t('admin.monitoring.monitorId') }}:</label>
                  <span>{{ selectedMonitoring.id }}</span>
                </div>
                <div class="admin-form-group" style="flex: 1;">
                  <label>{{ $t('admin.monitoring.userPhone') }}:</label>
                  <span>{{ selectedMonitoring.userPhone || selectedMonitoring.userId }}</span>
                </div>
              </div>
              <div class="admin-form-row" style="margin-bottom: 20px;">
                <div class="admin-form-group" style="flex: 1;">
                  <label>{{ $t('admin.monitoring.username') }}:</label>
                  <span>{{ selectedMonitoring.username }}</span>
                </div>
                <div class="admin-form-group" style="flex: 1;">
                  <label>{{ $t('admin.monitoring.monitorName') }}:</label>
                  <span>{{ selectedMonitoring.name }}</span>
                </div>
              </div>
              <div class="admin-form-group" style="margin-bottom: 20px;">
                <label>{{ $t('admin.monitoring.monitorAddress') }}:</label>
                <span>{{ selectedMonitoring.url }}</span>
              </div>
              <div class="admin-form-row" style="margin-bottom: 20px;">
                <div class="admin-form-group" style="flex: 1;">
                  <label>{{ $t('common.status') }}:</label>
                  <span class="admin-status-badge" :class="getStatusCode(selectedMonitoring.status)">{{ getStatusText(selectedMonitoring.status) }}</span>
                </div>
                <div class="admin-form-group" style="flex: 1;">
                  <label>{{ $t('admin.monitoring.health') }}:</label>
                  <span class="admin-status-badge" :class="getHealthStatusCode(selectedMonitoring.healthStatus)">{{ getHealthStatusText(selectedMonitoring.healthStatus) }}</span>
                </div>
              </div>
              <div class="admin-form-row" style="margin-bottom: 20px;">
                <div class="admin-form-group" style="flex: 1;">
                  <label>{{ $t('admin.monitoring.addTime') }}:</label>
                  <span>{{ formatTime(selectedMonitoring.addTime) }}</span>
                </div>
                <div class="admin-form-group" style="flex: 1;">
                  <label>{{ $t('admin.monitoring.lastOnline') }}:</label>
                  <span>{{ formatTime(selectedMonitoring.lastOnline) }}</span>
                </div>
              </div>
              <!-- 紧急联系人 -->
              <div class="admin-card admin-mt-6">
                <h3 style="margin-bottom: 20px;">{{ $t('admin.monitoring.emergencyContact') }}</h3>
                <div v-if="selectedMonitoring.contacts && selectedMonitoring.contacts.length > 0">
                  <div v-for="(contact, index) in selectedMonitoring.contacts" :key="index" class="admin-form-row" style="margin-bottom: 10px;">
                    <div class="admin-form-group" style="flex: 1;">
                      <label>{{ $t('admin.monitoring.contact') }} {{ index + 1 }}:</label>
                      <span>{{ contact.name }} ({{ contact.phone }})</span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p>{{ $t('admin.monitoring.noContacts') }}</p>
                </div>
              </div>
              <!-- 监控预览 -->
              <div class="admin-card admin-mt-6">
                <h3 style="margin-bottom: 20px;">{{ $t('admin.monitoring.monitorPreview') }}</h3>
                <div style="width: 100%; height: 300px; background-color: #f0f0f0; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: var(--admin-border-radius);">
                  <p>{{ $t('admin.monitoring.previewImage') }}</p>
                  <p>{{ selectedMonitoring.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 自定义警告弹窗 -->
      <div class="admin-modal-overlay" v-if="showAlertModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title">{{ $t('admin.monitoring.tip') }}</h3>
            <button class="admin-modal-close" @click="closeAlertModal">&times;</button>
          </div>
          <div class="admin-modal-body">
            <p>{{ alertMessage }}</p>
          </div>
          <div class="admin-modal-footer">
            <button class="admin-btn admin-btn-primary" @click="closeAlertModal">{{ $t('common.confirm') }}</button>
          </div>
        </div>
      </div>
      
      <!-- 自定义确认弹窗 -->
      <div class="admin-modal-overlay" v-if="showConfirmModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title">{{ $t('admin.monitoring.tip') }}</h3>
            <button class="admin-modal-close" @click="closeConfirmModal">&times;</button>
          </div>
          <div class="admin-modal-body">
            <p>{{ confirmMessage }}</p>
          </div>
          <div class="admin-modal-footer">
            <button class="admin-btn admin-btn-secondary" @click="handleConfirm(false)">{{ $t('common.cancel') }}</button>
            <button class="admin-btn admin-btn-primary" @click="handleConfirm(true)">{{ $t('common.confirm') }}</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import AdminNavbar from '../../components/AdminNavbar.vue';
import apiService from '../../services/api.js';
import { debounce } from '../../utils/debounce-throttle.js';

export default {
  name: 'MonitoringManagement',
  components: {
    AdminNavbar
  },
  data() {
    return {
      monitorings: [],
      originalMonitorings: [],
      searchQuery: '',
      statusFilter: '',
      showModal: false,
      showViewModal: false,
      isEdit: false,
      formData: {
        userId: '',
        username: '',
        name: '',
        url: '',
        status: this.$t('admin.monitoring.online'),
        healthStatus: this.$t('admin.monitoring.normal'),
        contacts: []
      },
      selectedMonitoring: null,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      isLoading: false,
      // 自定义弹窗状态
      showAlertModal: false,
      alertMessage: '',
      showConfirmModal: false,
      confirmMessage: '',
      confirmCallback: null
    };
  },
  computed: {
    // 表格列配置
    columns() {
      return [
        { title: this.$t('admin.monitoring.index'), width: '80px' },
        { title: this.$t('admin.monitoring.monitorId'), width: '120px' },
        { title: this.$t('admin.monitoring.username'), width: '150px' },
        { title: this.$t('admin.monitoring.monitorName'), width: '180px' },
        { title: this.$t('admin.monitoring.monitorAddress'), width: '200px' },
        { title: this.$t('common.status'), width: '100px' },
        { title: this.$t('admin.monitoring.health'), width: '100px' },
        { title: this.$t('admin.monitoring.addTime'), width: '180px' },
        { title: this.$t('admin.monitoring.lastOnline'), width: '180px' },
        { title: this.$t('common.actions'), width: '300px' }
      ];
    }
  },
  mounted() {
    this.fetchMonitorings();
    
    // 监听语言变化，重新加载数据
    this.$watch('$i18n.locale', () => {
      // 重置状态过滤器
      this.statusFilter = '';
      // 重新加载数据
      this.fetchMonitorings();
    });
  },
  methods: {
    getStatusCode(status) {
      if (status === this.$t('admin.monitoring.online')) {
        return 'admin-status-online';
      } else if (status === this.$t('admin.monitoring.offline')) {
        return 'admin-status-offline';
      }
      return '';
    },
    getHealthStatusCode(healthStatus) {
      if (healthStatus === this.$t('admin.monitoring.normal')) {
        return 'admin-status-normal';
      } else if (healthStatus === this.$t('admin.monitoring.banned')) {
        return 'admin-status-banned';
      }
      return '';
    },
    // 获取状态的翻译文本
    getStatusText(status) {
      if (status === '在线' || status === 'Online' || status === this.$t('admin.monitoring.online')) {
        return this.$t('admin.monitoring.online');
      } else if (status === '离线' || status === 'Offline' || status === this.$t('admin.monitoring.offline')) {
        return this.$t('admin.monitoring.offline');
      }
      return status;
    },
    // 获取健康状态的翻译文本
    getHealthStatusText(healthStatus) {
      if (healthStatus === '正常' || healthStatus === 'Normal' || healthStatus === this.$t('admin.monitoring.normal')) {
        return this.$t('admin.monitoring.normal');
      } else if (healthStatus === '封禁' || healthStatus === 'Banned' || healthStatus === this.$t('admin.monitoring.banned')) {
        return this.$t('admin.monitoring.banned');
      }
      return healthStatus;
    },
    async fetchMonitorings() {
      this.isLoading = true;
      try {
        // 移除分页参数，获取所有监控数据
        const data = await apiService.get('/admin/monitorings');
        
        if (data.code === 200) {
          // 转换状态和健康状态为当前语言
          this.originalMonitorings = (data.data.records || []).map(monitoring => {
            // 转换状态（无论API返回什么值，都根据当前语言转换）
            let status = this.$t('admin.monitoring.online');
            if (monitoring.status === '离线' || monitoring.status === 'Offline' || monitoring.status === this.$t('admin.monitoring.offline')) {
              status = this.$t('admin.monitoring.offline');
            }
            
            // 转换健康状态（无论API返回什么值，都根据当前语言转换）
            let healthStatus = this.$t('admin.monitoring.normal');
            if (monitoring.healthStatus === '封禁' || monitoring.healthStatus === 'Banned' || monitoring.healthStatus === this.$t('admin.monitoring.banned')) {
              healthStatus = this.$t('admin.monitoring.banned');
            }
            
            return {
              ...monitoring,
              status,
              healthStatus
            };
          });
          // 计算总页数
          this.totalPages = Math.ceil(this.originalMonitorings.length / this.pageSize);
          // 应用过滤和分页
          this.filterMonitorings();
        } else {
          this.showAlert(this.$t('admin.monitoring.fetchFailed') + '：' + (data.message || this.$t('admin.system.unknownError')));
        }
      } catch (error) {
        console.error('Error fetching monitorings:', error);
        this.showAlert(this.$t('admin.system.networkError'));
      } finally {
        this.isLoading = false;
      }
    },
    // 客户端过滤监控列表
    filterMonitorings: debounce(function() {
      if (!this.originalMonitorings) {
        this.originalMonitorings = [...this.monitorings];
      }
      
      let filtered = [...this.originalMonitorings];
      
      // 搜索过滤：支持用户名、监控名称、监控ID
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(monitoring => {
          return (
            (monitoring.username && monitoring.username.toLowerCase().includes(query)) ||
            (monitoring.name && monitoring.name.toLowerCase().includes(query)) ||
            (monitoring.id && monitoring.id.toString().toLowerCase().includes(query))
          );
        });
      }
      
      // 状态过滤
      if (this.statusFilter) {
        filtered = filtered.filter(monitoring => monitoring.status === this.statusFilter);
      }
      
      // 重新计算总页数
      this.totalPages = Math.ceil(filtered.length / this.pageSize);
      // 确保当前页码不超过总页数
      if (this.currentPage > this.totalPages) {
        this.currentPage = Math.max(1, this.totalPages);
      }
      
      // 应用分页
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.monitorings = filtered.slice(startIndex, endIndex);
    }, 300),
    openAddModal() {
      this.isEdit = false;
      this.formData = {
        userId: '',
        username: '',
        name: '',
        url: '',
        status: this.$t('admin.monitoring.online'),
        healthStatus: this.$t('admin.monitoring.normal')
      };
      this.showModal = true;
    },
    async openEditModal(monitoring) {
      this.isLoading = true;
      try {
        this.isEdit = true;
        
        // 直接使用列表接口返回的数据，包括紧急联系人信息
        this.formData = { ...monitoring };
        
        // 如果有userId，尝试获取用户详情以获取手机号
        if (this.formData.userId) {
          try {
            const userData = await apiService.get(`/admin/users/${this.formData.userId}`);
            if (userData.code === 200) {
              // 将用户手机号赋值给formData.userId，因为这是编辑表单中绑定的字段
              this.formData.userId = userData.data.phone;
            }
          } catch (userError) {
            console.error('Error fetching user details:', userError);
            // 即使获取用户详情失败，也继续显示编辑界面
          }
        }
        
        // 转换紧急联系人数据为contacts数组格式
        let contacts = [];
        
        // 首先尝试从emergencyContacts字段获取（新接口格式）
        if (monitoring.emergencyContacts) {
          for (let i = 1; i <= 5; i++) {
            const contact = monitoring.emergencyContacts[`contact${i}`];
            if (contact && (contact.name || contact.phone)) {
              contacts.push({ name: contact.name, phone: contact.phone });
            }
          }
        } else {
          // 兼容旧接口格式
          for (let i = 1; i <= 5; i++) {
            const name = this.formData[`emergency_contact${i}_name`];
            const phone = this.formData[`emergency_contact${i}_phone`];
            if (name || phone) {
              contacts.push({ name, phone });
            }
          }
        }
        
        // 如果没有联系人，添加一个空联系人
        if (contacts.length === 0) {
          contacts.push({ name: '', phone: '' });
        }
        this.formData.contacts = contacts;
        
        this.showModal = true;
      } catch (error) {
        console.error('Error opening edit modal:', error);
        this.showAlert(this.$t('admin.system.networkError'));
      } finally {
        this.isLoading = false;
      }
    },
    async saveMonitoring() {
      this.isLoading = true;
      try {
        if (this.isEdit) {
          // 准备请求数据
          const basicRequest = {
            name: this.formData.name,
            url: this.formData.url
          };
          
          const healthRequest = {
            healthStatus: this.formData.healthStatus
          };
          
          // 将状态值转换为英文状态值
          const powerStatus = this.formData.status === this.$t('admin.monitoring.online') ? 'online' : 'offline';
          const powerRequest = {
            status: powerStatus
          };
          
          // 将contacts数组转换为接口期望的格式
          const contactsRequest = {};
          this.formData.contacts.forEach((contact, index) => {
            if (contact.name || contact.phone) {
              contactsRequest[`contact${index + 1}`] = {
                name: contact.name || '',
                phone: contact.phone || ''
              };
            }
          });
          
          // 并行处理API调用
          const [basicData, healthData, powerData, contactsData] = await Promise.all([
            apiService.put(`/admin/monitorings/${this.formData.id}`, basicRequest),
            apiService.patch(`/admin/monitorings/${this.formData.id}/status`, healthRequest),
            apiService.put(`/admin/monitorings/${this.formData.id}/power`, powerRequest),
            apiService.post(`/admin/monitorings/${this.formData.id}/emergency-contacts`, contactsRequest)
          ]);
          
          // 检查所有接口的响应
          const allSuccess = basicData.code === 200 && healthData.code === 200 && powerData.code === 200 && contactsData.code === 200;
          
          if (allSuccess) {
            this.showAlert(this.$t('admin.monitoring.updateSuccess'));
            this.showModal = false;
            await this.fetchMonitorings();
          } else {
            // 收集错误信息
            const errors = [];
            if (basicData.code !== 200) errors.push(`${this.$t('admin.monitoring.updateMonitoring')}: ${basicData.message || this.$t('admin.system.failed')}`);
            if (healthData.code !== 200) errors.push(`${this.$t('admin.monitoring.toggleStatus')}: ${healthData.message || this.$t('admin.system.failed')}`);
            if (powerData.code !== 200) errors.push(`${this.$t('admin.monitoring.togglePowerStatus')}: ${powerData.message || this.$t('admin.system.failed')}`);
            if (contactsData.code !== 200) errors.push(`${this.$t('admin.monitoring.setEmergencyContacts')}: ${contactsData.message || this.$t('admin.system.failed')}`);
            
            this.showAlert(this.$t('admin.monitoring.updateFailed') + '：' + (errors.length > 0 ? errors.join('; ') : this.$t('admin.system.unknownError')));
          }
        } else {
          // 添加监控功能暂时不实现，因为需要用户ID等信息
          this.showAlert(this.$t('admin.monitoring.addNotImplemented'));
        }
      } catch (error) {
        console.error('Error saving monitoring:', error);
        this.showAlert(this.$t('admin.system.networkError'));
      } finally {
        this.isLoading = false;
      }
    },
    async viewMonitoring(monitoring) {
      this.isLoading = true;
      try {
        // 直接使用列表接口返回的数据，包括紧急联系人信息
        const monitoringDetail = { ...monitoring };
        
        // 如果有userId，尝试获取用户详情以获取手机号
        if (monitoringDetail.userId) {
          try {
            const userData = await apiService.get(`/admin/users/${monitoringDetail.userId}`);
            if (userData.code === 200) {
              // 将用户手机号添加到监控详情中
              monitoringDetail.userPhone = userData.data.phone;
            }
          } catch (userError) {
            console.error('Error fetching user details:', userError);
            // 即使获取用户详情失败，也继续显示监控详情
          }
        }
        
        // 转换紧急联系人数据为contacts数组格式
        let contacts = [];
        
        // 首先尝试从emergencyContacts字段获取（新接口格式）
        if (monitoring.emergencyContacts) {
          for (let i = 1; i <= 5; i++) {
            const contact = monitoring.emergencyContacts[`contact${i}`];
            if (contact && (contact.name || contact.phone)) {
              contacts.push({ name: contact.name, phone: contact.phone });
            }
          }
        } else {
          // 兼容旧接口格式
          for (let i = 1; i <= 5; i++) {
            const name = monitoringDetail[`emergency_contact${i}_name`];
            const phone = monitoringDetail[`emergency_contact${i}_phone`];
            if (name || phone) {
              contacts.push({ name, phone });
            }
          }
        }
        
        monitoringDetail.contacts = contacts;
        this.selectedMonitoring = monitoringDetail;
        this.showViewModal = true;
      } catch (error) {
        console.error('Error fetching monitoring details:', error);
        this.showAlert(this.$t('admin.system.networkError'));
      } finally {
        this.isLoading = false;
      }
    },
    async deleteMonitoring(id) {
      this.showConfirm(this.$t('admin.monitoring.confirmDelete'), async (confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          try {
            const data = await apiService.delete(`/admin/monitorings/${id}`);
            
            if (data.code === 200) {
              this.showAlert(this.$t('admin.monitoring.deleteSuccess'));
              await this.fetchMonitorings();
            } else {
              this.showAlert(this.$t('admin.monitoring.deleteFailed') + '：' + (data.message || this.$t('admin.system.unknownError')));
            }
          } catch (error) {
            console.error('Error deleting monitoring:', error);
            this.showAlert(this.$t('admin.system.networkError'));
          } finally {
            this.isLoading = false;
          }
        }
      });
    },
    async toggleBlock(monitoring) {
      const newStatus = monitoring.healthStatus === this.$t('admin.monitoring.normal') ? this.$t('admin.monitoring.banned') : this.$t('admin.monitoring.normal');
      this.isLoading = true;
      try {
        const data = await apiService.patch(`/admin/monitorings/${monitoring.id}/status`, {
          healthStatus: newStatus
        });
        
        if (data.code === 200) {
          this.showAlert(this.$t(`admin.monitoring.${newStatus === this.$t('admin.monitoring.banned') ? 'banSuccess' : 'unbanSuccess'}`));
          await this.fetchMonitorings();
        } else {
          this.showAlert(this.$t(`admin.monitoring.${newStatus === this.$t('admin.monitoring.banned') ? 'banFailed' : 'unbanFailed'}`) + '：' + (data.message || this.$t('admin.system.unknownError')));
        }
      } catch (error) {
        console.error('Error toggling monitoring status:', error);
        this.showAlert(this.$t('admin.system.networkError'));
      } finally {
        this.isLoading = false;
      }
    },
    // 添加联系人
    addContact() {
      if (this.formData.contacts.length < 5) {
        this.formData.contacts.push({ name: '', phone: '' });
      }
    },
    // 删除联系人
    removeContact(index) {
      if (this.formData.contacts.length > 1) {
        this.formData.contacts.splice(index, 1);
      }
    },
    // 自定义弹窗方法
    showAlert(message) {
      this.alertMessage = message;
      this.showAlertModal = true;
    },
    closeAlertModal() {
      this.showAlertModal = false;
      this.alertMessage = '';
    },
    showConfirm(message, callback) {
      this.confirmMessage = message;
      this.confirmCallback = callback;
      this.showConfirmModal = true;
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
      this.confirmMessage = '';
      this.confirmCallback = null;
    },
    handleConfirm(confirmed) {
      if (this.confirmCallback) {
        this.confirmCallback(confirmed);
      }
      this.closeConfirmModal();
    },
    formatTime(timeString) {
      if (!timeString) return '-';
      // 移除ISO格式中的'T'分隔符，转换为更友好的格式
      return timeString.replace('T', ' ');
    }
  }
};
</script>

<style scoped>
/* 下拉菜单样式 */
select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-border-radius);
  background-color: var(--admin-background);
  color: var(--admin-text);
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
  cursor: pointer;
  transition: var(--admin-transition);
}

select:hover {
  border-color: var(--admin-primary);
}

select:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 2px rgba(51, 102, 255, 0.1);
}

/* 搜索框中的下拉菜单 */
.admin-search-box select {
  min-width: 150px;
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
  
  /* 移动端下拉菜单样式 */
  select {
    padding: 8px 12px;
    font-size: 13px;
    background-size: 14px;
    background-position: right 10px center;
  }
  
  .admin-search-box select {
    width: 100%;
  }
}
</style>