# 智慧监控系统后端接口文档

## 1. 技术栈

- **框架**: Spring Boot 3.x
- **数据库**: MySQL 5.7
- **JDK**: 17
- **构建工具**: Maven

## 2. 数据库设计

### 2.1 用户表 (`users`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | 用户ID |
| `username` | `VARCHAR(50)` | `NOT NULL` | 用户名 |
| `password` | `VARCHAR(255)` | `NOT NULL` | 密码（加密存储） |
| `phone` | `VARCHAR(20)` | `UNIQUE NOT NULL` | 手机号 |
| `email` | `VARCHAR(100)` | `UNIQUE` | 邮箱 |
| `plan` | `VARCHAR(20)` | `NOT NULL DEFAULT 'none'` | 套餐类型（直接存储套餐中文名称，如：无套餐、基础版、标准版等） |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'normal'` | 状态 (normal/disabled) |
| `register_time` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 注册时间 |
| `last_login` | `DATETIME` | | 最后登录时间 |
| `expire_date` | `DATETIME` | `NOT NULL` | 套餐到期时间 |
| `max_monitors` | `INT` | `NOT NULL DEFAULT 3` | 最大监控数量 |
| `current_monitors` | `INT` | `NOT NULL DEFAULT 0` | 当前监控数量 |

### 2.2 管理员表 (`admin_users`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | 管理员ID |
| `username` | `VARCHAR(50)` | `UNIQUE NOT NULL` | 用户名 |
| `password` | `VARCHAR(255)` | `NOT NULL` | 密码（加密存储） |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

### 2.3 套餐表 (`plans`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | 套餐ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | 套餐名称 |
| `price` | `DECIMAL(10,2)` | `NOT NULL` | 价格 |
| `original_price` | `DECIMAL(10,2)` | | 原价 |
| `discount` | `DECIMAL(5,2)` | | 折扣（0-10） |
| `discount_period` | `DATETIME` | | 折扣到期时间 |
| `period` | `VARCHAR(20)` | `NOT NULL` | 周期（月/年/永久） |
| `max_cameras` | `INT` | `NOT NULL` | 最大监控数量 |
| `has_exclusive_service` | `INT` | `NOT NULL DEFAULT 0` | 是否有专属客服（0: 无, 1: 有） |
| `ai_level` | `INT` | `NOT NULL DEFAULT 1` | AI识别类型级别（1-4） |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'active'` | 状态 (active/inactive) |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

### 2.5 卡密表 (`cards`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | 卡密ID |
| `code` | `VARCHAR(100)` | `UNIQUE NOT NULL` | 卡密码 |
| `type` | `VARCHAR(20)` | `NOT NULL` | 卡密类型 (天卡/周卡/月卡/年卡/永久卡/体验卡) |
| `plan` | `VARCHAR(50)` | `NOT NULL` | 套餐类型 |
| `validity` | `INT` | `NOT NULL` | 有效期（天） |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'unused'` | 状态 (unused/used) |
| `generate_time` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 生成时间 |
| `use_time` | `DATETIME` | | 使用时间 |
| `user_id` | `BIGINT` | `REFERENCES users(id)` | 使用用户ID |
| `user_phone` | `VARCHAR(20)` | | 使用用户手机号 |

### 2.6 监控表 (`monitorings`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT=10001` | 监控ID（从10001开始递增） |
| `user_id` | `BIGINT` | `NOT NULL REFERENCES users(id)` | 用户ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | 监控名称 |
| `url` | `VARCHAR(255)` | `NOT NULL` | 监控地址 |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT '离线'` | 状态 (在线/离线) |
| `health_status` | `VARCHAR(20)` | `NOT NULL DEFAULT '正常'` | 健康状态 (正常/封禁) |
| `monitoring_range` | `VARCHAR(20)` | `NOT NULL DEFAULT '室内'` | 监控范围 (室内/室外) |
| `add_time` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 添加时间 |
| `last_online` | `DATETIME` | | 最后在线时间 |
| `last_updated` | `DATETIME` | | 最后更新时间 |
| `emergency_contact1_name` | `VARCHAR(50)` | | 紧急联系人1姓名 |
| `emergency_contact1_phone` | `VARCHAR(20)` | | 紧急联系人1电话 |
| `emergency_contact2_name` | `VARCHAR(50)` | | 紧急联系人2姓名 |
| `emergency_contact2_phone` | `VARCHAR(20)` | | 紧急联系人2电话 |
| `emergency_contact3_name` | `VARCHAR(50)` | | 紧急联系人3姓名 |
| `emergency_contact3_phone` | `VARCHAR(20)` | | 紧急联系人3电话 |
| `emergency_contact4_name` | `VARCHAR(50)` | | 紧急联系人4姓名 |
| `emergency_contact4_phone` | `VARCHAR(20)` | | 紧急联系人4电话 |
| `emergency_contact5_name` | `VARCHAR(50)` | | 紧急联系人5姓名 |
| `emergency_contact5_phone` | `VARCHAR(20)` | | 紧急联系人5电话 |

### 2.7 通知表 (`notifications`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | 通知ID |
| `title` | `VARCHAR(100)` | `NOT NULL` | 通知标题 |
| `content` | `TEXT` | `NOT NULL` | 通知内容 |
| `type` | `VARCHAR(20)` | `NOT NULL` | 通知类型 |
| `send_time` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 发送时间 |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT '已发送'` | 状态 |
| `view_count` | `INT` | `NOT NULL DEFAULT 0` | 查看次数 |

### 2.8 用户通知关联表 (`user_notifications`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | ID |
| `notification_id` | `BIGINT` | `NOT NULL REFERENCES notifications(id)` | 通知ID |
| `user_id` | `BIGINT` | `NOT NULL REFERENCES users(id)` | 用户ID |
| `is_read` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | 是否已读 |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |

