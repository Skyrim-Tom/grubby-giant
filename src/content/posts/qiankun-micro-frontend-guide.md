---
title: "qiankun 微前端知识点整理"
description: "围绕 qiankun 微前端体系整理核心知识点，覆盖微前端架构、主应用与子应用接入、生命周期、沙箱隔离、样式隔离、应用通信、模块联邦、工程化与常见问题。"
pubDate: 2026-05-27
category: "技术教程"
tags: ["qiankun", "微前端", "模块联邦", "前端架构", "应用通信"]
readTime: "30 分钟"
featured: false
---

# qiankun 微前端知识点整理

微前端解决的不是“怎么把页面拆小”这么简单的问题，而是当一个前端系统变得足够大时，如何让不同团队、不同技术栈、不同发布节奏的应用仍然可以组合成一个统一产品。

这篇文章围绕 qiankun 体系做一次较完整的知识点整理，同时会横向比较模块联邦，并重点展开主应用与子应用之间的通信方案。

## 什么是微前端

微前端可以理解为前端领域的“微服务化”：把一个大型前端应用拆成多个可以独立开发、独立构建、独立部署的子应用，再由一个主应用负责组合、路由分发、运行时加载和公共能力管理。

常见拆分维度包括：

- 按业务域拆分：用户中心、订单中心、营销中心、数据看板。
- 按团队边界拆分：每个团队维护自己的子应用。
- 按技术栈拆分：主应用是 Vue，某个历史模块是 React，另一个模块是原生 JavaScript。
- 按发布节奏拆分：高频迭代模块独立发布，低频模块保持稳定。
- 按存量系统拆分：新系统逐步接入旧系统，避免一次性重写。

微前端的目标不是“为了拆而拆”，而是让系统在规模增长后仍然可维护、可演进。

## 微前端要解决的问题

### 独立开发与部署

传统单体前端里，一个模块的小改动也可能需要整个前端仓库重新构建、测试和发布。微前端希望子应用可以独立构建、独立部署，主应用只负责在运行时加载对应入口。

### 技术栈无关

企业项目经常存在多代技术栈共存的问题。微前端允许 React、Vue、Angular、原生 JS 等应用在同一个产品中运行，只要它们遵守接入协议。

### 应用隔离

多个子应用运行在同一个页面中，会带来全局变量污染、样式污染、事件监听残留、定时器残留等问题。微前端框架需要尽可能提供运行时隔离能力。

### 统一用户体验

拆分之后不能让用户感觉自己在多个系统之间跳转。主应用通常会统一导航、登录态、权限、主题、埋点、错误处理和全局布局。

### 渐进式改造

对于旧系统，微前端很适合做渐进式迁移：先把旧系统作为子应用接入，后续再逐步替换内部模块。

## qiankun 是什么

qiankun 是基于 single-spa 的微前端实现方案，提供了更完整的工程化封装。它的核心思路是：

1. 主应用注册子应用。
2. 根据路由匹配决定加载哪个子应用。
3. 拉取子应用入口 HTML。
4. 解析并加载子应用的 JS 和 CSS 资源。
5. 在合适的生命周期中挂载或卸载子应用。
6. 通过沙箱和样式隔离降低应用之间的互相影响。

qiankun 的典型特点：

- 基于路由自动激活子应用。
- 支持 HTML Entry，子应用入口更接近普通 SPA 部署形态。
- 提供 JavaScript 沙箱、样式隔离、预加载等能力。
- 提供全局状态通信 API。
- 支持手动加载微应用，适合弹窗、局部区域、组件化场景。

## qiankun 与 single-spa 的关系

single-spa 更像底层调度器，它定义了微应用生命周期和路由激活机制。qiankun 在 single-spa 之上补齐了很多工程能力：

| 能力 | single-spa | qiankun |
| --- | --- | --- |
| 应用调度 | 支持 | 基于 single-spa |
| 生命周期 | 支持 | 支持 |
| HTML Entry | 需要自行处理 | 内置支持 |
| JS 沙箱 | 需要自行处理 | 内置支持 |
| 样式隔离 | 需要自行处理 | 提供配置 |
| 资源预加载 | 需要自行处理 | 提供配置 |
| 通信机制 | 需要自行设计 | 提供全局状态 API |

