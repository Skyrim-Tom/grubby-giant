---
title: "每日一刷 - 2026前端面试题汇总"
description: "从各种大厂面试中提取的前端面试题，涵盖 Vue3、Pinia、WebSocket、GeoJSON、Kadane 算法等高频考点。适合备战大厂前端面试的同学参考。"
pubDate: 2026-05-14
category: "面试"
tags: ["面试", "前端", "Vue3", "Pinia", "WebSocket", "GeoJSON", "算法", "性能优化"]
readTime: "40 分钟"
featured: false
---

> 本文从各种大厂面试中提取的前端面试题，涵盖 Vue3、Pinia、WebSocket、GeoJSON、Kadane 算法等高频考点。适合备战大厂前端面试的同学参考。

---

## 第 1 题：自我介绍

自我介绍虽然看似简单，却是面试官对你的第一印象，建议按照 **"个人背景 → 核心项目 → 技术亮点 → 求职意向"** 的结构来组织，控制在 2~3 分钟内。

**参考框架：**

> 您好，我叫 XXX，毕业于 XX 大学计算机相关专业，有 X 年前端开发经验。目前主要使用 Vue3 + TypeScript 技术栈，在上一家公司主要负责智慧城市/交通领域的大屏可视化平台开发，核心项目包括：公交实时监控大屏、基于 GIS 地图的行政区划展示系统、以及多系统集成平台。在项目中我主导了权限路由体系设计、双 Token 无感刷新方案、以及 WebSocket 多路复用管理器的实现。我对高性能前端架构和复杂业务场景设计有较深的理解，希望能加入百度继续在这个方向深耕。

**几个关键点：**

- 突出与岗位相关的技术栈和项目经验
- 用数据量化成果（如"将首屏加载时间从 4s 优化到 1.2s"）
- 提前准备好 1~2 个"亮点项目"，方便面试官顺着问

---

## 第 2 题：系统后期要支持多租户，前端该如何改造？

多租户（Multi-Tenancy）是 SaaS 系统的核心架构需求。前端改造的核心思路是：**隔离 + 定制化**。

### 租户识别

首先要解决"我是谁"的问题。常见方案：

- **子域名识别**：`tenant-a.example.com`，前端通过 `window.location.hostname` 解析租户标识
- **路径前缀**：`example.com/tenant-a/...`
- **登录态注入**：登录后 Token 携带 `tenantId`，前端从 Token Payload 中解析

### 主题与品牌定制

不同租户往往有不同的 UI 风格（Logo、主色调、字体等）。推荐方案：

```js
// 1. 拉取租户配置
const tenantConfig = await fetchTenantConfig(tenantId)

// 2. 动态注入 CSS 变量
document.documentElement.style.setProperty('--primary-color', tenantConfig.primaryColor)
document.documentElement.style.setProperty('--logo-url', `url(${tenantConfig.logoUrl})`)
```

结合 CSS Variables + 动态主题切换，可以做到零刷新的品牌定制。

### 权限与菜单隔离

不同租户开通的功能模块不同，前端路由和菜单需要基于租户配置动态生成：

```js
// 根据租户权限动态注册路由
const routes = buildRoutesFromTenantPermissions(tenantConfig.permissions)
router.addRoute(routes)
```

### 数据隔离

所有 API 请求需要在 Header 中携带 `X-Tenant-Id`，通过 Axios 拦截器统一处理：

```js
axios.interceptors.request.use(config => {
  config.headers['X-Tenant-Id'] = store.tenantId
  return config
})
```

### 微前端方案（进阶）

如果不同租户需要加载完全不同的业务模块，可以考虑 **qiankun / Module Federation** 实现按租户加载子应用，彻底做到功能级隔离。

---

## 第 3 题：Vue3 Composition API setup() 里响应式丢失的原因及解决

这是 Vue3 最常见的坑之一，核心原因是**解构/赋值破坏了响应式代理**。

### 原因分析

Vue3 的响应式基于 `Proxy`，`reactive()` 返回的是一个代理对象，只有通过代理对象访问属性才会触发依赖追踪。一旦解构，就拿到了原始值，失去了响应性：