### 2.9 告警表 (`alerts`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | 告警ID |
| `monitor_id` | `BIGINT` | `NOT NULL REFERENCES monitorings(id)` | 监控ID |
| `user_id` | `BIGINT` | `NOT NULL REFERENCES users(id)` | 用户ID |
| `range` | `VARCHAR(20)` | `NOT NULL` | 监控范围（室内/室外） |
| `time` | `DATETIME` | `NOT NULL` | 告警时间 |
| `camera` | `VARCHAR(100)` | `NOT NULL` | 监控名称 |
| `type` | `VARCHAR(50)` | `NOT NULL` | 告警类型 |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'pending'` | 告警状态（pending/resolved） |
| `issue` | `VARCHAR(255)` | `NOT NULL` | 告警问题 |
| `details` | `TEXT` | `NOT NULL` | 告警详情 |
| `sms_notified` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | 是否短信通知 |
| `phone_notified` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | 是否电话通知 |

### 2.10 系统设置表 (`system_settings`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | 设置ID |
| `site_title` | `VARCHAR(100)` | `NOT NULL DEFAULT '康养云端'` | 网站标题 |
| `site_domain` | `VARCHAR(255)` | `NOT NULL DEFAULT 'https://kangyang.example.com'` | 网站域名 |
| `icp` | `VARCHAR(100)` | `NOT NULL DEFAULT '京ICP备2024322061号-2'` | 网站备案号 |
| `site_description` | `VARCHAR(255)` | `NOT NULL DEFAULT '智慧老人安全监护平台'` | 网站描述 |
| `system_name` | `VARCHAR(100)` | `NOT NULL DEFAULT '康养云端'` | 系统名称 |
| `system_version` | `VARCHAR(20)` | `NOT NULL DEFAULT '1.0.0'` | 系统版本 |
| `admin_email` | `VARCHAR(100)` | `NOT NULL DEFAULT 'admin@kangyang.example.com'` | 管理员邮箱 |
| `admin_phone` | `VARCHAR(20)` | `NOT NULL DEFAULT '400-697-5963'` | 管理员电话 |
| `api_base_url` | `VARCHAR(255)` | `NOT NULL DEFAULT 'https://kyapi.awenz.cn/'` | API基础地址 |
| `service_start_time` | `VARCHAR(5)` | `NOT NULL DEFAULT '08:00'` | 服务开始时间 |
| `service_end_time` | `VARCHAR(5)` | `NOT NULL DEFAULT '20:00'` | 服务结束时间 |
| `alert_delay` | `INT` | `NOT NULL DEFAULT 30` | 告警延迟时间（秒） |
| `sms_notification` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | 是否开启短信通知 |
| `email_notification` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | 是否开启邮件通知 |
| `max_users` | `INT` | `NOT NULL DEFAULT 5000` | 最大用户数 |
| `max_cameras_per_user` | `INT` | `NOT NULL DEFAULT 10` | 每用户最大摄像头数 |
| `sms_api_key` | `VARCHAR(255)` | `NOT NULL DEFAULT ''` | 短信API密钥 |
| `email_server` | `VARCHAR(255)` | `NOT NULL DEFAULT 'smtp.example.com'` | 邮件服务器 |
| `email_port` | `INT` | `NOT NULL DEFAULT 587` | 邮件端口 |
| `email_sender` | `VARCHAR(100)` | `NOT NULL DEFAULT 'noreply@kangyang.example.com'` | 发件人邮箱 |
| `wechat_app_id` | `VARCHAR(100)` | `NOT NULL DEFAULT ''` | 微信公众号AppID |
| `wechat_app_secret` | `VARCHAR(255)` | `NOT NULL DEFAULT ''` | 微信公众号AppSecret |
| `wechat_template_id` | `VARCHAR(100)` | `NOT NULL DEFAULT ''` | 微信模板消息ID |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

## 3. API 设计

### 3.1 接口总览

#### 3.1.1 接口分类

| 分类 | 描述 | 前缀 | 认证要求 |
| :--- | :--- | :--- | :--- |
| **认证管理** | 用户登录、注册等认证相关接口 | `/auth` | 无需认证 |
| **管理员认证** | 管理员登录接口 | `/admin/auth` | 无需认证 |
| **管理员面板** | 管理员仪表盘数据接口 | `/admin/dashboard` | 需要管理员认证 |
| **用户管理** | 管理员对用户的管理接口 | `/admin/users` | 需要管理员认证 |
| **套餐管理** | 管理员对套餐的管理接口 | `/admin/plans` | 需要管理员认证 |
| **卡密管理** | 管理员对卡密的管理接口 | `/admin/cards` | 需要管理员认证 |
| **监控管理** | 管理员对监控的管理接口 | `/admin/monitorings` | 需要管理员认证 |
| **通知管理** | 管理员对通知的管理接口 | `/admin/notifications` | 需要管理员认证 |
| **系统设置** | 管理员对系统设置的管理接口 | `/admin/settings` | 需要管理员认证 |
| **用户端** | 用户端面板和数据接口 | `/user` | 部分需要用户认证 |
| **用户信息** | 用户个人信息管理接口 | `/user/info` | 需要用户认证 |
| **用户监控** | 用户对监控的管理接口 | `/user/monitorings` | 需要用户认证 |
| **用户告警** | 用户对告警的管理接口 | `/user/alerts` | 需要用户认证 |
| **用户通知** | 用户对通知的管理接口 | `/user/notifications` | 需要用户认证 |
| **用户卡密** | 用户对卡密的使用接口 | `/user/cards` | 需要用户认证 |

#### 3.1.2 前端调用方法

#### 获取用户信息
```javascript
// 前端调用示例
fetch('/user/info', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`  // 登录时获取的 token
  }
})
.then(response => response.json())
.then(data => {
  console.log('用户信息:', data);
  // 处理用户信息数据
});
```

#### 获取用户告警记录
```javascript
// 前端调用示例
fetch('/user/alerts?page=1&size=10', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('告警记录:', data);
  // 处理告警记录数据
});
```

#### 获取用户监控列表
```javascript
// 前端调用示例
fetch('/user/monitorings?page=1&size=10', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('监控列表:', data);
  // 处理监控列表数据
});
```

#### 获取用户通知列表
```javascript
// 前端调用示例
fetch('/user/notifications?page=1&size=3', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('通知列表:', data);
  // 处理通知列表数据
});
```

#### 使用卡密
```javascript
// 前端调用示例
fetch('/user/cards/use', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'code': 'ABC123'  // 卡密代码
  })
})
.then(response => response.json())
.then(data => {
  console.log('卡密使用结果:', data);
  // 处理卡密使用结果
});
```

### 3.1.2 实现原理
1. **用户登录**：用户登录时，系统生成包含用户 ID 的 JWT token
2. **token 验证**：每次请求时，JwtAuthenticationFilter 验证 token 并从其中提取用户 ID
3. **用户 ID 存储**：将提取的用户 ID 存储到 SecurityContext 中
4. **接口调用**：当前端调用用户相关接口时，控制器从 SecurityContext 中获取当前登录用户的 ID
5. **数据返回**：根据获取的用户 ID 返回对应的数据

| 模块 | 接口路径 | 方法 | 功能描述 |
| :--- | :--- | :--- | :--- |
| **认证管理** | `/auth/login` | `POST` | 用户登录 |
| **认证管理** | `/auth/register` | `POST` | 用户注册 |
| **认证管理** | `/auth/forgot-password` | `POST` | 忘记密码 |
| **认证管理** | `/auth/third-party` | `POST` | 第三方登录 |
| **管理员认证** | `/admin/auth/login` | `POST` | 管理员登录 |
| **管理员面板** | `/admin/dashboard` | `GET` | 获取管理员面板概览数据 |
| **管理员面板** | `/admin/dashboard/charts` | `GET` | 获取管理员面板图表数据 |
| **用户管理** | `/admin/users` | `GET` | 获取用户列表（支持分页、搜索、状态和套餐过滤） |
| **用户管理** | `/admin/users` | `POST` | 添加用户 |
| **用户管理** | `/admin/users/{id}` | `GET` | 获取用户详情 |
| **用户管理** | `/admin/users/{id}` | `PUT` | 更新用户 |
| **用户管理** | `/admin/users/{id}/status` | `PATCH` | 切换用户状态 |
| **用户管理** | `/admin/users/{id}` | `DELETE` | 删除用户 |
| **套餐管理** | `/admin/plans` | `GET` | 获取套餐列表 |
| **套餐管理** | `/admin/plans` | `POST` | 添加套餐 |
| **套餐管理** | `/admin/plans/{id}` | `GET` | 获取套餐详情 |
| **套餐管理** | `/admin/plans/{id}` | `PUT` | 更新套餐 |
| **套餐管理** | `/admin/plans/{id}` | `DELETE` | 删除套餐 |
| **卡密管理** | `/admin/cards` | `GET` | 获取卡密列表（支持分页、搜索和状态过滤） |
| **卡密管理** | `/admin/cards/generate` | `POST` | 生成卡密 |
| **卡密管理** | `/admin/cards/{id}` | `DELETE` | 删除卡密 |
| **监控管理** | `/admin/monitorings` | `GET` | 获取监控列表（支持分页、搜索和状态过滤） |
| **监控管理** | `/admin/monitorings` | `POST` | 添加监控 |
| **监控管理** | `/admin/monitorings/{id}` | `GET` | 获取监控详情 |
| **监控管理** | `/admin/monitorings/{id}` | `PUT` | 更新监控 |
| **监控管理** | `/admin/monitorings/{id}/status` | `PATCH` | 切换监控状态 |
| **监控管理** | `/admin/monitorings/{id}/power` | `PUT` | 切换监控电源状态 |
| **监控管理** | `/admin/monitorings/{id}/emergency-contacts` | `POST` | 设置监控紧急联系人 |
| **监控管理** | `/admin/monitorings/{id}` | `DELETE` | 删除监控 |
| **通知管理** | `/admin/notifications` | `GET` | 获取通知列表（支持分页和搜索） |
| **通知管理** | `/admin/notifications` | `POST` | 发送通知 |
| **系统设置** | `/admin/settings` | `GET` | 获取系统设置 |
| **系统设置** | `/admin/settings` | `PUT` | 更新系统设置 |
| **用户端** | `/user/dashboard` | `GET` | 获取用户端面板概览数据 |
| **用户端** | `/user/dashboard/charts` | `GET` | 获取用户端面板图表数据 |
| **用户信息** | `/user/info` | `GET` | 获取用户信息 |
| **用户信息** | `/user/info` | `PUT` | 更新用户信息 |
| **用户信息** | `/user/password` | `PUT` | 修改密码 |
| **用户监控** | `/user/monitorings` | `GET` | 获取用户监控列表（支持分页） |
| **用户监控** | `/user/monitorings` | `POST` | 添加监控 |
| **用户监控** | `/user/monitorings/{id}` | `GET` | 获取监控详情 |
| **用户监控** | `/user/monitorings/{id}` | `PUT` | 更新用户监控 |
| **用户监控** | `/user/monitorings/{id}` | `DELETE` | 删除用户监控 |
| **用户监控** | `/user/monitorings/refresh` | `POST` | 刷新所有监控 |
| **用户监控** | `/user/monitorings/{id}/power` | `PUT` | 切换监控电源状态 |
| **用户监控** | `/user/monitorings/{id}/reconnect` | `POST` | 重新连接监控 |
| **用户监控** | `/user/monitorings/{id}/emergency-contacts` | `POST` | 设置监控紧急联系人 |
| **用户告警** | `/user/alerts` | `GET` | 获取告警记录（支持分页） |
| **用户告警** | `/user/alerts/{id}` | `GET` | 获取告警详情 |
| **用户告警** | `/user/alerts/{id}/resolve` | `PUT` | 处理告警 |
| **用户通知** | `/user/notifications` | `GET` | 获取用户通知列表（支持分页） |
| **用户通知** | `/user/notifications/{id}` | `GET` | 获取通知详情 |
| **用户通知** | `/user/notifications/{id}/read` | `PATCH` | 标记通知为已读 |
| **用户卡密** | `/user/cards/verify` | `POST` | 验证卡密 |
| **用户卡密** | `/user/cards/use` | `POST` | 使用卡密 |

### 3.2 认证管理接口

#### 3.2.1 用户登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "用户名或手机号",
    "password": "密码",
    "remember": true
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "id": 1,
      "username": "张三",
      "phone": "13800138001",
      "plan": "基础版",
      "maxMonitors": 3,
      "currentMonitors": 0,
      "remainingMonitors": 3,
      "token": "mock-token-1"
    }
  }
  ```

#### 3.2.2 用户注册

- **URL**: `/auth/register`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "firstName": "姓",
    "lastName": "名",
    "phone": "手机号",
    "email": "邮箱",
    "password": "密码",
    "confirmPassword": "确认密码",
    "acceptTerms": true
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "注册成功",
    "data": {
      "id": 1,
      "username": "张三",
      "phone": "13800138001",
      "email": "zhangsan@example.com"
    }
  }
  ```