如果团队希望拥有更多底层控制权，可以直接使用 single-spa；如果希望快速落地业务微前端，qiankun 会更省心。

## qiankun 核心概念

### 主应用

主应用也叫基座应用，负责：

- 提供整体页面框架，例如导航、菜单、顶部栏、登录页。
- 注册子应用。
- 根据路由加载和卸载子应用。
- 下发全局数据，例如用户信息、权限、主题。
- 统一处理鉴权、异常、埋点和公共依赖策略。

主应用不应该承载过多子应用内部业务逻辑，否则会重新变成“中心化巨石”。

### 子应用

子应用是独立的 SPA，需要暴露 qiankun 能识别的生命周期函数：

- `bootstrap`：应用初始化，只执行一次。
- `mount`：应用挂载，每次进入应用时执行。
- `unmount`：应用卸载，每次离开应用时执行。
- `update`：可选，用于手动加载场景下响应 props 变化。

子应用本身应尽量保持可独立运行，也就是既能被主应用加载，也能单独访问调试。

### HTML Entry

qiankun 推荐通过 HTML 作为子应用入口，例如：

```ts
registerMicroApps([
  {
    name: 'user-center',
    entry: '//localhost:7101',
    container: '#subapp-container',
    activeRule: '/user',
  },
]);
```

主应用访问 `entry` 后，会解析子应用 HTML 中的脚本和样式资源，再注入到主应用页面中。

这种方式的好处是子应用部署形态自然，不需要主应用关心具体构建产物文件名。子应用每次构建后的 hash 文件也可以由自己的 `index.html` 管理。

### activeRule

`activeRule` 用来判断当前 URL 是否应该激活某个子应用。

常见写法：

```ts
registerMicroApps([
  {
    name: 'order',
    entry: '//localhost:7102',
    container: '#subapp-container',
    activeRule: '/order',
  },
]);
```

当浏览器路径匹配 `/order` 时，qiankun 会加载并挂载 `order` 子应用。

### container

`container` 是子应用挂载的 DOM 容器。主应用需要提供一个稳定的容器节点：

```html
<main id="subapp-container"></main>
```

子应用在 `mount` 时应渲染到这个容器里，在 `unmount` 时清理自己的渲染实例。

## 主应用接入示例

主应用最小接入通常包括三步：注册、启动、提供容器。

```ts
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vue-app',
    entry: '//localhost:7101',
    container: '#subapp-container',
    activeRule: '/vue',
    props: {
      from: 'main-app',
    },
  },
  {
    name: 'react-app',
    entry: '//localhost:7102',
    container: '#subapp-container',
    activeRule: '/react',
  },
]);

start({
  prefetch: true,
  sandbox: true,
});
```

`start` 常见配置：

- `prefetch`：是否预加载子应用资源。
- `sandbox`：是否开启沙箱。
- `singular`：是否保持同一时间只挂载一个子应用。
- `fetch`：自定义资源请求方法，可用于加 token、处理跨域或灰度。
- `excludeAssetFilter`：指定某些资源不被 qiankun 接管。

## 子应用接入示例

以 Vue 子应用为例，核心是导出生命周期并根据运行环境决定挂载方式。

```ts
import { createApp } from 'vue';
import App from './App.vue';

let app: ReturnType<typeof createApp> | null = null;

function render(props: { container?: Element } = {}) {
  const container = props.container
    ? props.container.querySelector('#app')
    : document.querySelector('#app');

  app = createApp(App);
  app.mount(container!);
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('vue app bootstrap');
}

export async function mount(props: { container?: Element }) {
  render(props);
}

export async function unmount() {
  app?.unmount();
  app = null;
}
```

子应用还需要注意构建配置。以 webpack 为例，通常要把输出格式配置为 `umd`，并保证 `jsonpFunction` 或 chunk loading 相关配置不会和其他应用冲突。

```js
module.exports = {
  output: {
    library: 'vueApp',
    libraryTarget: 'umd',
    chunkLoadingGlobal: 'webpackJsonp_vueApp',
  },
};
```

