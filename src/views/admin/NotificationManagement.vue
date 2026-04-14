<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <AdminNavbar />
    
    <!-- 主要内容区域 -->
    <main class="admin-content">
      <!-- 页面标题 -->
      <h1 class="admin-page-title">{{ $t('notifyTitle') }}</h1>
      
      <!-- 操作区域 -->
      <div class="admin-action-bar">
        <button class="admin-btn admin-btn-primary" @click="openBatchSendModal">{{ $t('notifyBatchSend') }}</button>
      </div>
      
      <!-- 通知历史列表 -->
      <div class="admin-card">
        <h2 style="font-size: 20px; margin-bottom: 20px; color: var(--admin-text); font-weight: 600;">{{ $t('notifyHistory') }}</h2>
        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
          <div class="admin-search-box">
            <input type="text" :placeholder="$t('notifySearch')" v-model="searchQuery" />
          </div>
          <div class="admin-search-box">
            <select v-model="filterStatus" class="admin-form-group select">
              <option value="">{{ $t('notifyAllStatus') }}</option>
              <option value="sent">{{ $t('notifySent') }}</option>
              <option value="pending">{{ $t('notifyPending') }}</option>
              <option value="failed">{{ $t('notifyFailed') }}</option>
            </select>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="admin-loading-container">
          <div class="admin-loading-spinner"></div>
          <p>{{ $t('common.loading') }}</p>
        </div>
        
        <!-- 数据为空状态 -->
        <div v-else-if="filteredNotifications.length === 0" class="admin-empty-state">
          <div class="admin-empty-state-icon">📭</div>
          <div class="admin-empty-state-title">{{ $t('common.noData') }}</div>
          <div class="admin-empty-state-desc">{{ $t('common.noNotificationData') }}</div>
          <button class="admin-btn admin-btn-primary" @click="fetchNotifications">{{ $t('common.refresh') }}</button>
        </div>
        
        <!-- 表格容器 -->
        <div class="admin-table-container" v-else>
          <!-- 表格 -->
          <table class="admin-table">
          <thead>
            <tr>
              <th>{{ $t('notifyId') }}</th>
              <th>{{ $t('notifyType') }}</th>
              <th>{{ $t('notifyTarget') }}</th>
              <th>{{ $t('notifyContent') }}</th>
              <th>{{ $t('notifyTime') }}</th>
              <th>{{ $t('notifyStatus') }}</th>
              <th>{{ $t('notifyActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="notification in filteredNotifications" :key="notification.id">
              <td>{{ notification.id }}</td>
              <td>{{ getNotificationTypeText(notification.type) }}</td>
              <td>{{ notification.target }}</td>
              <td>{{ notification.content.substring(0, 30) }}...</td>
              <td>{{ notification.sendTime }}</td>
              <td>
                <span class="admin-status-badge" :class="getStatusCode(notification.status)">{{ getStatusText(notification.status) }}</span>
              </td>
              <td>
                <button class="admin-btn admin-btn-primary" @click="$event => viewNotificationDetail(notification, $event)">{{ $t('notifyView') }}</button>
                <button class="admin-btn admin-btn-warning" @click="resendNotification(notification.id)">{{ $t('notifyResend') }}</button>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="admin-pagination" v-if="notifications.length > 0 && (filteredNotifications.length > 0 || !filterStatus)">
        <button class="admin-page-btn" :disabled="currentPage === 1" @click="previousPage">{{ $t('admin.notifications.previousPage') }}</button>
        <span class="admin-page-info">第 {{ currentPage }} 页，共 {{ !filterStatus ? totalPages : Math.ceil(filteredNotificationsFull.length / pageSize) }} 页</span>
        <button class="admin-page-btn" :disabled="currentPage >= (!filterStatus ? totalPages : Math.ceil(filteredNotificationsFull.length / pageSize))" @click="nextPage">{{ $t('admin.notifications.nextPage') }}</button>
      </div>
      <div class="admin-empty-state" v-else-if="notifications.length > 0 && filteredNotifications.length === 0">
        <div class="admin-empty-state-icon">📭</div>
        <div class="admin-empty-state-title">{{ $t('common.noData') }}</div>
        <div class="admin-empty-state-description">{{ $t('common.noDataDescription') }}</div>
      </div>
      <div class="admin-empty-state" v-else>
        <div class="admin-empty-state-icon">📭</div>
        <div class="admin-empty-state-title">{{ $t('common.noData') }}</div>
        <div class="admin-empty-state-description">{{ $t('common.noDataDescription') }}</div>
      </div>
      
      <!-- 发送通知弹窗 -->
      <div class="admin-modal-overlay" v-if="showSendModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ $t('notifySend') }}</h2>
            <button class="admin-modal-close" @click="showSendModal = false">&times;</button>
          </div>
          <div class="admin-modal-body">
            <form class="admin-form" @submit.prevent="sendNotification">
              <div class="admin-form-group">
                <label>{{ $t('notifyType') }}</label>
                <select v-model="sendForm.type" required>
                  <option value="user">{{ $t('notifyUser') }}</option>
                  <option value="system">{{ $t('notifySystem') }}</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyPhone') }}</label>
                <input type="tel" v-model="sendForm.phone" :placeholder="$t('notifyPhone')" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyTitle') }}</label>
                <input type="text" v-model="sendForm.title" :placeholder="$t('notifyTitle')" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyContent') }}</label>
                <textarea v-model="sendForm.content" :placeholder="$t('notifyContent')" rows="4" required></textarea>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyMethod') }}</label>
                <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                  <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;"><input type="checkbox" v-model="sendForm.methods" value="短信" /> {{ $t('notifySms') }}</label>
                  <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;"><input type="checkbox" v-model="sendForm.methods" value="邮件" /> {{ $t('notifyEmail') }}</label>
                  <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;"><input type="checkbox" v-model="sendForm.methods" value="微信" /> {{ $t('notifyWechat') }}</label>
                  <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;"><input type="checkbox" v-model="sendForm.methods" value="系统" /> {{ $t('notifySystemMsg') }}</label>
                </div>
              </div>
              <div class="admin-form-row" style="justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="admin-btn admin-btn-secondary" @click="showSendModal = false">{{ $t('commonCancel') }}</button>
                <button type="submit" class="admin-btn admin-btn-primary">{{ $t('notifySend') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- 批量发送通知弹窗 -->
      <div class="admin-modal-overlay" v-if="showBatchSendModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ $t('adminNotificationsBatchSend') }}</h2>
            <button class="admin-modal-close" @click="showBatchSendModal = false">&times;</button>
          </div>
          <div class="admin-modal-body">
            <form class="admin-form" @submit.prevent="batchSendNotification">
              <div class="admin-form-group">
                <label>{{ $t('adminNotificationsType') }}</label>
                <select v-model="batchForm.type" required>
                  <option value="user">{{ $t('adminNotificationsUserNotification') }}</option>
                  <option value="system">{{ $t('adminNotificationsSystemNotification') }}</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyScope') }}</label>
                <select v-model="batchForm.scope" required>
                  <option value="all">{{ $t('notifyAllUsers') }}</option>
                  <option value="active">{{ $t('notifyActiveUsers') }}</option>
                  <option value="inactive">{{ $t('notifyInactiveUsers') }}</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyPlanCategory') }}</label>
                <select v-model="batchForm.planType">
                  <option value="">{{ $t('notifyAllPlans') }}</option>
                  <option value="basic">{{ $t('notifyBasicPlan') }}</option>
                  <option value="standard">{{ $t('notifyStandardPlan') }}</option>
                  <option value="premium">{{ $t('notifyPremiumPlan') }}</option>
                  <option value="enterprise">{{ $t('notifyEnterprisePlan') }}</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyTitle') }}</label>
                <input type="text" v-model="batchForm.title" :placeholder="$t('notifyTitle')" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyContent') }}</label>
                <textarea v-model="batchForm.content" :placeholder="$t('notifyContent')" rows="4" required></textarea>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyMethod') }}</label>
                <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                  <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;"><input type="checkbox" v-model="batchForm.methods" value="短信" /> {{ $t('notifySms') }}</label>
                  <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;"><input type="checkbox" v-model="batchForm.methods" value="邮件" /> {{ $t('notifyEmail') }}</label>
                  <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;"><input type="checkbox" v-model="batchForm.methods" value="微信" /> {{ $t('notifyWechat') }}</label>
                  <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;"><input type="checkbox" v-model="batchForm.methods" value="系统" /> {{ $t('notifySystemMsg') }}</label>
                </div>
              </div>
              <div class="admin-form-row" style="justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="admin-btn admin-btn-secondary" @click="showBatchSendModal = false">{{ $t('commonCancel') }}</button>
                <button type="submit" class="admin-btn admin-btn-primary">{{ $t('notifyBatchSend') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- 首页弹窗通知弹窗 -->
      <div class="admin-modal-overlay" v-if="showHomepageModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ $t('notifyHomepage') }}</h2>
            <button class="admin-modal-close" @click="showHomepageModal = false">&times;</button>
          </div>
          <div class="admin-modal-body">
            <form class="admin-form" @submit.prevent="sendHomepageNotification">
              <div class="admin-form-group">
                <label>{{ $t('notifyPopupTitle') }}</label>
                <input type="text" v-model="homepageForm.title" :placeholder="$t('notifyPopupTitle')" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyPopupContent') }}</label>
                <textarea v-model="homepageForm.content" :placeholder="$t('notifyPopupContent')" rows="4" required></textarea>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyPopupType') }}</label>
                <select v-model="homepageForm.popupType" required>
                  <option value="info">{{ $t('notifyInfo') }}</option>
                  <option value="warning">{{ $t('notifyWarning') }}</option>
                  <option value="success">{{ $t('notifySuccess') }}</option>
                  <option value="promotion">{{ $t('notifyPromo') }}</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyStartTime') }}</label>
                <input type="datetime-local" v-model="homepageForm.startTime" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyEndTime') }}</label>
                <input type="datetime-local" v-model="homepageForm.endTime" required />
              </div>
              <div class="admin-form-group">
                <label>{{ $t('notifyForceDisplay') }}</label>
                <input type="checkbox" v-model="homepageForm.forceShow" />
              </div>
              <div class="admin-form-row" style="justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="admin-btn admin-btn-secondary" @click="showHomepageModal = false">{{ $t('commonCancel') }}</button>
                <button type="submit" class="admin-btn admin-btn-primary">{{ $t('notifyPublish') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- 查看通知详情弹窗 -->
      <div class="admin-modal-overlay" v-if="showViewModal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">{{ $t('notifyDetails') }}</h2>
            <button class="admin-modal-close" @click="showViewModal = false">&times;</button>
          </div>
          <div class="admin-modal-body">
            <div v-if="viewNotification">
              <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                <label style="width: 100px; font-weight: 500; color: #666;">{{ $t('notifyTarget') }}:</label>
                <span style="flex: 1; color: #333; word-break: break-word;">{{ viewNotification.target }}</span>
              </div>
              <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                <label style="width: 100px; font-weight: 500; color: #666;">{{ $t('notifyType') }}:</label>
                <span style="flex: 1; color: #333; word-break: break-word;">{{ getNotificationTypeText(viewNotification.type) }}</span>
              </div>
              <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                <label style="width: 100px; font-weight: 500; color: #666;">{{ $t('notifyTitle') }}:</label>
                <span style="flex: 1; color: #333; word-break: break-word;">{{ viewNotification.title }}</span>
              </div>
              <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                <label style="width: 100px; font-weight: 500; color: #666;">{{ $t('notifyContent') }}:</label>
                <span style="flex: 1; color: #333; word-break: break-word;">{{ viewNotification.content }}</span>
              </div>
              <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                <label style="width: 100px; font-weight: 500; color: #666;">{{ $t('notifyTime') }}:</label>
                <span style="flex: 1; color: #333; word-break: break-word;">{{ viewNotification.sendTime }}</span>
              </div>
              <div style="display: flex; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                <label style="width: 100px; font-weight: 500; color: #666;">{{ $t('notifyStatus') }}:</label>
                <span class="admin-status-badge" :class="getStatusCode(viewNotification.status)">{{ getStatusText(viewNotification.status) }}</span>
              </div>
              <div class="admin-form-row" style="justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="admin-btn admin-btn-secondary" @click="showViewModal = false">{{ $t('commonCancel') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 消息提示侧边栏 -->
      <div v-if="showMessageModal" class="admin-toast" @click="showMessageModal = false">
        <div class="admin-toast-content">
          <div class="admin-toast-header">
            <h3 class="admin-toast-title">{{ $t('commonAlert') }}</h3>
            <button class="admin-toast-close" @click.stop="showMessageModal = false">×</button>
          </div>
          <div class="admin-toast-body">
            <p>{{ message }}</p>
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
  name: 'NotificationManagement',
  components: {
    AdminNavbar
  },
  data() {
    return {
      notifications: [],
      searchQuery: '',
      filterStatus: '',
      showSendModal: false,
      showBatchSendModal: false,
      showHomepageModal: false,
      showViewModal: false,
      showMessageModal: false,
      message: '',
      sendForm: {
        type: 'user',
        phone: '',
        title: '',
        content: '',
        methods: []
      },
      batchForm: {
        type: 'user',
        scope: 'all',
        planType: '',
        title: '',
        content: '',
        methods: []
      },
      homepageForm: {
        title: '',
        content: '',
        popupType: 'info',
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        forceShow: false
      },
      viewNotification: {},
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      isLoading: false
    };
  },
  mounted() {
    // 确保t函数在methods中能够正确访问
    this.fetchNotifications();
  },
  methods: {
    getStatusCode(status) {
      if (status === 'sent' || status === '已发送') {
        return 'admin-status-success';
      } else if (status === 'pending' || status === '待发送') {
        return 'admin-status-warning';
      } else if (status === 'failed' || status === '发送失败') {
        return 'admin-status-danger';
      }
      return '';
    },
    async fetchNotifications() {
      this.isLoading = true;
      try {
        // 一次性获取所有通知数据，不分页、不过滤
        const params = {
          page: 1,
          size: 1000 // 设置一个足够大的数，确保获取所有数据
        };
        
        const data = await apiService.get('/admin/notifications', { params });
        
        if (data.code === 200) {
          // 转换通知数据，确保字段名正确
          const processedNotifications = (data.data.records || []).map(notification => {
            // 处理时间格式
            const sendTime = notification.sendTime || notification.createTime || notification.time;
            // 将ISO 8601格式的时间转换为更易读的格式，去掉T分隔符
            const formattedSendTime = sendTime ? sendTime.replace('T', ' ') : '';
            const timestamp = new Date(sendTime).getTime();
            
            return {
              id: notification.id,
              title: notification.title,
              content: notification.content || notification.message || notification.text || '',
              type: notification.type,
              sendTime: formattedSendTime,
              timestamp: timestamp,
              status: notification.status,
              readCount: notification.viewCount || 0,
              target: notification.target || '所有用户'
            };
          });
          
          // 按照时间倒序排序，最新的通知放在前面
          processedNotifications.sort((a, b) => b.timestamp - a.timestamp);
          
          // 移除timestamp字段，只保留需要显示的字段
          this.notifications = processedNotifications.map(notification => {
            const { timestamp, ...notificationWithoutTimestamp } = notification;
            return notificationWithoutTimestamp;
          });
          
          // 计算总页数
          this.totalPages = Math.ceil(this.notifications.length / this.pageSize);
          console.log('获取通知列表成功:', this.notifications);
          console.log('总页数:', this.totalPages);
        } else {
          this.showMessage(this.$t('adminNotificationsFetchFailed') + '：' + (data.message || this.$t('adminSystemUnknownError')));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        this.showMessage(this.$t('adminSystemNetworkError'));
      } finally {
        this.isLoading = false;
      }
    },
    
    // 打开发送通知弹窗
    openSendModal() {
      console.log('打开发送通知弹窗');
      this.sendForm = {
        type: 'user',
        phone: '',
        title: '',
        content: '',
        methods: []
      };
      this.showSendModal = true;
      console.log('showSendModal:', this.showSendModal);
    },
    
    // 打开批量发送通知弹窗
    openBatchSendModal() {
      console.log('打开批量发送通知弹窗');
      this.batchForm = {
        type: 'user',
        scope: 'all',
        planType: '',
        title: '',
        content: '',
        methods: []
      };
      this.showBatchSendModal = true;
      console.log('showBatchSendModal:', this.showBatchSendModal);
    },
    
    // 打开首页弹窗通知弹窗
    openHomepageModal() {
      console.log('打开首页弹窗通知弹窗');
      this.homepageForm = {
        title: '',
        content: '',
        popupType: 'info',
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        forceShow: false
      };
      this.showHomepageModal = true;
      console.log('showHomepageModal:', this.showHomepageModal);
    },
    
    // 发送通知
    async sendNotification() {
      if (!this.sendForm.methods.length) {
        this.showMessage(this.$t('adminNotificationsFetchFailed'));
        return;
      }
      
      this.isLoading = true;
      try {
        const data = await apiService.post('/admin/notifications', {
          title: this.sendForm.title,
          content: this.sendForm.content,
          type: this.sendForm.type,
          userIds: [], // 暂时不支持指定用户
          sendToAll: false
        });
        
        if (data.code === 200) {
          this.showSendModal = false;
          // 重新获取通知列表，确保显示最新的通知
          await this.fetchNotifications();
          this.showMessage(this.$t('adminNotificationsSendSuccess'));
        } else {
          this.showMessage(this.$t('adminNotificationsSendFailed') + '：' + (data.message || this.$t('adminSystemUnknownError')));
        }
      } catch (error) {
        console.error('Error sending notification:', error);
        this.showMessage(this.$t('adminSystemNetworkError'));
      } finally {
        this.isLoading = false;
      }
    },
    
    // 批量发送通知
    async batchSendNotification() {
      if (!this.batchForm.methods.length) {
        this.showMessage(this.$t('adminNotificationsFetchFailed'));
        return;
      }
      
      this.isLoading = true;
      try {
        const data = await apiService.post('/admin/notifications', {
          title: this.batchForm.title,
          content: this.batchForm.content,
          type: this.batchForm.type,
          userIds: [],
          sendToAll: true
        });
        
        if (data.code === 200) {
          this.showBatchSendModal = false;
          // 重新获取通知列表，确保显示最新的通知
          await this.fetchNotifications();
          this.showMessage(this.$t('adminNotificationsBatchSendSuccess'));
        } else {
          this.showMessage(this.$t('adminNotificationsBatchSendFailed') + '：' + (data.message || this.$t('adminSystemUnknownError')));
        }
      } catch (error) {
        console.error('Error sending batch notification:', error);
        this.showMessage(this.$t('adminSystemNetworkError'));
      } finally {
        this.isLoading = false;
      }
    },
    
    // 发送首页弹窗通知
    async sendHomepageNotification() {
      this.isLoading = true;
      try {
        const data = await apiService.post('/admin/notifications', {
          title: this.homepageForm.title,
          content: this.homepageForm.content,
          type: 'system',
          userIds: [],
          sendToAll: true
        });
        
        if (data.code === 200) {
          this.showHomepageModal = false;
          // 重新获取通知列表，确保显示最新的通知
          await this.fetchNotifications();
          this.showMessage(this.$t('adminNotificationsHomepagePublishSuccess'));
        } else {
          this.showMessage(this.$t('adminNotificationsHomepagePublishFailed') + '：' + (data.message || this.$t('adminSystemUnknownError')));
        }
      } catch (error) {
        console.error('Error sending homepage notification:', error);
        this.showMessage(this.$t('adminSystemNetworkError'));
      } finally {
        this.isLoading = false;
      }
    },
    
    
    
    // 重发通知
    async resendNotification(id) {
      this.isLoading = true;
      try {
        // 查找通知
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          // 构建重发请求数据
          const requestData = {
            title: notification.title,
            content: notification.content,
            type: notification.type,
            userIds: [], // 暂时不支持指定用户
            sendToAll: true // 发送给所有用户
          };
          
          console.log('重发通知请求数据:', requestData);
          const data = await apiService.post('/admin/notifications', requestData);
          
          if (data.code === 200) {
            // 重新获取通知列表，确保显示最新的通知
            await this.fetchNotifications();
            this.showMessage(this.$t('adminNotificationsResendSuccess'));
          } else {
            this.showMessage(this.$t('adminNotificationsResendFailed') + '：' + (data.message || this.$t('adminSystemUnknownError')));
          }
        } else {
          this.showMessage(this.$t('adminNotificationsNotFound'));
        }
      } catch (error) {
        console.error('Error resending notification:', error);
        this.showMessage(this.$t('adminSystemNetworkError'));
      } finally {
        this.isLoading = false;
      }
    },
    
    // 获取通知类型文本
    getNotificationTypeText(type) {
      const types = {
        user: this.$t('adminNotificationsUserNotification'),
        system: this.$t('adminNotificationsSystemNotification'),
        homepage: this.$t('adminNotificationsHomepagePopup')
      };
      return types[type] || this.$t('adminNotificationsType');
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statuses = {
        sent: this.$t('adminNotificationsSent'),
        pending: this.$t('adminNotificationsPending'),
        failed: this.$t('adminNotificationsFailed'),
        '已发送': this.$t('adminNotificationsSent'),
        '待发送': this.$t('adminNotificationsPending'),
        '发送失败': this.$t('adminNotificationsFailed')
      };
      return statuses[status] || this.$t('adminNotificationsStatus');
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      const statusMap = {
        sent: 'sent',
        pending: 'pending',
        failed: 'failed',
        '已发送': 'sent',
        '待发送': 'pending',
        '发送失败': 'failed'
      };
      return statusMap[status] || '';
    },
    
    // 查看通知详情
    viewNotificationDetail(notification, event) {
      // 阻止事件冒泡
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      
      console.log('查看通知详情:', notification);
      this.viewNotification = notification;
      this.showViewModal = true;
      console.log('showViewModal:', this.showViewModal);
      console.log('viewNotification:', this.viewNotification);
    },
    
    // 显示自定义通知提示框
    showMessage(message) {
      this.message = message;
      this.showMessageModal = true;
      
      // 2秒后自动关闭
      setTimeout(() => {
        this.showMessageModal = false;
      }, 2000);
    },
    
    // 上一页
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    // 下一页
    nextPage() {
      if (!this.filterStatus) {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      } else {
        const totalFilteredPages = Math.ceil(this.filteredNotificationsFull.length / this.pageSize);
        if (this.currentPage < totalFilteredPages) {
          this.currentPage++;
        }
      }
    },
    
    // 当筛选条件变化时重置页码
    resetPagination() {
      this.currentPage = 1;
    }
  },
  watch: {
    // 当搜索查询变化时重置页码
    searchQuery() {
      this.resetPagination();
    },
    // 当状态筛选变化时重置页码
    filterStatus() {
      this.resetPagination();
    }
  },
  computed: {
    // 过滤后的完整通知列表（未分页）
    filteredNotificationsFull() {
      let result = [...this.notifications];
      
      // 搜索过滤
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        result = result.filter(notification => {
          const contentMatch = notification.content && notification.content.toLowerCase().includes(searchLower);
          const titleMatch = notification.title && notification.title.toLowerCase().includes(searchLower);
          return contentMatch || titleMatch;
        });
      }
      
      // 状态过滤
      if (this.filterStatus) {
        result = result.filter(notification => {
          // 处理中英文状态值的匹配
          const statusMap = {
            'sent': ['sent', '已发送'],
            'pending': ['pending', '待发送'],
            'failed': ['failed', '发送失败']
          };
          const statuses = statusMap[this.filterStatus] || [this.filterStatus];
          return statuses.includes(notification.status);
        });
      }
      
      return result;
    },
    
    // 过滤并分页后的通知列表
    filteredNotifications() {
      const result = this.filteredNotificationsFull;
      
      // 根据当前页码和每页大小进行分页
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return result.slice(startIndex, endIndex);
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
  min-width: 800px;
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
    min-width: 600px;
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