#### 3.2.3 忘记密码

- **URL**: `/auth/forgot-password`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "email": "邮箱地址"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "密码重置链接已发送到邮箱"
  }
  ```

#### 3.2.4 第三方登录

- **URL**: `/auth/third-party`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "platform": "weixin",
    "code": "第三方登录码"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "id": 1,
      "username": "张三",
      "token": "登录凭证"
    }
  }
  ```

#### 3.2.5 管理员登录

- **URL**: `/admin/auth/login`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "管理员用户名",
    "password": "管理员密码",
    "remember": true
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "id": 1,
      "username": "admin",
      "token": "admin-1-YWRtaW4=",
      "expiresAt": 1770873000000
    }
  }
  ```
- **说明**:
  - 登录成功后，系统会返回管理员token
  - 访问其他管理端接口时，需要在请求头中携带 `Authorization: Bearer {token}`
  - token有效期为24小时，过期后需要重新登录获取新token

### 3.3 管理员面板接口

#### 3.3.1 获取管理员面板概览数据

- **URL**: `/admin/dashboard`
- **方法**: `GET`
- **认证要求**: 需要在请求头中携带 `Authorization: Bearer {token}`
- **说明**: 该接口需要管理员登录后获取的token才能访问
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "totalUsers": 1258,
      "totalCameras": 3756,
      "onlineCameras": 3241,
      "offlineCameras": 515,
      "planUsers": 892,
      "planCount": 3,
      "todayNewUsers": 23,
      "todayNewCameras": 45
    }
  }
  ```

#### 3.3.2 获取管理员面板图表数据

- **URL**: `/admin/dashboard/charts`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "userGrowth": {
        "labels": ["1月", "2月", "3月", "4月", "5月", "6月"],
        "data": [320, 580, 720, 890, 1050, 1258]
      },
      "cameraStatus": {
        "labels": ["在线", "离线"],
        "data": [3241, 515]
      },
      "planDistribution": {
        "labels": ["基础版", "标准版", "高级版"],
        "data": [450, 320, 122]
      }
    }
  }
  ```

#### 3.3.3 获取系统设置

- **URL**: `/admin/settings`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "siteTitle": "康养云端",
      "siteDomain": "https://kangyang.example.com",
      "icp": "京ICP备2024322061号-2",
      "siteDescription": "智慧老人安全监护平台",
      "systemName": "康养云端",
      "systemVersion": "1.0.0",
      "adminEmail": "admin@kangyang.example.com",
      "adminPhone": "400-697-5963",
      "apiBaseUrl": "https://api.kangyang.example.com",
      "serviceStartTime": "08:00",
      "serviceEndTime": "20:00",
      "alertDelay": 30,
      "smsNotification": true,
      "emailNotification": true,
      "maxUsers": 5000,
      "maxCamerasPerUser": 10,
      "smsApiKey": "",
      "emailServer": "smtp.example.com",
      "emailPort": 587,
      "emailSender": "noreply@kangyang.example.com",
      "wechatAppId": "",
      "wechatAppSecret": "",
      "wechatTemplateId": ""
    }
  }
  ```

#### 3.3.4 更新系统设置

- **URL**: `/admin/settings`
- **方法**: `PUT`
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `siteTitle` | String | 否 | 网站标题 |
  | `siteDomain` | String | 否 | 网站域名 |
  | `icp` | String | 否 | 网站备案号 |
  | `siteDescription` | String | 否 | 网站描述 |
  | `systemName` | String | 否 | 系统名称 |
  | `adminEmail` | String | 否 | 管理员邮箱 |
  | `adminPhone` | String | 否 | 管理员电话 |
  | `apiBaseUrl` | String | 否 | API地址 |
  | `serviceStartTime` | String | 否 | 服务开始时间 (HH:MM) |
  | `serviceEndTime` | String | 否 | 服务结束时间 (HH:MM) |
  | `alertDelay` | Integer | 否 | 告警延迟时间 (秒) |
  | `smsNotification` | Boolean | 否 | 是否开启短信通知 |
  | `emailNotification` | Boolean | 否 | 是否开启邮件通知 |
  | `maxUsers` | Integer | 否 | 最大用户数 |
  | `maxCamerasPerUser` | Integer | 否 | 每用户最大摄像头数 |
  | `smsApiKey` | String | 否 | 短信API密钥 |
  | `emailServer` | String | 否 | 邮件服务器 |
  | `emailPort` | Integer | 否 | 邮件端口 |
  | `emailSender` | String | 否 | 发件人邮箱 |
  | `wechatAppId` | String | 否 | 微信公众号AppID |
  | `wechatAppSecret` | String | 否 | 微信公众号AppSecret |
  | `wechatTemplateId` | String | 否 | 微信模板消息ID |
- **请求体**:
  ```json
  {
    "siteTitle": "康养云端",
    "siteDomain": "https://kangyang.example.com",
    "icp": "京ICP备2024322061号-2",
    "siteDescription": "智慧老人安全监护平台",
    "systemName": "康养云端",
    "adminEmail": "admin@kangyang.example.com",
    "adminPhone": "400-697-5963",
    "apiBaseUrl": "https://api.kangyang.example.com",
    "serviceStartTime": "08:00",
    "serviceEndTime": "20:00",
    "alertDelay": 30,
    "smsNotification": true,
    "emailNotification": true,
    "maxUsers": 5000,
    "maxCamerasPerUser": 10,
    "smsApiKey": "",
    "emailServer": "smtp.example.com",
    "emailPort": 587,
    "emailSender": "noreply@kangyang.example.com",
    "wechatAppId": "",
    "wechatAppSecret": "",
    "wechatTemplateId": ""
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "siteTitle": "康养云端",
      "siteDomain": "https://kangyang.example.com",
      "icp": "京ICP备2024322061号-2",
      "siteDescription": "智慧老人安全监护平台",
      "systemName": "康养云端",
      "adminEmail": "admin@kangyang.example.com",
      "adminPhone": "400-697-5963",
      "apiBaseUrl": "https://api.kangyang.example.com",
      "serviceStartTime": "08:00",
      "serviceEndTime": "20:00",
      "alertDelay": 30,
      "smsNotification": true,
      "emailNotification": true,
      "maxUsers": 5000,
      "maxCamerasPerUser": 10
    }
  }
  ```

### 3.4 用户端面板接口

#### 3.4.1 获取用户端面板概览数据

- **URL**: `/user/dashboard`
- **方法**: `GET`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，返回对应用户的面板数据
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "userName": "张三",
      "userPhone": "138****8888",
      "totalCameras": 3,
      "availableCameras": 2,
      "onlineHours": 127,
      "currentPlan": "基础版",
      "planExpireDate": "2026-03-09",
      "daysRemaining": 30
    }
  }
  ```

#### 3.4.2 获取用户端面板图表数据

- **URL**: `/user/dashboard/charts`
- **方法**: `GET`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，返回对应用户的图表数据
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "statusChart": {
        "labels": ["正常", "离线", "告警"],
        "data": [2, 1, 0]
      },
      "activityChart": {
        "labels": ["1日", "2日", "3日", "4日", "5日", "6日", "7日"],
        "data": [0, 1, 0, 2, 0, 0, 1]
      }
    }
  }
  ```

### 3.5 用户通知接口

#### 3.5.1 获取用户通知列表

- **URL**: `/user/notifications`
- **方法**: `GET`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，返回所有通知列表（包括用户注册前的通知），按发送时间降序排序（最新的在前面）。如果用户与通知没有关联，会自动创建新的关联。
- **参数**:
  - `page`: 页码 (默认: 1)
  - `size`: 每页数量 (默认: 3)
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 7,
      "pages": 3,
      "current": 1,
      "records": [
        {
          "id": 1,
          "title": "系统升级通知",
          "content": "系统将于2026年2月10日进行升级维护，预计维护时间为2小时，请提前做好准备。",
          "time": "2026-02-09 10:00",
          "read": false
        }
      ]
    }
  }
  ```

#### 3.5.2 获取通知详情

- **URL**: `/user/notifications/{id}`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "title": "系统升级通知",
      "content": "系统将于2026年2月10日进行升级维护，预计维护时间为2小时，请提前做好准备。",
      "time": "2026-02-09 10:00"
    }
  }
  ```

#### 3.5.3 标记通知为已读

- **URL**: `/user/notifications/{id}/read`
- **方法**: `PATCH`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，为对应用户标记通知为已读
- **响应**:
  ```json
  {
    "code": 200,
    "message": "标记成功",
    "data": {
      "id": 1,
      "read": true
    }
  }
  ```

### 3.6 用户管理接口

#### 3.6.1 获取用户列表