不同构建工具的配置细节会有差异，但目标一致：让主应用能够加载并调用子应用暴露的生命周期。

## 生命周期执行顺序

一个子应用首次进入时，大致流程是：

1. 主应用路由变化。
2. qiankun 匹配到 `activeRule`。
3. 拉取子应用入口资源。
4. 执行子应用脚本。
5. 调用 `bootstrap`。
6. 调用 `mount`。

离开子应用时：

1. 主应用路由变化。
2. 当前子应用不再匹配 `activeRule`。
3. 调用 `unmount`。
4. 清理 DOM、事件、定时器和应用实例。

再次进入已经加载过的子应用时，通常不会再执行 `bootstrap`，而是直接执行 `mount`。

## 路由设计

微前端路由最容易出问题，尤其是主应用和子应用都使用前端路由时。

### 主应用路由

主应用负责一级路由，例如：

- `/user`
- `/order`
- `/dashboard`

这些路径用于决定加载哪个子应用。

### 子应用路由

子应用负责自己的二级路由，例如：

- `/user/profile`
- `/user/role`
- `/order/list`
- `/order/detail/:id`

子应用需要配置正确的 `base`：

```ts
const router = createRouter({
  history: createWebHistory(
    (window as any).__POWERED_BY_QIANKUN__ ? '/user' : '/',
  ),
  routes,
});
```

### 路由模式选择

`history` 模式 URL 更干净，但需要服务端配置 fallback，刷新 `/user/profile` 时要能返回主应用 HTML。

`hash` 模式部署简单，但 URL 语义较弱。存量系统接入时，hash 模式常用于降低改造成本。

## JavaScript 沙箱

微前端中，多个应用共享一个浏览器环境。没有隔离时，子应用可能污染：

- `window` 全局变量。
- 全局事件监听。
- 定时器。
- 原型对象。
- 第三方库挂载的全局对象。

qiankun 的沙箱主要用于隔离和恢复全局变量变更。常见沙箱思路包括：

- 快照沙箱：进入应用前记录全局状态，离开时恢复。
- Proxy 沙箱：通过代理对象拦截对全局对象的读写。

沙箱能解决很多全局变量污染问题，但不是银弹。以下行为仍然需要开发者主动清理：

- `window.addEventListener` 注册的事件。
- `setInterval` 创建的定时器。
- 直接修改 DOM 中非本应用容器的节点。
- 修改 `document.body`、`document.head` 或原型对象。
- 第三方库创建的全局副作用。

建议在子应用中统一管理副作用，并在 `unmount` 中清理。

```ts
let timer: number | undefined;

export async function mount() {
  timer = window.setInterval(() => {
    console.log('polling');
  }, 5000);
}

export async function unmount() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}
```

## 样式隔离

样式污染通常比 JS 污染更隐蔽。常见问题包括：

- 子应用写了全局 `body`、`a`、`.btn` 样式，影响主应用。
- 主应用的 UI 库样式覆盖子应用。
- 多个子应用使用同一类名，样式互相覆盖。
- 弹窗挂载到 `body`，绕过了子应用容器。

qiankun 提供两类样式隔离思路：

### experimentalStyleIsolation

开启后，qiankun 会为子应用样式增加选择器前缀，让样式尽量只作用于子应用容器内部。

```ts
start({
  sandbox: {
    experimentalStyleIsolation: true,
  },
});
```

它对大部分普通样式有效，但对 `body`、弹窗 portal、动态插入样式等场景仍需额外处理。

### strictStyleIsolation

严格样式隔离通常基于 Shadow DOM，隔离更强，但也可能带来 UI 库弹窗、字体、全局样式变量、选择器穿透等兼容问题。

```ts
start({
  sandbox: {
    strictStyleIsolation: true,
  },
});
```

生产项目里更常见的做法是组合使用：

- CSS Modules、Scoped CSS、BEM 命名减少全局样式。
- 子应用根节点增加唯一 class 前缀。
- UI 库配置弹窗挂载容器，避免默认挂载到 `body`。
- 约定禁止子应用随意修改全局标签样式。

## 资源加载与预加载

qiankun 可以在空闲时预加载子应用资源，提高首次切换体验。

```ts
start({
  prefetch: true,
});
```