```js
const state = reactive({ count: 0, name: 'Vue' })

// ❌ 解构后失去响应性
const { count, name } = state
// count 是普通数字 0，修改 state.count 不会触发更新

// ✅ 正确：始终通过代理对象访问
state.count++
```

`ref()` 也有类似问题：

```js
const user = ref({ name: 'Alice' })

// ❌ 解构后 name 不再是响应式的
const { name } = user.value
```

### 解决方案

**方案一：使用 `toRefs()` 解构 reactive 对象**

```js
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0, name: 'Vue' })

// ✅ toRefs 将每个属性转为 ref，保持响应性
const { count, name } = toRefs(state)

// 访问时需要 .value
console.log(count.value)
```

**方案二：使用 `toRef()` 转换单个属性**

```js
const count = toRef(state, 'count')
```

**方案三：对于 `ref`，不要解构 `.value` 中的对象属性**

```js
const user = ref({ name: 'Alice' })

// ✅ 模板中直接用 user.name，setup 里用 user.value.name
```

**方案四：函数传参时用 `toRef`**

```js
// ❌ 传递 props.count 会失去响应性
useCounter(props.count)

// ✅ 用 toRef 包装
useCounter(toRef(props, 'count'))
```

> 记忆口诀：`reactive` 解构要用 `toRefs`；`ref` 返回的对象整体传，不拆 `.value`。

---

## 第 4 题：用了 Pinia 做状态管理，模块之间通信怎么处理？

Pinia 天然支持 Store 之间的相互引用，这是它比 Vuex 更灵活的地方。

### 方式一：Store 中直接引用另一个 Store

```js
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ userId: null, role: 'guest' }),
})

// stores/order.js
import { useUserStore } from './user'

export const useOrderStore = defineStore('order', () => {
  const userStore = useUserStore() // 直接使用另一个 Store

  const fetchOrders = async () => {
    const orders = await api.getOrders(userStore.userId)
    return orders
  }

  return { fetchOrders }
})
```

### 方式二：通过 Action 触发另一个 Store 的 Action

```js
// stores/auth.js
export const useAuthStore = defineStore('auth', () => {
  const cartStore = useCartStore()

  const logout = () => {
    cartStore.clearCart() // 登出时清空购物车
    token.value = null
  }

  return { logout }
})
```

### 方式三：使用 $subscribe 实现响应式联动

```js
// 监听 A store 的状态变化，自动同步到 B store
userStore.$subscribe((mutation, state) => {
  if (mutation.type === 'direct') {
    permissionStore.refreshPermissions(state.role)
  }
})
```

### 方式四：共享的"胶水 Store"

对于复杂的跨模块通信，可以抽象一个协调层 Store（类似事件总线）：

```js
// stores/globalEvents.js
export const useEventStore = defineStore('events', () => {
  const events = ref([])
  const emit = (event) => events.value.push(event)
  const on = (type, handler) => { /* ... */ }
  return { emit, on }
})
```

---

## 第 5 题：RBAC 权限变更后，如何清理之前加载的权限路由？

这是一道考察**动态路由管理**的场景题，核心挑战是：Vue Router 一旦 `addRoute`，路由就持久存在于实例中，角色被删后必须手动清理。

### 实现思路

**第一步：记录动态添加的路由名称**

```js
const dynamicRouteNames = []

function addDynamicRoutes(routes) {
  routes.forEach(route => {
    router.addRoute(route)
    dynamicRouteNames.push(route.name)
  })
}
```

**第二步：权限变更时，先清除所有动态路由**

```js
function clearDynamicRoutes() {
  dynamicRouteNames.forEach(name => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
  dynamicRouteNames.length = 0
}
```

**第三步：重新拉取权限并注册路由**

```js
async function refreshPermissions() {
  clearDynamicRoutes()           // 1. 清除旧路由
  permissionStore.$reset()       // 2. 清除 Pinia 中的权限状态

  const newPermissions = await api.getUserPermissions()  // 3. 重新拉取
  const newRoutes = generateRoutes(newPermissions)
  addDynamicRoutes(newRoutes)    // 4. 重新注册路由

  router.replace('/')            // 5. 跳回首页，避免停留在无权限页面
}
```