- **URL**: `/admin/users`
- **方法**: `GET`
- **请求参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | 否 | 1 | 页码 |
  | `size` | Integer | 否 | 10 | 每页数量 |
  | `search` | String | 否 | - | 搜索关键词（用户名、手机号） |
  | `status` | String | 否 | - | 状态过滤（normal/disabled） |
  | `plan` | String | 否 | - | 套餐过滤（使用套餐中文名称，如：无套餐、基础版、标准版等） |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 100,
      "pages": 10,
      "current": 1,
      "records": [
        {
          "id": 1,
          "username": "张三",
          "phone": "13800138001",
          "email": "zhangsan@example.com",
          "plan": "basic",
          "status": "normal",
          "registerTime": "2024-01-01 10:00:00",
          "expireDate": "2026-03-09 00:00:00",
          "daysRemaining": 30,
          "lastLogin": "2026-02-08 15:30:00",
          "monitorCount": 2,
          "maxMonitors": 3
        }
      ]
    }
  }
  ```

#### 3.6.2 添加用户

- **URL**: `/admin/users`
- **方法**: `POST`
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `username` | String | 是 | - | 用户名 |
  | `phone` | String | 是 | - | 手机号 |
  | `email` | String | 否 | - | 邮箱 |
  | `password` | String | 是 | - | 密码 |
  | `plan` | String | 是 | - | 套餐类型（使用套餐中文名称，如：无套餐、基础版、标准版等） |
  | `expireDate` | String | 是 | - | 到期日期（格式：YYYY-MM-DD） |
- **请求体**:
  ```json
  {
    "username": "用户名",
    "phone": "手机号",
    "email": "邮箱",
    "password": "密码",
    "plan": "basic",
    "expireDate": "2026-03-09"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "添加成功",
    "data": {
      "id": 9,
      "username": "新用户",
      "phone": "13800138009",
      "email": "newuser@example.com",
      "plan": "basic",
      "status": "normal",
      "registerTime": "2026-02-10 00:00:00",
      "expireDate": "2026-03-09 00:00:00",
      "daysRemaining": 28,
      "maxMonitors": 3
    }
  }
  ```

#### 3.6.3 获取用户详情

- **URL**: `/admin/users/{id}`
- **方法**: `GET`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 用户ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "username": "张三",
      "phone": "13800138001",
      "email": "zhangsan@example.com",
      "password": "user123",  // 直接返回明文密码
      "plan": "basic",
      "status": "normal",
      "registerTime": "2024-01-01 10:00:00",
      "expireDate": "2026-03-09 00:00:00",
      "lastLogin": "2026-02-08 15:30:00",
      "monitorCount": 2,
      "maxMonitors": 3
    }
  }
  ```

#### 3.6.4 更新用户

- **URL**: `/admin/users/{id}`
- **方法**: `PUT`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 用户ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `username` | String | 否 | - | 用户名 |
  | `phone` | String | 否 | - | 手机号 |
  | `email` | String | 否 | - | 邮箱 |
  | `password` | String | 否 | - | 密码 |
  | `plan` | String | 否 | - | 套餐类型（使用套餐中文名称，如：无套餐、基础版、标准版等） |
  | `expireDate` | String | 否 | - | 到期日期（格式：YYYY-MM-DD） |
  | `status` | String | 否 | - | 状态（normal/disabled） |
- **请求体**:
  ```json
  {
    "username": "用户名",
    "phone": "手机号",
    "email": "邮箱",
    "password": "密码",
    "plan": "standard",
    "expireDate": "2026-05-09",
    "status": "normal"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "id": 1,
      "username": "张三",
      "phone": "13800138001",
      "email": "zhangsan@example.com",
      "plan": "standard",
      "status": "normal",
      "expireDate": "2026-05-09 00:00:00",
      "daysRemaining": 90,
      "maxMonitors": 8
    }
  }
  ```

#### 3.6.5 切换用户状态

- **URL**: `/admin/users/{id}/status`
- **方法**: `PATCH`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 用户ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `status` | String | 是 | 状态（normal/disabled） |
- **请求体**:
  ```json
  {
    "status": "disabled"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "id": 1,
      "status": "disabled"
    }
  }
  ```

#### 3.6.6 删除用户

- **URL**: `/admin/users/{id}`
- **方法**: `DELETE`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 用户ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "删除成功"
  }
  ```

### 3.7 套餐管理接口

#### 3.7.1 获取套餐列表

- **URL**: `/admin/plans`
- **方法**: `GET`
- **请求参数**: 无
- **响应**:
  ```json
  {
  	"code": 200,
  	"message": "操作成功",
  	"data": [
  		{
  			"period": "永久",
  			"originalPrice": 0,
  			"price": 0,
  			"name": "无套餐",
  			"discount": null,
  			"id": 1,
  			"maxCameras": 0,
  			"hasExclusiveService": 0,
  			"aiLevel": 1,
  			"status": "active"
  		},
  		{
  			"period": "月",
  			"originalPrice": 9,
  			"price": 9,
  			"name": "基础版",
  			"discount": 1.8,
  			"id": 2,
  			"maxCameras": 3,
  			"hasExclusiveService": 1,
  			"aiLevel": 2,
  			"status": "active"
  		},
  		{
  			"period": "月",
  			"originalPrice": 19,
  			"price": 19,
  			"name": "标准版",
  			"discount": 3.8,
  			"id": 3,
  			"maxCameras": 6,
  			"hasExclusiveService": 1,
  			"aiLevel": 3,
  			"status": "active"
  		},
  		{
  			"period": "月",
  			"originalPrice": 29,
  			"price": 29,
  			"name": "高级版",
  			"discount": 5.8,
  			"id": 4,
  			"maxCameras": 10,
  			"hasExclusiveService": 1,
  			"aiLevel": 4,
  			"status": "active"
  		}
	]
}
  ```

#### 3.7.2 添加套餐

- **URL**: `/admin/plans`
- **方法**: `POST`
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `name` | String | 是 | - | 套餐名称 |
  | `price` | Number | 是 | - | 价格 |
  | `originalPrice` | Number | 否 | - | 原价 |
  | `discount` | Number | 否 | - | 折扣（0-10） |
  | `discountPeriod` | String | 否 | - | 折扣到期日期（格式：YYYY-MM-DD） |
  | `period` | String | 是 | - | 周期（月/年/永久） |
  | `maxCameras` | Integer | 是 | - | 最大监控数量 |
  | `hasExclusiveService` | Integer | 否 | 0 | 是否有专属客服（0: 无, 1: 有） |
  | `aiLevel` | Integer | 否 | 1 | AI识别类型级别（1-4） |
  | `status` | String | 是 | - | 状态（active/inactive） |
- **请求体**:
  ```json
  {
    "name": "高级版",
    "price": 299.00,
    "originalPrice": 399.00,
    "discount": 7.5,
    "discountPeriod": "2026-03-31",
    "period": "月",
    "maxCameras": 15,
    "hasExclusiveService": 1,
    "aiLevel": 4,
    "status": "active"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "添加成功",
    "data": {
      "id": 4,
      "name": "高级版",
      "price": 299.00,
      "originalPrice": 399.00,
      "discount": 7.5,
      "discountPeriod": "2026-03-31",
      "period": "月",
      "maxCameras": 15,
      "hasExclusiveService": 1,
      "aiLevel": 4,
      "status": "active"
    }
  }
  ```

#### 3.7.3 获取套餐详情

- **URL**: `/admin/plans/{id}`
- **方法**: `GET`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 套餐ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "name": "基础版",
      "price": 99.00,
      "originalPrice": 99.00,
      "discount": 0,
      "period": "月",
      "status": "active",
      "maxCameras": 3,
      "hasExclusiveService": 1,
      "aiLevel": 2,
      "userCount": 100
    }
  }
  ```

#### 3.7.4 更新套餐

- **URL**: `/admin/plans/{id}`
- **方法**: `PUT`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 套餐ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `name` | String | 否 | - | 套餐名称 |
  | `price` | Number | 否 | - | 价格 |
  | `originalPrice` | Number | 否 | - | 原价 |
  | `discount` | Number | 否 | - | 折扣（0-10） |
  | `discountPeriod` | String | 否 | - | 折扣到期日期（格式：YYYY-MM-DD） |
  | `period` | String | 否 | - | 周期（月/年/永久） |
  | `maxCameras` | Integer | 否 | - | 最大监控数量 |
  | `hasExclusiveService` | Integer | 否 | - | 是否有专属客服（0: 无, 1: 有） |
  | `aiLevel` | Integer | 否 | - | AI识别类型级别（1-4） |
  | `status` | String | 否 | - | 状态（active/inactive） |
- **请求体**:
  ```json
  {
    "name": "基础版",
    "price": 89.00,
    "originalPrice": 99.00,
    "discount": 9,
    "discountPeriod": "2026-03-31",
    "period": "月",
    "maxCameras": 3,
    "hasExclusiveService": 1,
    "aiLevel": 2,
    "status": "active"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "id": 1,
      "name": "基础版",
      "price": 89.00,
      "originalPrice": 99.00,
      "discount": 9,
      "discountPeriod": "2026-03-31",
      "period": "月",
      "maxCameras": 3,
      "hasExclusiveService": 1,
      "aiLevel": 2,
      "status": "active"
    }
  }
  ```

#### 3.7.5 删除套餐