常见策略：

- `prefetch: true`：首个子应用挂载后预加载其他子应用。
- `prefetch: 'all'`：主应用启动后预加载所有子应用。
- 自定义函数：按业务优先级决定预加载哪些应用。

预加载不是越多越好。后台系统模块多时，如果一次性预加载所有子应用，可能造成网络拥堵和首屏资源竞争。更合理的策略是：

- 高频应用优先预加载。
- 低频应用按需加载。
- 大型子应用延迟预加载。
- 移动端或弱网环境减少预加载。

## 主应用与子应用通信

通信是微前端架构里最需要克制设计的部分。通信过少会导致重复请求和体验割裂，通信过多会让应用边界变得模糊。

### props 下发

注册子应用时，主应用可以通过 `props` 下发数据和方法。

```ts
registerMicroApps([
  {
    name: 'user',
    entry: '//localhost:7101',
    container: '#subapp-container',
    activeRule: '/user',
    props: {
      token: getToken(),
      userInfo: getUserInfo(),
      navigateTo: (path: string) => router.push(path),
    },
  },
]);
```

子应用在 `mount` 中接收：

```ts
export async function mount(props: {
  token?: string;
  userInfo?: UserInfo;
  navigateTo?: (path: string) => void;
}) {
  console.log(props.userInfo);
}
```

适合场景：

- 主应用向子应用下发初始化数据。
- 主应用下发公共方法，例如跳转、退出登录、打开全局弹窗。
- 子应用启动时需要知道当前用户、权限、主题。

注意点：

- props 更适合父到子的单向初始化传递。
- 不建议把大量业务状态都塞进 props。
- 函数 props 会形成主子应用耦合，要保持接口稳定。

### initGlobalState

qiankun 提供 `initGlobalState` 创建全局状态，主应用和子应用都可以监听状态变化。

主应用：

```ts
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({
  user: null,
  theme: 'light',
});

actions.onGlobalStateChange((state, prev) => {
  console.log('main state changed', state, prev);
});

actions.setGlobalState({
  user: {
    id: 1,
    name: 'Momoc',
  },
});
```

子应用：

```ts
export async function mount(props: any) {
  props.onGlobalStateChange?.((state: any, prev: any) => {
    console.log('sub app state changed', state, prev);
  }, true);

  props.setGlobalState?.({
    theme: 'dark',
  });
}

export async function unmount(props: any) {
  props.offGlobalStateChange?.();
}
```

适合场景：

- 用户信息、主题、语言、全局配置同步。
- 登录态变化通知所有应用。
- 主应用和子应用之间有少量共享状态。

注意点：

- 全局状态应保持小而稳定。
- 不要把子应用内部业务状态放到全局状态里。
- 状态结构要提前约定，避免不同子应用互相覆盖字段。
- 子应用卸载时要取消监听。

### 自定义事件

可以使用浏览器原生事件进行解耦通信。

```ts
window.dispatchEvent(
  new CustomEvent('micro:user-updated', {
    detail: {
      id: 1,
      name: 'Momoc',
    },
  }),
);
```

监听方：

```ts
function handleUserUpdated(event: Event) {
  const customEvent = event as CustomEvent;
  console.log(customEvent.detail);
}

window.addEventListener('micro:user-updated', handleUserUpdated);

export async function unmount() {
  window.removeEventListener('micro:user-updated', handleUserUpdated);
}
```

适合场景：

- 弱耦合通知。
- 不需要持久化状态的瞬时事件。
- 主应用不想直接暴露方法给子应用。

注意点：

- 事件名要统一命名空间，例如 `micro:user-updated`。
- 事件监听必须在卸载时清理。
- 不适合承载复杂业务流程。

### URL 与路由参数

URL 是最天然、最可回溯的通信介质。

适合放进 URL 的信息：

- 当前菜单。
- 筛选条件。
- 详情页 id。
- tab 状态。
- 可分享、可刷新恢复的页面状态。

不适合放进 URL 的信息：

- token。
- 大对象。
- 敏感数据。
- 频繁变化的临时状态。

微前端里尤其推荐把“页面定位信息”放进 URL，而不是依赖全局状态。这样刷新、复制链接、浏览器前进后退都会更稳定。