**第四步：在哪里触发？**

- **WebSocket 推送**：服务端主动推送权限变更通知
- **路由守卫**：每次导航时校验当前路由是否还在权限列表中
- **Axios 拦截器**：捕获后端返回的 403，触发 `refreshPermissions()`

```js
axios.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 403) {
    await refreshPermissions()
  }
  return Promise.reject(error)
})
```

---

## 第 6 题：双 Token 无感刷新中，refresh token 也失效且有一堆挂起请求时怎么处理？

这道题考察的是**并发请求处理**和**优雅降级**能力。

### 核心问题：并发请求导致多次刷新

当多个请求同时收到 401，如果每个都去刷新，会造成刷新竞态。标准解法是**刷新锁 + 请求队列**：

```js
let isRefreshing = false
let pendingQueue = []

axios.interceptors.response.use(null, async (error) => {
  const originalRequest = error.config

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    if (isRefreshing) {
      // 已经在刷新中，将当前请求加入队列
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`
        return axios(originalRequest)
      })
    }

    isRefreshing = true

    try {
      const newToken = await refreshAccessToken()

      // 刷新成功：释放队列中所有挂起请求
      pendingQueue.forEach(({ resolve }) => resolve(newToken))
      pendingQueue = []

      originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      return axios(originalRequest)

    } catch (refreshError) {
      // ⚠️ refresh token 也失效了
      pendingQueue.forEach(({ reject }) => reject(refreshError))
      pendingQueue = []

      handleAuthFailure() // 执行登出
      return Promise.reject(refreshError)

    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(error)
})
```

### refresh token 失效的处理

```js
function handleAuthFailure() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  userStore.$reset()
  ElMessage.warning('登录已过期，请重新登录')
  router.replace({
    path: '/login',
    query: { redirect: router.currentRoute.value.fullPath }
  })
}
```

**关键点**：`pendingQueue` 中所有挂起请求都要 `reject`，否则这些 Promise 会永久挂起，造成内存泄漏和页面假死。

---

## 第 7 题：iframe 嵌入第三方监控系统，且要根据用户权限控制展示内容，怎么处理？

核心约束：第三方系统**不能改代码**，只能 iframe 嵌入，需要根据用户权限控制展示内容。

### 方案一：postMessage 通信

如果第三方系统内部有监听 `message` 事件的逻辑：

```js
const iframe = document.querySelector('#camera-iframe')
iframe.contentWindow.postMessage({
  type: 'SET_PERMISSIONS',
  cameras: ['cam-01', 'cam-02'] // 该用户有权限看的摄像头
}, 'https://third-party-domain.com')
```

### 方案二：URL 参数传递权限 Token

```js
const permissions = encodeURIComponent(JSON.stringify(userPermissions))
iframeSrc.value = `https://camera.example.com?token=${authToken}&permissions=${permissions}`
```

### 方案三：服务端代理 + 内容过滤（最稳健）

```
用户 → 我们的后端 → 第三方系统
                ↑
        后端根据用户权限过滤响应内容
```

前端加载我们自己服务端代理的页面，完全可控。

### 方案四：父页面覆盖遮罩层

在 iframe 上方叠加透明遮罩层，通过 CSS 精准遮挡无权限区域：

```html
<div class="iframe-wrapper">
  <iframe src="..." />
  <div v-if="!hasPermission('cam-03')" class="mask" :style="maskPosition" />
</div>
```

> 注意：遮罩层方案只是视觉层面的控制，数据层面仍需后端鉴权。

---

## 第 8 题：从多个 API 拉取数据结构不一致（camelCase、snake_case、中文 key），如何统一？

### 设计数据适配器（Adapter Pattern）

```js
// adapters/index.js

// snake_case → camelCase（B 系统）
function fromSnakeCase(data) {
  return transformKeys(data, key =>
    key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
  )
}

// 中文 key → 标准英文 key（C 系统）
const chineseKeyMap = {
  '用户名': 'username',
  '创建时间': 'createdAt',
  '订单号': 'orderId',
}

