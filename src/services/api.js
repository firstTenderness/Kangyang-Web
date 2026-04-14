// API服务管理

// API基础URL - 使用相对路径，通过Nginx代理处理跨域
const apiBaseUrl = '/api';

/**
 * API服务类
 * 提供完整的API请求功能，支持动态统计数据的获取
 */

// 从本地存储获取API基础URL - 始终返回相对路径
const loadApiBaseUrl = () => {
  // 始终使用相对路径，忽略本地存储
  return apiBaseUrl;
};

// 保存API基础URL到本地存储 - 空实现，避免覆盖
const saveApiBaseUrl = (url) => {
  // 不保存到本地存储，始终使用相对路径
};

// 构建完整的API URL
const buildApiUrl = (endpoint, params = {}) => {
  // 如果endpoint已经是完整的URL，则直接返回
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  // 确保endpoint以/开头
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 确保apiBaseUrl不以/结尾
  const normalizedBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;

  // 构建基础URL
  let url = `${normalizedBaseUrl}${normalizedEndpoint}`;

  // 处理查询参数
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  if (queryParams) {
    url += `?${queryParams}`;
  }

  return url;
};

// 请求缓存，包含过期时间
const requestCache = new Map();

// 缓存过期时间（毫秒）
const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟

// 缓存键生成函数
const generateCacheKey = (endpoint, options = {}) => {
  const { params, method = 'GET', body } = options;
  const url = buildApiUrl(endpoint, params);
  return `${method}:${url}:${body || ''}`;
};

// 防抖请求存储
const debouncedRequests = new Map();

// 通用API请求函数
const apiRequest = async (endpoint, options = {}) => {
  try {
    const { params, cache = false, cacheExpiry = CACHE_EXPIRY, debounce = false, debounceDelay = 300, ...fetchOptions } = options;
    const url = buildApiUrl(endpoint, params);

    // 生成缓存键
    const cacheKey = generateCacheKey(endpoint, { ...options, params });

    // 检查缓存
    if (cache && requestCache.has(cacheKey)) {
      const cachedData = requestCache.get(cacheKey);
      const now = Date.now();
      // 检查缓存是否过期
      if (now - cachedData.timestamp < cacheExpiry) {
        return cachedData.data;
      } else {
        // 缓存过期，删除
        requestCache.delete(cacheKey);
      }
    }

    // 处理防抖
    if (debounce) {
      const debounceKey = cacheKey;
      // 清除之前的防抖请求
      if (debouncedRequests.has(debounceKey)) {
        clearTimeout(debouncedRequests.get(debounceKey));
      }

      // 创建新的防抖请求
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(async () => {
          try {
            const result = await performRequest();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            debouncedRequests.delete(debounceKey);
          }
        }, debounceDelay);

        debouncedRequests.set(debounceKey, timeoutId);
      });
    }

    // 执行请求
    return await performRequest();

    // 实际执行请求的函数
    async function performRequest() {
      // 获取token
      const token = localStorage.getItem('userToken');

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...fetchOptions.headers
      };

      const response = await fetch(url, {
        ...fetchOptions,
        headers: headers,
        cache: 'no-cache' // 确保每次都获取最新数据
      });

      const data = await response.json();

      // 缓存响应
      if (cache && data.code === 200) {
        requestCache.set(cacheKey, {
          data: data,
          timestamp: Date.now()
        });
      }

      return data;
    }
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
};

// 清除缓存
const clearCache = (pattern = null) => {
  if (pattern) {
    // 清除匹配的缓存
    for (const key of requestCache.keys()) {
      if (key.includes(pattern)) {
        requestCache.delete(key);
      }
    }
  } else {
    // 清除所有缓存
    requestCache.clear();
  }
};

// 导出API服务
const apiService = {
  loadApiBaseUrl,
  saveApiBaseUrl,
  getApiBaseUrl: () => apiBaseUrl,
  buildApiUrl,
  request: apiRequest,
  clearCache,

  // 快捷方法
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
  patch: (endpoint, data, options = {}) => apiRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) })
};

export default apiService;