### localStorage 与 sessionStorage

存储可以作为跨应用共享信息的兜底方案，例如 token、主题、语言。

但存储不是响应式通信机制。一个应用写入后，另一个应用不一定立刻感知。可以配合 `storage` 事件，但同一页面内的同源写入并不会触发当前窗口自己的 `storage` 回调。

适合场景：

- 登录 token。
- 用户偏好。
- 低频全局配置。

不适合场景：

- 高频状态同步。
- 复杂业务数据流。
- 强一致通信。

### BroadcastChannel

`BroadcastChannel` 是浏览器提供的同源上下文通信能力，适合多个标签页、iframe 或同源应用之间广播消息。

```ts
const channel = new BroadcastChannel('micro-app');

channel.postMessage({
  type: 'theme-change',
  payload: 'dark',
});

channel.onmessage = (event) => {
  console.log(event.data);
};
```

适合场景：

- 多标签页同步登录状态。
- 多窗口同步主题或语言。
- 同源应用之间广播轻量事件。

### postMessage

如果微前端方案中使用 iframe，`postMessage` 是主要通信方式。

qiankun 默认不是 iframe 方案，但在接入外部系统、第三方页面或强隔离模块时，iframe 仍然常见。

适合场景：

- iframe 子系统。
- 跨域页面通信。
- 第三方页面嵌入。

注意点：

- 必须校验 `origin`。
- 消息结构要有明确的 `type`。
- 不要传递敏感信息。

### 共享状态库

主应用和子应用也可以共享一个状态库实例，例如 Redux、Pinia、RxJS store。

这种方式能力强，但耦合也强。通常只建议在同一技术栈、同一团队、强协作模块中使用。

对于跨团队微前端，更推荐把共享 store 控制在很小范围，只放全局基础信息，而不是业务状态。

## 通信方案怎么选

| 场景 | 推荐方案 |
| --- | --- |
| 主应用下发用户信息、权限、主题 | props 或 initGlobalState |
| 登录态变化通知所有应用 | initGlobalState + storage |
| 页面跳转 | 主应用下发 navigate 方法或 URL |
| 子应用通知主应用刷新菜单 | 自定义事件或 props 回调 |
| 子应用之间弱通知 | 自定义事件 |
| 可分享、可刷新恢复的状态 | URL |
| 多标签页同步 | BroadcastChannel 或 storage |
| iframe 通信 | postMessage |
| 同技术栈强共享状态 | 共享 store |

设计原则：

- 能用 URL 表达的状态，优先用 URL。
- 只读初始化数据可以用 props。
- 少量全局状态可以用 `initGlobalState`。
- 瞬时通知可以用自定义事件。
- 不要让子应用直接调用另一个子应用的内部方法。
- 通信协议要版本化、文档化，避免隐式耦合。

## qiankun 与模块联邦

模块联邦（Module Federation）是 webpack 5 提供的能力，核心是让一个应用在运行时加载另一个应用暴露出来的模块。

它和 qiankun 都能用于微前端，但关注点不一样。

### qiankun 更偏应用集成

qiankun 加载的是“应用”。子应用有自己的路由、生命周期、构建产物和部署入口。

适合：

- 多个完整 SPA 组合。
- 存量系统接入。
- 技术栈不同。
- 团队边界清晰。
- 希望独立部署、独立运行。

### 模块联邦更偏模块共享

模块联邦加载的是“模块”。一个应用可以暴露组件、工具函数、路由模块，也可以消费其他应用暴露的模块。

适合：

- 多应用共享组件库。
- 运行时组合页面局部模块。
- 多团队共同维护一个产品，但技术栈相对统一。
- 希望共享依赖，减少重复打包。

### 对比

| 维度 | qiankun | 模块联邦 |
| --- | --- | --- |
| 集成粒度 | 应用级 | 模块级 |
| 核心能力 | 生命周期、沙箱、HTML Entry、路由激活 | 远程模块加载、依赖共享 |
| 技术栈约束 | 较低 | 通常更依赖构建工具生态 |
| 隔离能力 | 更强调运行时隔离 | 默认隔离较弱 |
| 子应用独立运行 | 天然适合 | 需要额外设计 |
| 共享依赖 | 不是重点 | 核心能力之一 |
| 适合存量系统 | 更适合 | 改造成本可能更高 |
| 适合组件复用 | 可以但不优雅 | 更适合 |