function fromChineseKey(data) {
  return transformKeys(data, key => chineseKeyMap[key] || key)
}

// 递归转换所有 key
function transformKeys(obj, transformer) {
  if (Array.isArray(obj)) return obj.map(item => transformKeys(item, transformer))
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        transformer(k),
        transformKeys(v, transformer)
      ])
    )
  }
  return obj
}
```

### 在 Axios 拦截器中按 API 来源自动适配

```js
axios.interceptors.response.use(response => {
  const source = response.config.headers['X-Data-Source']

  switch (source) {
    case 'system-b': return fromSnakeCase(response.data)
    case 'system-c': return fromChineseKey(response.data)
    default: return response.data
  }
})
```

### 定义统一的数据 Schema（TypeScript）

```ts
interface UnifiedOrder {
  orderId: string
  username: string
  createdAt: string
  amount: number
}
```

适配器的最终产物都要符合这个 Schema，业务层只消费统一格式，完全屏蔽数据源差异。进阶方案可以用 `zod` 做运行时校验，不符合 Schema 直接报错。

---

## 第 9 题：20+ 页面，需求方频繁改字段/加字段，如何设计以减少改组件的工作量？

这道题考察**配置驱动（Schema-Driven）UI**的设计思想，是中后台系统的经典架构问题。

### 核心思路：表单/表格 Schema 配置化

把字段定义从组件代码里抽离到配置文件，组件只负责根据配置渲染：

```js
// config/userPageSchema.js
export const userTableColumns = [
  { key: 'name',      label: '姓名',   type: 'text'   },
  { key: 'age',       label: '年龄',   type: 'number' },
  { key: 'status',    label: '状态',   type: 'tag',   options: statusOptions },
  { key: 'createdAt', label: '创建时间', type: 'date'  },
]