- **URL**: `/admin/plans/{id}`
- **方法**: `DELETE`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 套餐ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "删除成功"
  }
  ```

### 3.8 卡密管理接口

#### 3.8.1 获取卡密列表

- **URL**: `/admin/cards`
- **方法**: `GET`
- **请求参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | 否 | 1 | 页码 |
  | `size` | Integer | 否 | 10 | 每页数量 |
  | `search` | String | 否 | - | 搜索关键词（卡密代码） |
  | `status` | String | 否 | - | 状态过滤（unused/used） |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 100,
      "pages": 10,
      "current": 1,
      "records": [
        {
          "id": 1,
          "code": "ABC123",
          "type": "月卡",
          "plan": "基础版",
          "validity": 30,
          "status": "unused",
          "generateTime": "2026-02-01 10:00:00",
          "useTime": null,
          "userPhone": null
        }
      ]
    }
  }
  ```

#### 3.8.2 生成卡密

- **URL**: `/admin/cards/generate`
- **方法**: `POST`
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `type` | String | 是 | 卡密类型（天卡/周卡/月卡/年卡/永久卡/体验卡） |
  | `plan` | String | 是 | 套餐类型（使用套餐中文名称，如：无套餐、基础版、标准版等） |
  | `count` | Integer | 是 | 生成数量 |
  | `validity` | Integer | 是 | 有效期（天） |
- **请求体**:
  ```json
  {
    "type": "月卡",
    "plan": "基础版",
    "count": 10,
    "validity": 30
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "生成成功",
    "data": {
      "count": 10,
      "cards": [
        {
            "id": 11,
            "code": "XYZ789",
            "type": "月卡",
            "plan": "基础版",
            "validity": 30,
            "status": "unused",
            "generateTime": "2026-02-10 00:00:00"
          }
      ]
    }
  }
  ```

#### 3.8.3 删除卡密

- **URL**: `/admin/cards/{id}`
- **方法**: `DELETE`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 卡密ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "删除成功"
  }
  ```

### 3.9 监控管理接口

#### 3.9.1 获取监控列表

- **URL**: `/admin/monitorings`
- **方法**: `GET`
- **请求参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | 否 | 1 | 页码 |
  | `size` | Integer | 否 | 10 | 每页数量 |
  | `search` | String | 否 | - | 搜索关键词（监控名称、URL） |
  | `status` | String | 否 | - | 状态过滤（在线/离线） |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 100,
      "pages": 10,
      "current": 1,
      "records": [
        {
          "id": 1,
          "userId": "13800138001",
          "username": "张三",
          "name": "客厅监控",
          "url": "rtsp://example.com/stream1",
          "status": "在线",
          "healthStatus": "正常",
          "monitoringRange": "室内",
          "addTime": "2024-01-01 10:00:00",
          "lastOnline": "2026-02-10 08:00:00",
          "emergencyContacts": {
            "contact1": {
              "name": "张三",
              "phone": "13800138001"
            },
            "contact2": {
              "name": "李四",
              "phone": "13900139001"
            }
          }
        }
      ]
    }
  }
  ```

#### 3.9.2 获取监控详情

- **URL**: `/admin/monitorings/{id}`
- **方法**: `GET`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
    "id": 1,
    "userId": "13800138001",
    "username": "张三",
    "name": "客厅监控",
    "url": "rtsp://example.com/stream1",
    "status": "在线",
    "healthStatus": "正常",
    "monitoringRange": "室内",
    "addTime": "2024-01-01 10:00:00",
    "lastOnline": "2026-02-10 08:00:00",
    "emergencyContacts": {
      "contact1": {
        "name": "张三",
        "phone": "13800138001"
      },
      "contact2": {
        "name": "李四",
        "phone": "13900139001"
      }
    }
  }
  }
  ```

#### 3.9.3 更新监控

- **URL**: `/admin/monitorings/{id}`
- **方法**: `PUT`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `name` | String | 否 | 监控名称 |
  | `url` | String | 否 | 监控地址 |
  | `range` | String | 否 | 监控范围（室内/室外） |
  | `healthStatus` | String | 否 | 健康状态（正常/封禁） |
- **请求体**:
  ```json
  {
    "name": "客厅监控",
    "url": "rtsp://example.com/stream1",
    "range": "室内",
    "healthStatus": "正常"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "id": 1,
      "userId": 1,
      "username": "张三",
      "name": "客厅监控",
      "url": "rtsp://example.com/stream1",
      "status": "离线",
      "healthStatus": "正常",
      "range": "室内",
      "addTime": "2026-02-12 16:30:00",
      "lastOnline": null,
      "lastUpdated": "2026-02-12 16:40:00",
      "emergencyContacts": {}
    }
  }
  ```

#### 3.9.4 切换监控状态

- **URL**: `/admin/monitorings/{id}/status`
- **方法**: `PATCH`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `healthStatus` | String | 是 | 健康状态（正常/封禁） |
- **请求体**:
  ```json
  {
    "healthStatus": "封禁"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "id": 1,
      "healthStatus": "封禁"
    }
  }
  ```

#### 3.9.5 删除监控

- **URL**: `/admin/monitorings/{id}`
- **方法**: `DELETE`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "删除成功"
  }
  ```

#### 3.9.6 添加监控

- **URL**: `/admin/monitorings`
- **方法**: `POST`
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `userId` | Long | 是 | 用户ID |
  | `name` | String | 是 | 监控名称 |
  | `url` | String | 是 | 监控地址 |
  | `range` | String | 否 | 监控范围（室内/室外，默认室内） |
- **请求体**:
  ```json
  {
    "userId": 1,
    "name": "办公室监控",
    "url": "rtsp://example.com/stream1",
    "range": "室内"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "添加成功",
    "data": {
      "id": 10001,
      "userId": 1,
      "username": "张三",
      "name": "办公室监控",
      "url": "rtsp://example.com/stream1",
      "status": "离线",
      "range": "室内",
      "addTime": "2026-02-12 16:30:00",
      "emergencyContacts": {}
    }
  }
  ```

#### 3.9.7 切换监控电源状态

- **URL**: `/admin/monitorings/{id}/power`
- **方法**: `PUT`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `status` | String | 是 | 目标状态（online/offline） |
- **请求体**:
  ```json
  {
    "status": "online"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "id": 1,
      "status": "online"
    }
  }
  ```

#### 3.9.8 设置监控紧急联系人

- **URL**: `/admin/monitorings/{id}/emergency-contacts`
- **方法**: `POST`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `contact1` | Object | 否 | 紧急联系人1信息 |
  | `contact1.name` | String | 否 | 紧急联系人1姓名 |
  | `contact1.phone` | String | 否 | 紧急联系人1电话 |
  | `contact2` | Object | 否 | 紧急联系人2信息 |
  | `contact2.name` | String | 否 | 紧急联系人2姓名 |
  | `contact2.phone` | String | 否 | 紧急联系人2电话 |
  | `contact3` | Object | 否 | 紧急联系人3信息 |
  | `contact3.name` | String | 否 | 紧急联系人3姓名 |
  | `contact3.phone` | String | 否 | 紧急联系人3电话 |
  | `contact4` | Object | 否 | 紧急联系人4信息 |
  | `contact4.name` | String | 否 | 紧急联系人4姓名 |
  | `contact4.phone` | String | 否 | 紧急联系人4电话 |
  | `contact5` | Object | 否 | 紧急联系人5信息 |
  | `contact5.name` | String | 否 | 紧急联系人5姓名 |
  | `contact5.phone` | String | 否 | 紧急联系人5电话 |
- **请求体**:
  ```json
  {
    "contact1": {
      "name": "张三",
      "phone": "13800138001"
    },
    "contact2": {
      "name": "李四",
      "phone": "13900139001"
    }
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "紧急联系人设置成功",
    "data": {
      "id": 1,
      "emergencyContacts": {
        "contact1": {
          "name": "张三",
          "phone": "13800138001"
        },
        "contact2": {
          "name": "李四",
          "phone": "13900139001"
        }
      }
    }
  }
  ```

### 3.10 通知管理接口

#### 3.10.1 获取通知列表

- **URL**: `/admin/notifications`
- **方法**: `GET`
- **请求参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | 否 | 1 | 页码 |
  | `size` | Integer | 否 | 10 | 每页数量 |
  | `search` | String | 否 | - | 搜索关键词（标题、内容） |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 50,
      "pages": 5,
      "current": 1,
      "records": [
        {
          "id": 1,
          "title": "系统维护通知",
          "type": "system",
          "sendTime": "2026-02-01 10:00:00",
          "status": "已发送",
          "viewCount": 100
        }
      ]
    }
  }
  ```

#### 3.10.2 发送通知

- **URL**: `/admin/notifications`
- **方法**: `POST`
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `title` | String | 是 | 通知标题 |
  | `content` | String | 是 | 通知内容 |
  | `type` | String | 是 | 通知类型 |
  | `userIds` | Array<Long> | 否 | 接收用户ID列表（当sendToAll为false时必填） |
  | `sendToAll` | Boolean | 是 | 是否发送给所有用户 |
- **请求体**:
  ```json
  {
    "title": "系统维护通知",
    "content": "系统将于2026年2月15日凌晨进行维护，预计持续2小时",
    "type": "system",
    "userIds": [1, 2, 3],
    "sendToAll": true
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "发送成功",
    "data": {
      "id": 2,
      "title": "系统维护通知",
      "status": "已发送",
      "sendTime": "2026-02-10 00:00:00"
    }
  }
  ```

### 3.11 用户端接口

#### 3.11.1 获取用户信息

- **URL**: `/user/info`
- **方法**: `GET`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，返回对应用户的信息
- **请求参数**: 无
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "username": "张三",
      "phone": "13800138001",
      "email": "zhangsan@example.com",
      "plan": "basic",
      "status": "normal",
      "expireDate": "2026-03-09 00:00:00",
      "daysRemaining": 30,
      "maxMonitors": 3,
      "currentMonitors": 2
    }
  }
  ```