### 能不能一起用

可以。常见组合方式是：

- 用 qiankun 管理应用级加载、路由、生命周期和隔离。
- 在同一技术栈的子应用之间，用模块联邦共享组件或工具模块。
- 对公共组件库，优先评估 npm 包、monorepo、模块联邦三种方式的成本。

不要为了“微前端”同时上所有技术。qiankun 和模块联邦解决的是不同层次的问题，组合使用时更要控制边界。

## 微前端公共能力设计

一个可维护的微前端平台，通常需要沉淀这些公共能力：

### 登录与鉴权

主应用统一处理登录态，子应用只消费必要信息。

建议：

- token 存储策略统一。
- 过期刷新统一。
- 无权限页面统一。
- 子应用不要各自实现一套登录流程。

### 权限与菜单

主应用统一拉取菜单和权限，决定可访问的子应用入口。子应用内部再根据权限控制按钮、页面和接口。

### 主题与国际化

主题、语言这类全局偏好适合由主应用管理，通过 props、全局状态或 CSS 变量下发给子应用。

### 错误处理

主应用可以统一监听资源加载失败、子应用挂载失败和全局运行时错误。

```ts
import { addGlobalUncaughtErrorHandler } from 'qiankun';

addGlobalUncaughtErrorHandler((event) => {
  console.error('micro app error', event);
});
```

子应用内部仍然要保留自己的错误边界和异常处理。

### 埋点与监控

微前端场景下，埋点字段至少应包含：

- 主应用版本。
- 子应用名称。
- 子应用版本。
- 当前路由。
- 用户和租户标识。
- 错误来源。

否则问题发生后很难定位是哪一个子应用造成的。

## 部署与跨域

qiankun 子应用常常部署在不同域名或不同端口，因此需要处理跨域。

### 子应用资源允许跨域

子应用服务需要允许主应用域名访问 HTML、JS、CSS 等资源。

常见响应头：

```http
Access-Control-Allow-Origin: https://main.example.com
```

开发环境可以临时允许所有来源，生产环境建议收敛到可信域名。

### publicPath

子应用静态资源路径必须正确。否则主应用加载子应用后，图片、字体、异步 chunk 可能会从主应用域名下请求，导致 404。

常见做法是在子应用入口中动态设置 public path：