export const userFormSchema = [
  { field: 'name',  label: '姓名', component: 'Input',  rules: [{ required: true }] },
  { field: 'age',   label: '年龄', component: 'InputNumber' },
  { field: 'email', label: '邮箱', component: 'Input',  type: 'email' },
]
```

### 通用表格组件

```vue
<template>
  <el-table :data="tableData">
    <el-table-column
      v-for="col in columns"
      :key="col.key"
      :prop="col.key"
      :label="col.label"
    >
      <template #default="{ row }">
        <el-tag v-if="col.type === 'tag'">{{ row[col.key] }}</el-tag>
        <span v-else>{{ row[col.key] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
```

### 通用表单组件

```vue
<template>
  <el-form :model="formData">
    <template v-for="field in schema" :key="field.field">
      <el-form-item :label="field.label" :prop="field.field" :rules="field.rules">
        <component
          :is="`El${field.component}`"
          v-model="formData[field.field]"
          v-bind="field.props"
        />
      </el-form-item>
    </template>
  </el-form>
</template>
```

需求方要加一个"手机号"字段？只需在 Schema 里加一行，**无需改任何组件代码**：

```js
{ field: 'phone', label: '手机号', component: 'Input', rules: [phoneRule] }
```

进阶方案：让后端动态下发 Schema，真正做到零前端发版：

```js
const schema = await api.getPageSchema('user-management')
```

---

## 第 10 题：拖拽式 Dashboard 系统设计

### 核心数据结构

```ts
interface WidgetConfig {
  id: string
  type: 'LineChart' | 'BarChart' | 'MapLayer' | 'Table'
  layout: { x: number; y: number; w: number; h: number }
  dataSource: {
    type: 'api' | 'websocket' | 'static'
    url?: string
    refreshInterval?: number
  }
  props: Record<string, any>
}
```

### 拖拽实现

使用 `vue-grid-layout` 处理拖拽和 resize：

```vue
<grid-layout
  :layout="widgets"
  :col-num="24"
  :is-draggable="editMode"
  :is-resizable="editMode"
  @layout-updated="onLayoutUpdated"
>
  <grid-item v-for="widget in widgets" :key="widget.id" v-bind="widget.layout">
    <component :is="widgetRegistry[widget.type]" :config="widget" />
  </grid-item>
</grid-layout>
```

### 组件注册表（插件化）

```js
const widgetRegistry = {
  LineChart: defineAsyncComponent(() => import('./widgets/LineChart.vue')),
  BarChart:  defineAsyncComponent(() => import('./widgets/BarChart.vue')),
  MapLayer:  defineAsyncComponent(() => import('./widgets/MapLayer.vue')),
}

// 支持动态注册新组件（插件化扩展）
function registerWidget(type, component) {
  widgetRegistry[type] = component
}
```

### 数据源管理

```js
class DataSourceManager {
  private sources = new Map()

  subscribe(config, widgetId, callback) {
    if (config.type === 'api') {
      const timer = setInterval(() => {
        fetch(config.url).then(r => r.json()).then(callback)
      }, config.refreshInterval)
      this.sources.set(widgetId, timer)
    }
  }

  unsubscribe(widgetId) {
    clearInterval(this.sources.get(widgetId))
    this.sources.delete(widgetId)
  }
}
```

Dashboard 配置以 JSON 形式存储到后端，支持保存/加载/分享布局。

---

## 第 11 题：页面同时展示 300 辆车的实时位置+轨迹，如何优化？

### 渲染层优化

**1. 使用 Canvas/WebGL 代替 DOM**

300 个 Marker 用 DOM 渲染会有大量重排，改用 Canvas 或 deck.gl 的 WebGL 渲染：

```js
new ScatterplotLayer({
  data: vehicles,
  getPosition: d => [d.lng, d.lat],
  getRadius: 5,
})
```

**2. 只渲染视口内的车辆**

```js
const bounds = map.getBounds()
const visibleVehicles = vehicles.filter(v => bounds.contains([v.lat, v.lng]))
```

**3. 点位聚合（Clustering）**

缩小地图时自动聚合临近点位，放大后展开：

```js
const markers = L.markerClusterGroup()
vehicles.forEach(v => markers.addLayer(L.marker([v.lat, v.lng])))
map.addLayer(markers)
```

### 数据层优化

- **WebSocket 增量推送**：不推全量，只推变化的车辆数据
- **前端数据节流**：限制每 500ms 批量更新一次 Marker
- **轨迹懒加载**：仅在用户点击某辆车时才拉取该车的完整历史轨迹

### 内存管理

- 轨迹点队列限制最大长度（保留最近 200 个点）
- 驶出视野的车辆设为不可见而非销毁，避免频繁创建/销毁

---

## 第 12 题：地图中如何处理 GPS 轨迹"锯齿"问题？

GPS 漂移和高频采样会导致轨迹出现锯齿，核心解法是**轨迹平滑算法**。

### 方案一：道格拉斯-普克（Douglas-Peucker）简化算法

抽稀点位，去除冗余点，保留关键拐点：

```js
import simplify from 'simplify-js'

const points = rawGpsData.map(p => ({ x: p.lng, y: p.lat }))
// tolerance 越大，保留点越少，轨迹越平滑
const simplified = simplify(points, 0.0001, true)
```

### 方案二：卡尔曼滤波（Kalman Filter）

对 GPS 噪点进行统计滤波，适合实时流数据：

```js
class KalmanFilter {
  constructor() {
    this.q = 3; this.r = 10; this.p = 1; this.x = 0; this.k = 0
  }
  filter(measurement) {
    this.p = this.p + this.q
    this.k = this.p / (this.p + this.r)
    this.x = this.x + this.k * (measurement - this.x)
    this.p = (1 - this.k) * this.p
    return this.x
  }
}

const latFilter = new KalmanFilter()
const lngFilter = new KalmanFilter()

const smoothed = rawPoints.map(p => ({
  lat: latFilter.filter(p.lat),
  lng: lngFilter.filter(p.lng),
}))
```

### 方案三：速度/物理约束过滤

基于物理约束过滤异常点（如车速超过 300km/h 的 GPS 漂移点）：

```js
function filterAbnormalPoints(points) {
  return points.filter((point, i) => {
    if (i === 0) return true
    const prev = points[i - 1]
    const speed = calcDistance(prev, point) / (point.timestamp - prev.timestamp)
    return speed < 83.3 // 过滤掉速度超过 300km/h 的异常点
  })
}
```

### 方案四：贝塞尔曲线平滑（视觉层）

```js
// Leaflet 使用 smoothFactor 让折线视觉上更平滑
L.polyline(points, { smoothFactor: 2 }).addTo(map)
```

---

## 第 13 题：GeoJSON 字段结构 + 行政区数据裁剪与按需加载

### GeoJSON 核心字段

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[121.0, 31.0], [121.5, 31.0], [121.5, 31.5], [121.0, 31.0]]
        ]
      },
      "properties": {
        "name": "浦东新区",
        "adcode": "310115",
        "level": "district"
      }
    }
  ]
}
```

常见几何类型：`Point`（单点）、`LineString`（路线/轨迹）、`Polygon`（单个区域）、`MultiPolygon`（含飞地的行政区）。

### 数据裁剪与按需加载策略

**策略一：前端 `filter` 过滤**

```js
const pudongData = chinaGeoJson.features.filter(
  f => f.properties.adcode === '310115'
)
```

**策略二：后端接口按 adcode 查询（推荐）**

```js
const res = await fetch('/api/geo/district?adcode=310115')
const pudongGeo = await res.json()
```

**策略三：预切割静态文件 + CDN 按需加载**

将全国 GeoJSON 按区划拆分成独立文件，存储到 CDN，前端按需加载并本地缓存：

```js
async function loadDistrict(adcode) {
  const cache = geoCache.get(adcode)
  if (cache) return cache

  const data = await fetch(`https://cdn.example.com/geo/${adcode}.json`).then(r => r.json())
  geoCache.set(adcode, data)
  return data
}
```

**策略四：Turf.js 做空间裁剪**

```js
import * as turf from '@turf/turf'

const pudongBbox = turf.bbox(pudongGeoJson)
const clipped = turf.bboxClip(otherLayer, pudongBbox)
```

---

## 第 14 题：WebSocket 多连接复用，保证不丢数据

一个页面同时订阅车辆位置、报警事件、设备状态，如果开三个 WebSocket 连接会造成资源浪费。标准解法是**单连接多路复用（消息分发）**。

### 设计 WebSocket 管理器

```js
class WebSocketManager {
  constructor(url) {
    this.url = url
    this.ws = null
    this.handlers = new Map() // topic → handlers Set
    this.messageQueue = []   // 断线时的消息缓冲
    this.connect()
  }

  connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.resubscribeAll() // 重连后重新订阅所有 topic
    }

    this.ws.onmessage = ({ data }) => {
      const { topic, payload } = JSON.parse(data)
      this.handlers.get(topic)?.forEach(handler => handler(payload))
    }

    this.ws.onclose = () => this.scheduleReconnect()
  }

  subscribe(topic, handler) {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set())
      this.send({ action: 'subscribe', topic })
    }
    this.handlers.get(topic).add(handler)
    return () => this.unsubscribe(topic, handler) // 返回取消订阅函数
  }

  unsubscribe(topic, handler) {
    const handlers = this.handlers.get(topic)
    handlers?.delete(handler)
    if (handlers?.size === 0) {
      this.handlers.delete(topic)
      this.send({ action: 'unsubscribe', topic })
    }
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      this.messageQueue.push(data) // 未就绪时缓冲消息
    }
  }

  resubscribeAll() {
    this.handlers.forEach((_, topic) => this.send({ action: 'subscribe', topic }))
    while (this.messageQueue.length) this.send(this.messageQueue.shift())
  }

  scheduleReconnect(delay = 1000) {
    setTimeout(() => this.connect(), Math.min(delay * 2, 30000)) // 指数退避，最大 30s
  }
}