#### 3.11.2 更新用户信息

- **URL**: `/user/info`
- **方法**: `PUT`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，更新对应用户的信息
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `username` | String | 否 | 用户名 |
  | `email` | String | 否 | 邮箱 |
- **请求体**:
  ```json
  {
    "username": "张三",
    "email": "zhangsan@example.com"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "id": 1,
      "username": "张三",
      "email": "zhangsan@example.com"
    }
  }
  ```

#### 3.11.3 修改密码

- **URL**: `/user/password`
- **方法**: `PUT`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，修改对应用户的密码
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `oldPassword` | String | 是 | 旧密码 |
  | `newPassword` | String | 是 | 新密码 |
- **请求体**:
  ```json
  {
    "oldPassword": "旧密码",
    "newPassword": "新密码"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "修改成功"
  }
  ```

#### 3.11.4 获取用户监控列表

- **URL**: `/user/monitorings`
- **方法**: `GET`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，返回对应用户的监控列表
- **请求参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | 否 | 1 | 页码 |
  | `size` | Integer | 否 | 10 | 每页数量 |
- **响应**:
  ```json
  {
  	"code": 200,
  	"message": "操作成功",
  	"data": {
  		"remainingMonitors": 5,
  		"monitorings": {
  			"total": 3,
  			"pages": 1,
  			"current": 1,
  			"records": [
  				{
  					"addTime": "2026-02-11T01:04:19",
  					"name": "1",
  					"range": "室内",
  					"aiStatus": "正常",
  					"lastOnline": null,
  					"emergencyContacts": {},
  					"id": 10001,
  					"url": "1",
  					"status": "离线"
  				},
  				{
  					"addTime": "2026-02-11T01:04:32",
  					"name": "2",
  					"range": "室内",
  					"aiStatus": "正常",
  					"lastOnline": null,
  					"emergencyContacts": {},
  					"id": 10002,
  					"url": "2",
  					"status": "离线"
  				},
  				{
  					"addTime": "2026-02-11T01:20:43",
  					"name": "777",
  					"range": "室内",
  					"aiStatus": "正常",
  					"lastOnline": null,
  					"emergencyContacts": {},
  					"id": 10003,
  					"url": "777",
  					"status": "离线"
  				}
  			]
  		},
  		"maxMonitors": 8,
  		"currentMonitors": 3
  	}
  }
  ```

#### 3.11.5 添加监控

- **URL**: `/user/monitorings`
- **方法**: `POST`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，为对应用户添加监控
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `name` | String | 是 | 监控名称 |
  | `url` | String | 是 | 监控地址 |
  | `monitoringRange` | String | 是 | 监控范围（室内/室外） |
- **请求体**:
  ```json
  {
    "name": "卧室监控",
    "url": "rtsp://example.com/stream2",
    "monitoringRange": "室内"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "添加成功",
    "data": {
      "id": 3,
      "name": "卧室监控",
      "url": "rtsp://example.com/stream2",
      "status": "离线",
      "monitoringRange": "室内",
      "addTime": "2026-02-10 00:00:00"
    }
  }
  ```

#### 3.11.6 更新用户监控

- **URL**: `/user/monitorings/{id}`
- **方法**: `PUT`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，验证监控是否属于该用户，然后更新监控信息
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `name` | String | 否 | 监控名称 |
  | `url` | String | 否 | 监控地址 |
  | `monitoringRange` | String | 否 | 监控范围（室内/室外） |
- **请求体**:
  ```json
  {
    "name": "卧室监控",
    "url": "rtsp://example.com/stream2",
    "monitoringRange": "室内"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "id": 3,
      "name": "卧室监控",
      "url": "rtsp://example.com/stream2",
      "monitoringRange": "室内"
    }
  }
  ```

#### 3.11.7 删除用户监控

- **URL**: `/user/monitorings/{id}`
- **方法**: `DELETE`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，验证监控是否属于该用户，然后删除监控
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "删除成功"
  }
  ```

#### 3.11.8 验证卡密

- **URL**: `/user/cards/verify`
- **方法**: `POST`
- **说明**: 验证卡密的有效性，返回卡密对应的套餐信息
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `code` | String | 是 | 卡密代码 |
- **请求体**:
  ```json
  {
    "code": "ABC123"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "卡密有效",
    "data": {
      "valid": true,
      "plan": "基础版",
      "validity": 30,
      "type": "月卡",
      "maxMonitors": 3
    }
  }
  ```

#### 3.11.9 使用卡密

- **URL**: `/user/cards/use`
- **方法**: `POST`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，为对应用户使用卡密，更新用户套餐和到期时间
- **判断机制**:
  - 当使用的卡密套餐名称与用户当前套餐名称相同时，实行时长叠加
  - 当使用的卡密套餐名称与用户当前套餐名称不同时，实行时长覆盖（从当前时间开始计算）
- **说明**:
  - 系统会根据卡密的套餐名称和类型（时长）查找对应的套餐，并设置用户的最大监控数
  - 如果找不到对应的套餐，会尝试多种查找方式确保能够获取到正确的套餐信息
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `code` | String | 是 | 卡密代码 |
- **请求体**:
  ```json
  {
    "code": "ABC123"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "使用成功",
    "data": {
      "plan": "基础版",
      "expireDate": "2026-03-10 00:00:00",
      "daysRemaining": 30,
      "maxMonitors": 3
    }
  }
  ```

#### 3.11.10 获取用户告警记录

- **URL**: `/user/alerts`
- **方法**: `GET`
- **说明**: 从Spring Security的认证信息中获取当前登录用户的ID，返回对应用户的告警记录
- **请求参数**:
  | 参数名 | 类型 | 必填 | 默认值 | 描述 |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | 否 | 1 | 页码 |
  | `size` | Integer | 否 | 10 | 每页数量 |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 10,
      "pages": 1,
      "current": 1,
      "records": [
        {
          "id": 1,
          "monitorId": "12345",
          "range": "室内",
          "time": "2026-02-10 10:00:00",
          "camera": "客厅监控",
          "type": "异常行为",
          "status": "pending",
          "issue": "检测到异常行为",
          "details": "在客厅区域检测到异常行为，请及时查看",
          "smsNotified": true,
          "phoneNotified": false
        }
      ]
    }
  }
  ```

#### 3.11.11 获取告警详情

- **URL**: `/user/alerts/{id}`
- **方法**: `GET`
- **说明**: 获取指定告警的详细信息
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 告警ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "monitorId": "12345",
      "range": "室内",
      "time": "2026-02-10 10:00:00",
      "camera": "客厅监控",
      "type": "异常行为",
      "status": "pending",
      "issue": "检测到异常行为",
      "details": "在客厅区域检测到异常行为，请及时查看",
      "smsNotified": true,
      "phoneNotified": false
    }
  }
  ```

#### 3.11.12 处理告警

- **URL**: `/user/alerts/{id}/resolve`
- **方法**: `PUT`
- **说明**: 将指定告警标记为已处理
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 告警ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "处理成功",
    "data": {
      "id": 1,
      "status": "resolved"
    }
  }
  ```

#### 3.11.13 刷新监控状态

- **URL**: `/api/user/monitorings/refresh`
- **方法**: `POST`
- **说明**: 刷新所有监控的状态
- **响应**:
  ```json
  {
    "code": 200,
    "message": "刷新成功",
    "data": {
      "refreshedCount": 3
    }
  }
  ```

#### 3.11.14 切换监控电源状态

- **URL**: `/api/user/monitorings/{id}/power`
- **方法**: `PUT`
- **说明**: 切换指定监控的电源状态
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `status` | String | 是 | 目标状态 (online/offline) |
- **请求体**:
  ```json
  {
    "status": "online"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "id": 1,
      "status": "online"
    }
  }
  ```

#### 3.11.15 重新连接监控