```ts
if ((window as any).__POWERED_BY_QIANKUN__) {
  // webpack 场景下常见变量，具体写法以项目构建配置为准。
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

Vite、Rspack 等构建工具需要根据各自机制处理资源基础路径。

### 缓存策略

推荐：

- `index.html` 不强缓存，保证入口能拿到最新资源。
- 带 hash 的 JS/CSS 长缓存。
- 子应用发布后保留上一版本静态资源一段时间，避免主应用或用户缓存引用旧 chunk 时 404。

## 性能优化

微前端会引入额外的运行时加载成本，需要重点关注性能。

### 控制子应用体积

- 子应用按路由拆包。
- 公共依赖不要重复打进每个子应用，或通过外部化、模块联邦、公共 CDN 等策略处理。
- 大型图表、编辑器、地图 SDK 按需加载。

### 合理预加载

根据用户路径和菜单热度预加载，而不是盲目加载所有应用。

### 首屏体验

主应用可以提供统一 loading、骨架屏和子应用加载失败兜底。

```ts
registerMicroApps(
  apps,
  {
    beforeLoad: [
      async (app) => {
        console.log('before load', app.name);
      },
    ],
    afterMount: [
      async (app) => {
        console.log('after mount', app.name);
      },
    ],
  },
);
```

### 依赖共享

依赖共享有几种方式：

- npm 包版本统一。
- monorepo 管理公共包。
- CDN external。
- 模块联邦 shared。

依赖共享能减少体积，但也会增加版本耦合。公共依赖越底层，越适合共享；业务组件越复杂，越要谨慎共享。

## 常见问题

### 子应用单独运行正常，接入主应用白屏

排查顺序：

1. 子应用入口是否可访问。
2. 是否配置跨域。
3. 生命周期是否正确导出。
4. `output.library` 和 `libraryTarget` 是否符合要求。
5. 子应用挂载容器是否能找到。
6. public path 是否导致 chunk 加载 404。
7. 控制台是否有沙箱、路由或资源加载错误。

### 子应用刷新 404

通常是 history 路由没有服务端 fallback。需要让服务器把 `/user/profile` 这类路径回退到主应用入口 HTML，或者改用 hash 路由。

### 样式互相污染

优先检查：

- 是否存在全局标签样式。
- UI 库弹窗是否挂载到 `body`。
- 是否启用样式隔离。
- 子应用样式是否有唯一前缀。
- 主应用是否覆盖了通用类名。

### 子应用卸载后仍然有请求或事件

通常是 `unmount` 没有清理：

- 定时器。
- 轮询请求。
- WebSocket。
- 全局事件监听。
- 第三方库实例。
- 挂载到 `body` 的弹窗或浮层。

### 主子应用依赖版本冲突

qiankun 的应用级集成并不会自动解决依赖冲突。不同子应用理论上可以各自打包自己的依赖，但如果它们都向全局挂载同名变量，仍然可能冲突。

解决思路：

- 避免依赖挂全局变量。
- external 全局依赖时统一版本。
- 子应用独立打包核心依赖。
- 对强共享依赖使用模块联邦或 monorepo 统一管理。

## 架构落地建议

### 先定边界，再选技术

先明确哪些模块需要独立开发、独立部署、独立运行，再决定是否使用 qiankun。不要只因为项目大就拆微前端。

### 主应用保持薄

主应用负责平台能力，不负责子应用业务。主应用越厚，子应用越难独立。

### 通信协议要少而清晰

建议只定义少量全局通信协议：

- 用户信息。
- 权限信息。
- 主题语言。
- 路由跳转。
- 登录退出。
- 全局消息提示。

其他业务通信尽量由后端接口或 URL 承担。

### 子应用要可独立运行

子应用单独运行可以降低开发调试成本，也能避免对主应用产生过度依赖。

### 建立接入模板

团队最好提供子应用模板，内置：

- 生命周期导出。
- public path 处理。
- 路由 base 配置。
- 样式前缀约定。
- 全局通信类型定义。
- 本地调试脚本。
- 构建和部署配置。

### 建立发布规范

微前端不是只改前端代码，还涉及发布流程：

- 子应用版本号。
- 发布顺序。
- 灰度策略。
- 回滚策略。
- 静态资源保留策略。
- 主应用对子应用入口的配置管理。

## 什么时候不适合用微前端

以下场景不一定适合上微前端：

- 项目规模不大，一个团队就能维护。
- 只是想复用几个组件。
- 子模块没有独立发布需求。
- 团队缺少统一工程规范。
- 公共能力还没有抽象清楚。
- 业务边界频繁变化。

如果只是组件复用，优先考虑组件库、monorepo 或模块联邦。如果只是代码拆分，普通路由懒加载可能就够了。

## 小结

qiankun 更适合应用级微前端：它关注主应用如何加载子应用、如何调度生命周期、如何隔离运行环境，以及如何在多个独立应用之间维持统一体验。

模块联邦更适合模块级运行时共享：它关注应用之间如何暴露和消费远程模块，以及如何共享依赖。

真正落地微前端时，最重要的不是 API 怎么写，而是边界怎么划、通信怎么收敛、公共能力怎么沉淀、发布流程怎么治理。技术方案只是骨架，工程规范和团队协作才决定它能不能长期跑下去。

## 参考资料

- [qiankun 官方指南](https://umijs.github.io/qiankun/guide/)
- [qiankun API 文档](https://umijs.github.io/qiankun/api)
- [single-spa 官方文档](https://single-spa.js.org/)
- [webpack Module Federation 文档](https://webpack.js.org/concepts/module-federation/)
- [MDN BroadcastChannel](https://developer.mozilla.org/docs/Web/API/BroadcastChannel)
- [MDN Window.postMessage](https://developer.mozilla.org/docs/Web/API/Window/postMessage)