export const wsManager = new WebSocketManager('wss://api.example.com/ws')
```

### 业务层使用

```js
onMounted(() => {
  const unsub1 = wsManager.subscribe('vehicle-position', handleVehicleUpdate)
  const unsub2 = wsManager.subscribe('alarm-event', handleAlarm)
  const unsub3 = wsManager.subscribe('device-status', handleDeviceStatus)

  onUnmounted(() => { unsub1(); unsub2(); unsub3() })
})
```

保证不丢数据的关键：断线时消息缓冲、重连后补发；服务端可结合消息 ID + 断点续传；心跳机制及时发现"假连接"。

---

## 第 15 题：图表/地图数据级联问题，点击图表联动地图

### 方案：Pinia 共享状态（推荐）

```js
// stores/dashboard.js
export const useDashboardStore = defineStore('dashboard', () => {
  const selectedProjectId = ref(null)

  function selectProject(projectId) {
    selectedProjectId.value = projectId
  }

  return { selectedProjectId, selectProject }
})
```

图表组件触发选中：

```js
// ChartComponent.vue
const dashboardStore = useDashboardStore()

function onChartClick(params) {
  dashboardStore.selectProject(params.data.projectId)
}
```

地图组件响应联动：

```js
// MapComponent.vue
const dashboardStore = useDashboardStore()