- **URL**: `/api/user/monitorings/{id}/reconnect`
- **方法**: `POST`
- **说明**: 尝试重新连接离线的监控
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "重新连接成功",
    "data": {
      "id": 1,
      "status": "online"
    }
  }
  ```

#### 3.11.16 设置监控紧急联系人

- **URL**: `/api/user/monitorings/{id}/emergency-contacts`
- **方法**: `POST`
- **说明**: 设置指定监控的紧急联系人信息，最多支持5个紧急联系人
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **请求体参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `contact1` | Object | 否 | 紧急联系人1信息 |
  | `contact1.name` | String | 否 | 紧急联系人1姓名 |
  | `contact1.phone` | String | 否 | 紧急联系人1电话 |
  | `contact2` | Object | 否 | 紧急联系人2信息 |
  | `contact2.name` | String | 否 | 紧急联系人2姓名 |
  | `contact2.phone` | String | 否 | 紧急联系人2电话 |
  | `contact3` | Object | 否 | 紧急联系人3信息 |
  | `contact3.name` | String | 否 | 紧急联系人3姓名 |
  | `contact3.phone` | String | 否 | 紧急联系人3电话 |
  | `contact4` | Object | 否 | 紧急联系人4信息 |
  | `contact4.name` | String | 否 | 紧急联系人4姓名 |
  | `contact4.phone` | String | 否 | 紧急联系人4电话 |
  | `contact5` | Object | 否 | 紧急联系人5信息 |
  | `contact5.name` | String | 否 | 紧急联系人5姓名 |
  | `contact5.phone` | String | 否 | 紧急联系人5电话 |
- **请求体**:
  ```json
  {
    "contact1": {
      "name": "张三",
      "phone": "13800138001"
    },
    "contact2": {
      "name": "李四",
      "phone": "13900139001"
    }
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "紧急联系人设置成功",
    "data": {
      "id": 1,
      "emergencyContacts": {
        "contact1": {
          "name": "张三",
          "phone": "13800138001"
        },
        "contact2": {
          "name": "李四",
          "phone": "13900139001"
        }
      }
    }
  }
  ```

#### 3.11.17 获取监控详情

- **URL**: `/user/monitorings/{id}`
- **方法**: `GET`
- **路径参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  | :--- | :--- | :--- | :--- |
  | `id` | Long | 是 | 监控ID |
- **响应**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "name": "客厅监控",
      "url": "rtsp://example.com/stream1",
      "status": "在线",
      "range": "室内",
      "addTime": "2024-01-01 10:00:00",
      "lastOnline": "2026-02-10 08:00:00",
      "lastUpdated": "2026-02-10 08:00:00",
      "healthStatus": "正常",
      "aiStatus": "正常",
      "emergencyContacts": {
        "contact1": {
          "name": "张三",
          "phone": "13800138001"
        },
        "contact2": {
          "name": "李四",
          "phone": "13900139001"
        }
      }
    }
  }
  ```

## 4. 系统架构

### 4.1 模块划分

- **user**: 用户管理模块
- **admin**: 管理员模块
- **plan**: 套餐管理模块
- **card**: 卡密管理模块
- **monitoring**: 监控管理模块
- **notification**: 通知管理模块
- **common**: 公共模块

### 4.2 核心类设计

| 类名 | 职责 | 所属模块 |
| :--- | :--- | :--- |
| `UserController` | 处理用户相关请求 | user |
| `AdminUserController` | 处理管理员相关请求 | admin |
| `PlanController` | 处理套餐相关请求 | plan |
| `CardController` | 处理卡密相关请求 | card |
| `MonitoringController` | 处理监控相关请求 | monitoring |
| `NotificationController` | 处理通知相关请求 | notification |
| `UserService` | 用户业务逻辑 | user |
| `PlanService` | 套餐业务逻辑 | plan |
| `CardService` | 卡密业务逻辑 | card |
| `MonitoringService` | 监控业务逻辑 | monitoring |
| `NotificationService` | 通知业务逻辑 | notification |
| `SecurityConfig` | 安全配置 | common |

### 4.3 目录结构

```
src/main/java/com/kangyang/
├── config/            # 配置类
│   ├── SecurityConfig.java
│   └── JwtAuthenticationFilter.java
├── controller/        # 控制器
│   ├── user/          # 用户相关
│   │   ├── AuthController.java
│   │   ├── CardController.java
│   │   ├── MonitoringController.java
│   │   ├── NotificationController.java
│   │   └── UserController.java
│   ├── admin/         # 管理员相关
│   │   ├── AdminAuthController.java
│   │   ├── AdminSettingsController.java
│   │   ├── CardController.java
│   │   ├── DashboardController.java
│   │   ├── MonitoringController.java
│   │   ├── NotificationController.java
│   │   ├── PlanController.java
│   │   └── UserController.java
├── dto/               # 数据传输对象
│   ├── common/        # 公共DTO
│   │   ├── PageResponseDTO.java
│   │   └── ResponseDTO.java
│   ├── user/          # 用户相关DTO
│   │   ├── ForgotPasswordRequest.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── ThirdPartyLoginRequest.java
├── entity/            # 实体类
│   ├── AdminUser.java
│   ├── Alert.java
│   ├── Card.java
│   ├── Monitoring.java
│   ├── Notification.java
│   ├── Plan.java
│   ├── PlanFeature.java
│   ├── SystemSetting.java
│   ├── User.java
│   └── UserNotification.java
├── exception/         # 异常处理
│   ├── BusinessException.java
│   └── GlobalExceptionHandler.java
├── repository/        # 数据访问
│   ├── AdminUserRepository.java
│   ├── AlertRepository.java
│   ├── CardRepository.java
│   ├── MonitoringRepository.java
│   ├── NotificationRepository.java
│   ├── PlanFeatureRepository.java
│   ├── PlanRepository.java
│   ├── SystemSettingRepository.java
│   ├── UserNotificationRepository.java
│   └── UserRepository.java
├── scheduler/         # 定时任务
│   └── ExpireDateScheduler.java
├── utils/             # 工具类
│   ├── CardGenerator.java
│   ├── JwtUtils.java
│   └── PasswordEncoder.java
└── KangyangApplication.java    # 应用启动类
```

## 5. 部署说明

### 5.1 环境要求

- JDK 17
- MySQL 5.7
- Maven 3.6+
- Tomcat 9+ (可选，也可以使用内置的Tomcat)

### 5.2 数据库配置

1. 创建数据库：`CREATE DATABASE IF NOT EXISTS kytest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
2. 使用数据库：`USE kangyang;`
3. 执行数据库初始化脚本（包含表结构和初始数据）：

```sql
-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    plan VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'normal',
    register_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    expire_date DATETIME,
    max_monitors INT DEFAULT 0,
    current_monitors INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 管理员表
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 套餐表
CREATE TABLE IF NOT EXISTS plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount DECIMAL(5,2),
    discount_period DATETIME,
    period VARCHAR(20) NOT NULL,
    max_cameras INT NOT NULL,
    has_exclusive_service INT NOT NULL DEFAULT 0,
    ai_level INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_plan_name_period (name, period)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 卡密表
CREATE TABLE IF NOT EXISTS cards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    validity INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unused',
    generate_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    use_time DATETIME,
    user_id BIGINT,
    user_phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 监控表
CREATE TABLE IF NOT EXISTS monitorings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT=10001,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT '离线',
    health_status VARCHAR(20) NOT NULL DEFAULT '正常',
    monitoring_range VARCHAR(20) NOT NULL DEFAULT '室内',
    add_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_online DATETIME,
    last_updated DATETIME,
    emergency_contact1_name VARCHAR(50),
    emergency_contact1_phone VARCHAR(20),
    emergency_contact2_name VARCHAR(50),
    emergency_contact2_phone VARCHAR(20),
    emergency_contact3_name VARCHAR(50),
    emergency_contact3_phone VARCHAR(20),
    emergency_contact4_name VARCHAR(50),
    emergency_contact4_phone VARCHAR(20),
    emergency_contact5_name VARCHAR(50),
    emergency_contact5_phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    send_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT '已发送',
    view_count INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户通知关联表
CREATE TABLE IF NOT EXISTS user_notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    notification_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 告警表
CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    monitor_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    `range` VARCHAR(20) NOT NULL,
    `time` DATETIME NOT NULL,
    camera VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    issue VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    sms_notified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_notified BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (monitor_id) REFERENCES monitorings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    site_title VARCHAR(100) NOT NULL DEFAULT '康养云端',
    site_domain VARCHAR(255) NOT NULL DEFAULT 'https://kangyang.example.com',
    icp VARCHAR(100) NOT NULL DEFAULT '京ICP备2024322061号-2',
    site_description VARCHAR(255) NOT NULL DEFAULT '智慧老人安全监护平台',
    system_name VARCHAR(100) NOT NULL DEFAULT '康养云端',
    system_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    admin_email VARCHAR(100) NOT NULL DEFAULT 'admin@kangyang.example.com',
    admin_phone VARCHAR(20) NOT NULL DEFAULT '400-697-5963',
    api_base_url VARCHAR(255) NOT NULL DEFAULT 'https://kyapi.awenz.cn/',
    service_start_time VARCHAR(5) NOT NULL DEFAULT '08:00',
    service_end_time VARCHAR(5) NOT NULL DEFAULT '20:00',
    alert_delay INT NOT NULL DEFAULT 30,
    sms_notification BOOLEAN NOT NULL DEFAULT TRUE,
    email_notification BOOLEAN NOT NULL DEFAULT TRUE,
    max_users INT NOT NULL DEFAULT 5000,
    max_cameras_per_user INT NOT NULL DEFAULT 10,
    sms_api_key VARCHAR(255) NOT NULL DEFAULT '',
    email_server VARCHAR(255) NOT NULL DEFAULT 'smtp.example.com',
    email_port INT NOT NULL DEFAULT 587,
    email_sender VARCHAR(100) NOT NULL DEFAULT 'noreply@kangyang.example.com',
    wechat_app_id VARCHAR(100) NOT NULL DEFAULT '',
    wechat_app_secret VARCHAR(255) NOT NULL DEFAULT '',
    wechat_template_id VARCHAR(100) NOT NULL DEFAULT '',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 初始化管理员账户（密码：admin123）
INSERT INTO admin_users (username, password) VALUES ('admin', 'admin123') ON DUPLICATE KEY UPDATE username = username;