watch(() => dashboardStore.selectedProjectId, (projectId) => {
  if (projectId) {
    highlightRegion(projectId)
    map.flyTo(getProjectCenter(projectId), 12)
  }
})
```

也可以使用 `mitt` 事件总线作为轻量级替代方案：

```js
bus.emit('project-selected', { projectId: 'P001', coords: [121.5, 31.2] })
bus.on('project-selected', ({ coords }) => map.flyTo(coords))
```

高性能联动注意点：地图 `flyTo` 应做 `debounce` 防抖，防止高频点击触发过多动画。

---

## 第 16 题：手撕算法：最大子数组和（Kadane's Algorithm）

> 给定整数数组 `nums`，找到具有最大和的连续子数组，打印该子数组并返回其最大和。

### 解题思路

使用 **Kadane 算法**，时间复杂度 O(n)，空间复杂度 O(1)。

核心思想：遍历数组，维护"当前子数组的和"，如果加入当前元素能让和更大就继续延伸，否则从当前元素重新开始。

```js
function maxSubArray(nums) {
  let maxSum = nums[0]
  let currentSum = nums[0]
  let start = 0, end = 0, tempStart = 0

  for (let i = 1; i < nums.length; i++) {
    if (currentSum + nums[i] < nums[i]) {
      // currentSum < 0，之前的和是负担，从当前元素重新开始
      currentSum = nums[i]
      tempStart = i
    } else {
      currentSum += nums[i]
    }

    if (currentSum > maxSum) {
      maxSum = currentSum
      start = tempStart
      end = i
    }
  }

  console.log('最大子数组:', nums.slice(start, end + 1))
  return maxSum
}

// 测试
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
// 最大子数组: [4, -1, 2, 1]
// 返回: 6
```

### 思路拆解

`currentSum + nums[i] < nums[i]` 等价于 `currentSum < 0`，说明之前的累积和是拖累，应该丢弃，以当前元素为新起点。每步更新 `maxSum` 记录历史最大值，同时用 `start/end` 记录边界以便还原子数组内容。

**边界情况**：全负数数组返回最大的单个元素（如 `[-3, -1, -2]` 返回 `-1`）；全正数则整个数组就是答案。

---

## 第 17 题：反问环节

反问是展示主动性和对岗位热情的好机会，避免问薪资福利等敏感问题，建议问：

- **技术方向**：「请问团队目前在前端方向主要在做哪些技术探索或优化方向？」
- **工程文化**：「团队在代码规范、Code Review 方面是怎么做的？」
- **成长路径**：「对于初入团队的前端工程师，通常 6 个月内的成长预期是怎样的？」
- **项目现状**：「请问我可能参与的核心项目，目前面临的最大技术挑战是什么？」

---

## 总结

这套百度一面题涵盖的技术深度相当广：从 Vue3 原理到复杂场景设计，从地图性能优化到 WebSocket 架构，再到算法实战。准备此类面试的建议如下：

- 对自己简历上的**每一个项目**，都要能说清楚"为什么这样设计"、"遇到什么问题"、"怎么解决的"
- 场景题没有唯一解，重点展示**结构化思考**和**权衡取舍的能力**
- 算法题要能清晰解释思路，不只是写出代码

祝面试顺利！