-- 初始化基础套餐
INSERT INTO plans (name, price, original_price, period, max_cameras, has_exclusive_service, ai_level) VALUES 
('基础版', 99.00, 99.00, '月', 3, 0, 1),
('标准版', 199.00, 199.00, '月', 8, 1, 2),
('高级版', 299.00, 299.00, '月', 15, 1, 3),
('企业版', 499.00, 499.00, '月', 30, 1, 4) ON DUPLICATE KEY UPDATE name = name;

-- 初始化系统设置
INSERT INTO system_settings (id) VALUES (1) ON DUPLICATE KEY UPDATE id = id;
```

4. 执行完上述SQL语句后，数据库初始化完成，即可启动应用。

### 5.3 应用配置

修改 `application.properties` 文件：

```properties
# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/kytest?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.username=kytest
spring.datasource.password=FJ7mEBA7Wc68TjHx

# 服务器配置
server.port=8080
server.servlet.context-path=/api

# 日志配置
logging.level.com.kangyang=info
```

### 5.4 构建和部署

1. **构建**：`mvn clean package -DskipTests`
2. **部署**：
   - 方式一：直接运行 `java -jar target/kangyang-0.0.1-SNAPSHOT.jar`
   - 方式二：将 `target/kangyang-0.0.1-SNAPSHOT.jar` 部署到Tomcat

### 5.5 接口文档访问

部署完成后，可以通过以下地址访问Swagger接口文档：

```
http://localhost:8080/api/swagger-ui.html
```

## 6. 安全考虑

1. **密码加密**：使用BCrypt对密码进行加密存储
2. **权限控制**：基于角色的权限控制
3. **输入验证**：对所有输入进行严格验证
4. **SQL注入防护**：使用MyBatis-Plus的参数化查询
5. **跨域处理**：配置CORS策略
6. **敏感信息保护**：敏感信息不返回给前端
7. **日志记录**：记录关键操作日志

## 7. 开发建议

1. **代码规范**：遵循Java代码规范
2. **异常处理**：统一异常处理机制
3. **日志管理**：合理使用日志级别
4. **单元测试**：编写关键功能的单元测试
5. **性能优化**：合理使用缓存，优化数据库查询
6. **代码注释**：添加必要的代码注释
7. **文档更新**：及时更新接口文档
8. **安全更新**：及时更新依赖包，修复安全漏洞

## 8. 总结

本后端接口文档基于前端项目的需求分析，设计了一套完整的API接口，包括用户管理、套餐管理、卡密管理、监控管理、通知管理等功能。后端采用Spring Boot 3.x + MySQL 5.7的技术栈，提供了高效的API服务。

**重要说明**：
1. 所有用户相关接口现在从Spring Security的认证信息中获取当前登录用户的ID，而不是使用硬编码的用户ID 1L。
2. 管理端接口需要管理员认证：
   - 管理员需要先通过 `/admin/auth/login` 接口登录获取token
   - 访问其他管理端接口时，需要在请求头中携带 `Authorization: Bearer {token}`
3. 用户端接口保持开放访问，无需携带token。

文档详细描述了数据库设计、API接口设计、系统架构和部署说明，为后端开发提供了完整的参考。同时，文档顶部添加了接口总览表格，方便快速查看所有可用接口。

## 9. 更新日志

### 版本 1.0.2 (2026-02-12)

- **套餐系统重构**：删除了plan_features数据表，将描述信息整合到plans表中
- **套餐表结构修改**：删除了storage_days字段，添加了has_exclusive_service字段（0/1表示是否有专属客服）和ai_level字段（1-4表示AI识别级别）
- **数据库脚本更新**：修改了database.sql文件，更新表结构和初始化数据，添加了企业版套餐
- **接口文档同步**：更新了套餐相关接口文档，确保与实际实现一致

### 版本 1.0.1 (2026-02-12)

- **密码返回逻辑修改**：获取用户详情接口现在直接返回明文密码，不再显示为星号
- **监控接口优化**：获取监控列表和监控详情接口现在返回紧急联系人的完整数据信息
- **新增用户端接口**：添加了用户端获取监控详情接口 (`GET /user/monitorings/{id}`)
- **管理端接口优化**：管理端获取监控列表和详情接口也添加了紧急联系人信息
- **新增管理端接口**：添加了管理端切换监控电源状态接口 (`PUT /admin/monitorings/{id}/power`)
- **新增管理端接口**：添加了管理端设置监控紧急联系人接口 (`POST /admin/monitorings/{id}/emergency-contacts`)
- **新增管理端接口**：添加了管理端添加监控接口 (`POST /admin/monitorings`)
- **管理端接口优化**：更新了管理端更新监控接口，支持更新健康状态并返回完整的监控信息
- **用户端接口优化**：更新了用户端切换监控电源状态接口，确保状态为online时更新lastOnline字段

### 版本 1.0.0 (2026-02-12)

- **接口URL统一**：移除了所有接口URL中的`/api`前缀，使其与实际代码一致
- **添加前端调用示例**：为用户信息、告警记录、监控列表、通知列表和卡密使用等接口添加了前端调用示例
- **实现原理说明**：添加了从Spring Security的认证信息中获取当前登录用户ID的实现原理
- **JWT token优化**：修复了用户登录token生成逻辑，区分用户token和管理员token，并赋予不同的角色权限
- **接口分类整理**：对接口进行了清晰的分类，方便查找和使用
- **完善接口描述**：为每个接口添加了详细的功能描述和使用说明
- **通知获取优化**：修改了通知获取逻辑，让用户获取到所有通知（包括注册前的通知），并按发送时间降序排序（最新的在前面）

## 10. 前端项目说明

### 10.1 前端目录结构

```
frontend/
├── public/             # 静态资源
├── src/                # 源代码
│   ├── assets/         # 静态资源
│   │   ├── css/        # 样式文件
│   │   ├── fonts/      # 字体文件
│   │   └── images/     # 图片资源
│   ├── components/     # 组件
│   ├── router/         # 路由配置
│   ├── services/       # 服务
│   │   └── api.js      # API服务
│   ├── views/          # 页面
│   │   ├── admin/      # 管理员页面
│   │   ├── agent/      # 代理商页面
│   │   ├── Home.vue    # 首页
│   │   └── Login.vue   # 登录页
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .gitignore          # Git忽略文件
├── index.html          # HTML模板
├── package.json        # 项目配置
├── vite.config.js      # Vite配置
└── README.md           # 项目说明
```

### 10.2 主要文件说明

| 文件路径                                     | 说明                             |
| :------------------------------------------- | :------------------------------- |
| `src/views/admin/PlansManagement.vue`        | 套餐管理页面，用于管理系统套餐   |
| `src/views/agent/ServicePlan.vue`            | 服务套餐页面，用于展示和选择套餐 |
| `src/views/admin/NotificationManagement.vue` | 通知管理页面，用于发送系统通知   |
| `src/views/Home.vue`                         | 首页，展示系统介绍和套餐信息     |
| `src/views/Login.vue`                        | 登录页面，用户登录入口           |
| `src/services/api.js`                        | API服务，封装与后端的通信        |
| `src/router/index.js`                        | 路由配置，定义系统路由           |
| `src/main.js`                                | 应用入口，初始化Vue应用          |

### 10.3 前端开发环境

#### 技术栈

- **框架**：Vue.js 3
- **组合式API**：Composition API
- **路由**：Vue Router 4
- **构建工具**：Vite
- **样式**：原生CSS（之前使用Tailwind CSS，已替换）
- **HTTP客户端**：原生fetch API

#### 开发环境配置

1. **Node.js**：版本 16.0 或更高
2. **npm**：版本 7.0 或更高
3. **开发命令**：
   - 安装依赖：`npm install`
   - 启动开发服务器：`npm run dev`
   - 构建生产版本：`npm run build`
   - 预览生产构建：`npm run preview`

#### 环境变量

前端项目使用环境变量配置API地址，可在`.env`文件中配置：

```env
# 开发环境
VITE_API_BASE_URL=http://localhost:8081

# 生产环境
# VITE_API_BASE_URL=https://api.example.com
```

### 10.4 前端API调用方式

前端通过`src/services/api.js`中的API服务函数与后端通信，主要包括：

- **用户认证**：登录、注册等
- **套餐管理**：获取套餐列表、选择套餐等
- **监控管理**：添加、更新、删除监控等
- **通知管理**：获取通知列表、标记已读等
- **卡密管理**：使用卡密等

### 10.5 前端路由结构

| 路径                   | 组件                         | 说明           |
| :--------------------- | :--------------------------- | :------------- |
| `/`                    | `Home.vue`                   | 首页           |
| `/login`               | `Login.vue`                  | 登录页         |
| `/admin/plans`         | `PlansManagement.vue`        | 管理员套餐管理 |
| `/admin/notifications` | `NotificationManagement.vue` | 管理员通知管理 |
| `/agent/service-plan`  | `ServicePlan.vue`            | 代理商服务套餐 |

### 10.6 部署说明

1. **构建生产版本**：

   ```bash
   npm run build
   ```

2. **部署到服务器**：

   - 将`dist`目录上传到服务器
   - 配置Nginx反向代理：

   ```nginx
   server {
     listen 80;
     server_name example.com;
     root /path/to/dist;
     
     # API反向代理
     location /api {
       proxy_pass http://localhost:8081;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     }
     
     # 前端路由支持
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. 