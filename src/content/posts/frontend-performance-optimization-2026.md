---
title: "2026 前端性能优化全景指南"
description: "系统梳理 2026 年前端性能优化的主流方法，覆盖包体积管理、首屏加载、Core Web Vitals、INP、虚拟滚动、图片资源、缓存、预渲染、三方脚本和性能监控。"
pubDate: 2026-05-29
category: "技术教程"
tags: ["前端优化", "性能优化", "Core Web Vitals", "首屏加载", "工程化", "虚拟滚动"]
readTime: "32 分钟"
featured: false
---

# 2026 前端性能优化全景指南

前端性能优化已经不再只是“压缩一下 JS、合并一下请求”这么简单。到了 2026 年，一个真实项目的性能瓶颈往往同时来自 **包体积、首屏关键资源、主线程长任务、组件重复渲染、列表数据量、图片与字体、三方脚本、缓存策略、服务端渲染架构和线上监控体系**。

如果只做构建压缩，页面也许能小一点；但如果没有控制 LCP、INP、CLS，没有管理首屏 JS 执行成本，没有处理复杂页面的渲染压力，用户依然会感觉“白屏久、点不动、滚动卡、页面跳”。

本文按照实际项目中的高频场景整理一套 2026 仍然主流且实用的前端性能优化方法，重点覆盖：

- 包体积管理：减少初始 JS、控制依赖、拆包与按需加载
- 首屏加载：围绕 LCP、关键资源优先级、SSR/SSG、流式渲染和骨架屏优化
- 交互响应：围绕 INP、长任务拆分、Web Worker 和组件渲染优化
- 大数据渲染：虚拟滚动、分页、增量渲染和 CSS 渲染隔离
- 资源优化：图片、字体、CSS、缓存、预加载、预渲染和 bfcache
- 工程治理：性能预算、CI 检查、线上 RUM 监控和持续优化机制

## 先明确性能优化目标

性能优化最怕一上来就改代码。成熟的做法应该是先定义指标，再定位瓶颈，最后选择方案。

### 核心指标

| 指标 | 关注点 | 优化目标 |
| --- | --- | --- |
| LCP | 最大内容绘制，代表首屏主体内容何时可见 | 尽量控制在 2.5s 以内 |
| INP | 用户交互到下一次绘制的延迟，代表页面是否“点得动” | 尽量控制在 200ms 以内 |
| CLS | 页面视觉稳定性，代表是否发生布局跳动 | 尽量控制在 0.1 以内 |
| TTFB | 服务端响应首字节时间 | 降低服务端、网络和 CDN 延迟 |
| FCP | 首次内容绘制 | 减少白屏时间 |
| TBT | 总阻塞时间，实验室指标 | 控制主线程长任务 |

2026 年做前端性能优化，建议把 **LCP、INP、CLS** 当作第一优先级。它们更接近用户真实感知，也更适合和业务页面质量挂钩。

### 优化顺序

一个比较稳妥的顺序是：

1. 先看线上数据：哪些页面慢、哪些设备慢、哪些网络慢。
2. 再看加载链路：HTML、CSS、JS、图片、字体、接口是不是阻塞首屏。
3. 再看执行成本：JS 解析、执行、组件渲染、长任务是不是卡住主线程。
4. 最后看局部体验：滚动、输入、弹窗、表格、列表、图表是不是有明显卡顿。

性能优化不是把所有技巧都堆上去，而是把瓶颈最明显的那一段链路缩短。

## 包体积管理

前端项目越做越大，包体积往往是第一个失控点。尤其是后台系统、低代码平台、可视化大屏、编辑器、国际化站点，常常会把 UI 库、图表库、富文本、日期库、工具库、SDK 一股脑打进首屏。

包体积管理的核心目标不是“最终产物越碎越好”，而是 **首屏必须下载和执行的 JS 越少越好**。

### 建立包体积预算

建议在项目中明确几类预算：

| 资源 | 建议治理方式 |
| --- | --- |
| 首屏 JS | 重点控制，超过阈值需要解释原因 |
| 单个异步 chunk | 避免过大，尤其是路由级 chunk |
| CSS | 移除未使用样式，避免整库样式全量进入 |
| 图片 | 控制首屏图片数量、格式和尺寸 |
| 三方脚本 | 单独统计，不和业务代码混在一起 |

预算不一定一开始就非常严格，但必须可见。比如在 CI 中输出 bundle report，或者用 `size-limit`、`bundlesize`、Lighthouse CI、webpack-bundle-analyzer、rollup-plugin-visualizer 之类的工具持续观察变化。

### 做好依赖治理

依赖治理要关注三个问题：

1. 这个依赖是不是必须进首屏？
2. 这个依赖是否支持 Tree Shaking？
3. 有没有更轻量或原生 API 替代？

常见例子：

- 日期处理不要因为一个格式化函数引入完整大库。
- 图标不要整包引入，优先使用按需导入。
- 工具函数优先使用 ESM 版本，避免引入 CommonJS 导致 Tree Shaking 失效。
- 后台管理系统的图表、富文本、Excel 导出、PDF 预览等功能应尽量放到异步路由或异步组件中。

### 路由级拆包与功能级拆包

现代构建工具通常都支持动态导入：

```ts
const UserSettings = () => import('./pages/UserSettings.vue')
const ChartPanel = () => import('./components/ChartPanel.vue')
```

拆包时要注意：

- 首屏路由保留必要代码，非首屏路由异步加载。
- 重型组件按交互触发加载，比如富文本编辑器、图表、地图、视频播放器。
- 不要为了拆包而制造过多小 chunk，否则会增加调度和请求成本。
- 公共 chunk 需要观察真实复用情况，避免把大量低频代码抽到公共包里。

Vite 在构建阶段会自动处理 CSS Code Splitting、`modulepreload` 和异步 chunk 的加载优化，但项目仍然需要自己决定哪些功能应该被拆开。

### 避免“假按需”

有些项目看起来使用了按需导入，实际仍然把全量样式或全量运行时代码打进了包里。排查时要重点看：

- UI 组件库是否配置了按需组件和按需样式。
- 图标库是否按图标粒度引入。
- 国际化语言包是否只加载当前语言。
- Monaco Editor、ECharts、AntV、Map SDK 是否延迟加载。
- polyfill 是否只面向目标浏览器生成，而不是全量兼容所有旧环境。

### 删除无效代码

包体积优化里最容易被忽略的是删除代码：

- 删除废弃页面和废弃路由。
- 删除未使用组件、hooks、utils、mock 数据。
- 删除重复封装的工具函数。
- 删除历史兼容逻辑和已经下线的 AB 实验分支。

真实项目里，删除无效代码往往比换压缩工具更有效。

## 首屏加载优化

首屏优化的目标是让用户尽快看到“有意义的主内容”，也就是优化 LCP 和白屏时间。

### 识别 LCP 元素

先用 Chrome DevTools、Lighthouse 或线上 RUM 数据确认 LCP 元素是什么。常见 LCP 元素包括：

- 首页 Banner 图
- 商品主图
- 文章标题或正文首段
- 看板中的核心卡片
- 搜索结果或列表第一屏

不同 LCP 元素对应不同优化策略。如果 LCP 是图片，就优化图片发现时机、格式、尺寸和优先级；如果 LCP 是文本，就优化 HTML 输出、CSS 阻塞和字体加载；如果 LCP 是接口数据渲染结果，就优化接口、SSR、缓存和首屏数据获取。

### 减少首屏关键路径

首屏关键路径可以简单理解为：

```text
HTML -> CSS -> JS -> 数据 -> 渲染 -> LCP
```

优化方向包括：

- HTML 尽早返回，降低 TTFB。
- 关键 CSS 尽早加载，非关键 CSS 延后。
- 首屏 JS 尽量少，避免大包阻塞解析和执行。
- 首屏接口并行请求，避免串行瀑布流。
- LCP 图片在 HTML 中尽早出现，不要等 JS 执行后才插入。
- 骨架屏只解决等待感，不能代替真实内容加载。

### 提高关键资源优先级

对于首屏关键图片，可以使用 `fetchpriority="high"`：

```html
<img
  src="/images/product-cover.avif"
  width="1200"
  height="675"
  alt="商品主图"
  fetchpriority="high"
>
```

如果 LCP 图片不是直接出现在初始 HTML 中，例如 CSS 背景图或客户端渲染后才出现的图片，可以考虑预加载：

```html
<link
  rel="preload"
  as="image"
  href="/images/hero.avif"
  fetchpriority="high"
>
```

响应式图片也可以结合 `imagesrcset`：

```html
<link
  rel="preload"
  as="image"
  imagesrcset="/hero-640.avif 640w, /hero-1280.avif 1280w"
  imagesizes="100vw"
  href="/hero-1280.avif"
  fetchpriority="high"
>
```

注意：不要给大量资源都设置高优先级。优先级是相对概念，滥用会让真正关键的资源失去优势。

### SSR、SSG、ISR 和流式渲染

对于首屏依赖内容的页面，纯 CSR 往往会经历：

```text
下载 JS -> 执行 JS -> 请求接口 -> 渲染内容
```

这会拉长 LCP。可选方案包括：

- **SSR**：服务端直接输出首屏 HTML，适合动态内容、SEO 要求高的页面。
- **SSG**：构建时生成静态 HTML，适合博客、文档、营销页。
- **ISR/增量静态生成**：静态页面按需再生成，适合内容更新频率中等的站点。
- **流式渲染**：先返回页面壳和关键内容，再逐步补齐低优先级内容。
- **React Server Components / Server Actions**：减少客户端 JS 和数据获取胶水代码，适合 React 技术栈中复杂页面。

并不是所有页面都要 SSR。后台系统、强登录系统、重交互编辑器可能更适合 CSR + 局部优化；内容型页面、商品详情、落地页则更适合 SSR/SSG。

### 首屏数据请求优化

首屏慢经常不是静态资源慢，而是接口慢。优化方式包括：

- 合并首屏必要接口，减少串行等待。
- 接口并行化，避免 A 请求完成后才发 B。
- 服务端聚合数据，减少浏览器端编排成本。
- 首屏只返回必要字段，详情字段延后加载。
- CDN、边缘缓存或服务端缓存高频数据。
- 对低频变化数据使用 stale-while-revalidate 思路，先展示缓存再后台更新。

### 骨架屏和渐进展示

骨架屏适合缓解等待感，但要避免两个问题：

- 骨架屏结构和真实内容差异太大，导致 CLS。
- 骨架屏展示很快，但真实内容很久才出现，掩盖不了性能问题。

更好的方式是渐进展示：

- 首屏核心信息优先展示。
- 次要模块延后加载。
- 非首屏内容进入视口附近再加载。
- 图表、推荐、评论、广告等低优先级模块不阻塞主体内容。

## INP 与交互响应优化

INP 关注的是用户交互之后，页面多久能完成下一次绘制。它比过去的 FID 更严格，因为它观察整个页面生命周期中的交互延迟，而不是只看第一次输入。

INP 差通常有几个原因：

- 主线程被长任务占满。
- 点击事件里做了大量同步计算。
- 状态更新触发了大范围组件重渲染。
- DOM 太大，布局和绘制成本高。
- 三方脚本抢占主线程。

### 拆分长任务

浏览器主线程上超过 50ms 的任务通常会影响响应。常见长任务包括：

- 大量 JS 初始化
- 大量 JSON 解析
- 复杂表格计算
- 富文本/图表初始化
- 一次性渲染大量 DOM
- 循环中同步读写布局

可以通过 `scheduler.yield()` 或降级方案把大任务拆开：

```ts
async function processLargeList(list: Item[]) {
  const result: Result[] = []

  for (let i = 0; i < list.length; i++) {
    result.push(expensiveTransform(list[i]))

    if (i % 100 === 0 && 'scheduler' in window && 'yield' in scheduler) {
      await scheduler.yield()
    }
  }

  return result
}
```

对于兼容性要求更高的项目，可以使用 `setTimeout`、`requestIdleCallback` 或调度库做降级。但思路是一致的：不要让一个大任务长时间霸占主线程。

### 避免输入事件里做重活

用户输入、点击、拖拽、滚动时，事件处理函数应该尽量短：

```ts
function handleInput(value: string) {
  keyword.value = value
  scheduleSearch(value)
}
```

复杂逻辑可以放到：

- 防抖后的异步请求
- Web Worker
- 空闲时间任务
- 服务端计算
- 缓存命中后的增量更新

### 用 Web Worker 转移计算

适合放到 Worker 的任务包括：

- 大 JSON 解析和转换
- Excel/CSV 处理
- 图片压缩
- 数据聚合
- 图表数据预计算
- 搜索索引构建

Worker 不能直接操作 DOM，所以它适合处理纯计算和数据转换。对于大数据后台系统，这是非常值得投入的优化方向。

### 控制组件重渲染

React、Vue、Svelte 等框架的优化方式不同，但底层目标类似：让状态变化影响尽可能小的视图范围。

通用建议：

- 不要把局部状态提升到全局。
- 不要让一个大组件承担太多状态。
- 列表项组件保持稳定 key。
- 避免在模板或 render 中创建大量新对象、新函数。
- 对重型组件做懒加载和局部 memo。
- 表格、图表、编辑器组件隔离渲染边界。

React 技术栈还需要关注 React Compiler。它会在构建阶段自动优化组件和值的 memoization，减少手写 `memo`、`useMemo`、`useCallback` 的必要性。但这不代表可以不做架构治理：状态边界、组件拆分、数据结构稳定性仍然很重要。

## 虚拟滚动与大数据渲染

虚拟滚动是性能优化中的高频场景，适合处理大列表、大表格、日志流、聊天记录、订单列表、权限树、文件列表等。

### 为什么需要虚拟滚动

浏览器渲染一万个 DOM 节点时，成本不仅是创建 DOM，还包括：

- 样式计算
- 布局计算
- 绘制
- 合成
- 事件绑定
- 内存占用
- 后续更新时的 diff 成本

虚拟滚动的核心思想是：**数据可以很多，但 DOM 只渲染视口附近的一小段**。

```text
总数据：100000 条
真实 DOM：可视区域 30 条 + 上下缓冲 20 条
滚动时：根据 scrollTop 换算应该显示的数据区间
```

### 固定高度虚拟列表

固定高度列表最简单，公式如下：

```ts
const itemHeight = 40
const visibleCount = Math.ceil(containerHeight / itemHeight)
const start = Math.floor(scrollTop / itemHeight)
const end = start + visibleCount + overscan
const offsetTop = start * itemHeight
```

渲染结构通常是：

```html
<div class="viewport">
  <div class="phantom" style="height: 4000000px;">
    <div class="list" style="transform: translateY(12000px);">
      <!-- 只渲染可视区附近的数据 -->
    </div>
  </div>
</div>
```

固定高度适合：

- 日志列表
- 简单表格
- 通知列表
- 商品卡片高度一致的场景

### 动态高度虚拟列表

动态高度更复杂，因为无法通过简单公式计算位置。常见方案：

- 初始用预估高度。
- 渲染后测量真实高度。
- 建立 item index 到 height、offset 的缓存。
- 滚动时通过二分查找定位 start index。
- 高度变化时更新后续 offset。

动态高度适合聊天消息、评论流、富文本卡片，但实现成本更高。项目中优先使用成熟库，例如：

- React：`react-window`、`react-virtualized`、`@tanstack/react-virtual`
- Vue：`vue-virtual-scroller`、`@tanstack/vue-virtual`

### 表格虚拟滚动

表格虚拟滚动比普通列表更容易踩坑，因为还涉及：

- 固定表头
- 固定列
- 横向滚动
- 单元格合并
- 展开行
- 行选择
- 树形数据
- 动态行高

建议优先使用成熟表格组件自带的虚拟滚动能力。自己实现时，要把“数据层”和“渲染层”拆开，不要把排序、筛选、分页、列宽计算和 DOM 渲染全部绑在一个组件里。

### 虚拟滚动的注意事项

虚拟滚动不是万能解。它会带来一些额外复杂度：

- 浏览器原生查找只查当前 DOM，无法搜索未渲染内容。
- 锚点定位、滚动恢复、无障碍语义需要额外处理。
- 动态高度会造成滚动条抖动。
- overscan 太小会白屏，太大会失去优化意义。
- SEO 页面不适合只用虚拟滚动展示核心内容。

如果数据量只有几十条或一两百条，普通分页可能比虚拟滚动更简单、更稳定。

## 图片、字体与静态资源优化

图片通常是页面带宽大户，也经常是 LCP 元素。

### 图片格式选择

| 场景 | 推荐 |
| --- | --- |
| 照片、商品图、Banner | AVIF / WebP，保留 JPEG 兜底 |
| 图标、简单图形 | SVG |
| 透明图 | WebP / PNG |
| 动图 | 视频格式或动画 WebP，谨慎使用 GIF |

图片优化要点：

- 不要上传远大于展示尺寸的图片。
- 使用 `srcset` 和 `sizes` 输出响应式图片。
- 首屏图不要懒加载。
- 非首屏图片使用 `loading="lazy"`。
- 始终设置 `width` 和 `height`，减少 CLS。

```html
<img
  src="/cover-800.avif"
  srcset="/cover-400.avif 400w, /cover-800.avif 800w, /cover-1200.avif 1200w"
  sizes="(max-width: 768px) 100vw, 800px"
  width="800"
  height="450"
  loading="lazy"
  alt="文章封面"
>
```

### iframe 懒加载

视频、地图、评论插件、广告 iframe 会带来大量三方资源。非首屏 iframe 应该使用：

```html
<iframe
  src="https://example.com/embed"
  loading="lazy"
  width="600"
  height="400"
  title="嵌入内容"
></iframe>
```

### 字体优化

字体容易导致 FOIT、FOUT 和 CLS。建议：

- 使用 `font-display: swap` 或 `optional`。
- 中文字体尽量避免全量 Web Font。
- 字体文件按字符子集拆分。
- 关键字体可以 preload，但不要滥用。
- 使用系统字体栈能满足设计时优先使用系统字体。

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-latin.woff2") format("woff2");
  font-display: swap;
}
```

## CSS 与渲染性能优化

CSS 不只是样式问题，也会影响渲染性能。

### 使用 content-visibility

对于长页面中大量首屏外内容，可以使用 `content-visibility: auto` 让浏览器跳过离屏内容的渲染工作：

```css
.below-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: 800px;
}
```

适合场景：

- 长文章
- 商品详情长页面
- 多模块落地页
- 带大量卡片的内容流

注意设置合理的 `contain-intrinsic-size`，否则可能引发布局跳动。

### 避免布局抖动

常见 CLS 来源：

- 图片没有宽高。
- 广告位没有预留空间。
- 字体加载后尺寸变化。
- 异步插入顶部内容。
- 骨架屏和真实内容尺寸不一致。
- 动画改变 `width`、`height`、`top`、`left`。

动画优先使用 `transform` 和 `opacity`，避免频繁触发布局。

### 减少样式计算范围

建议：

- 避免过深、过复杂的选择器。
- 不要频繁切换影响大范围布局的 class。
- 大模块之间使用 CSS Containment 隔离影响范围。
- 对复杂列表和卡片流考虑 `contain` 或 `content-visibility`。

## 缓存、预加载与下一页加速

缓存和预加载优化的是“重复访问”和“下一次访问”。

### HTTP 缓存

常见策略：

| 资源 | 缓存策略 |
| --- | --- |
| 带 hash 的 JS/CSS | 长缓存，`max-age=31536000, immutable` |
| HTML | 短缓存或协商缓存 |
| 接口数据 | 按业务时效设置缓存 |
| 图片字体 | 长缓存，文件名变更时更新 |

构建产物文件名带 hash 是长缓存的前提。否则用户可能一直拿到旧资源。

### Service Worker

Service Worker 适合：

- PWA 离线访问
- 静态资源缓存
- 弱网兜底
- 后台同步
- 资源预缓存

但它也会增加缓存失效复杂度。后台管理系统或频繁发版系统要谨慎使用，避免用户长期卡在旧版本。

### bfcache

bfcache 是浏览器的前进/后退缓存，可以让用户点击返回或前进时几乎瞬间恢复页面。它不同于 HTTP 缓存，保存的是整个页面快照，包括 JS 堆。

优化建议：

- 避免使用 `unload` 事件，改用 `pagehide`。
- 谨慎设置 `Cache-Control: no-store`。
- 页面恢复时用 `pageshow` 判断是否来自 bfcache。
- 在恢复后刷新敏感或易变数据。

```ts
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    refreshPageState()
  }
})
```

### Speculation Rules

Speculation Rules API 是近几年非常值得关注的页面导航优化能力。它可以告诉浏览器哪些页面可能会被访问，从而提前 prefetch 或 prerender。

简单示例：

```html
<script type="speculationrules">
{
  "prefetch": [
    {
      "where": {
        "href_matches": "/docs/*"
      },
      "eagerness": "moderate"
    }
  ]
}
</script>
```

更激进的方式是 prerender：

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "where": {
        "href_matches": "/product/*"
      },
      "eagerness": "conservative"
    }
  ]
}
</script>
```

使用时要注意：

- 不要预取会改变状态的 GET 页面，例如 `/logout`。
- 先从 prefetch 开始，再评估 prerender。
- 对登录态、隐私页面、成本高页面要谨慎。
- SPA 内部软路由不能直接靠 Speculation Rules 完成路由预渲染，但可以在进入 SPA 前预渲染应用壳。

## 三方脚本优化

三方脚本是很多页面性能问题的黑盒来源。广告、统计、客服、热力图、A/B 实验、监控 SDK 都可能抢占主线程。

治理建议：

- 建立三方脚本清单，明确负责人和业务价值。
- 首屏不必要的三方脚本延后加载。
- 使用 `async` 或 `defer`，避免阻塞 HTML 解析。
- 对低优先级脚本使用交互后加载或空闲时间加载。
- 定期审查重复 SDK，比如多个监控、多个埋点、多个客服组件。
- 对广告和 iframe 预留尺寸，避免 CLS。

```html
<script src="https://example.com/analytics.js" defer></script>
```

如果三方脚本严重影响 INP，可以考虑：

- 延后初始化。
- 只在需要的页面加载。
- 使用 Worker 化方案。
- 替换供应商。
- 通过服务端转发减少客户端 SDK。

## 框架层面的优化思路

### React

React 项目重点关注：

- 使用 React DevTools Profiler 找到重复渲染组件。
- 合理使用 `memo`、`useMemo`、`useCallback`，但不要滥用。
- 关注 React Compiler，减少手写 memoization 的维护成本。
- 使用 Suspense、lazy、Server Components 拆分客户端负担。
- 避免全局状态变化导致整棵树重渲染。
- 大列表使用虚拟滚动。

### Vue

Vue 项目重点关注：

- 使用 `defineAsyncComponent` 做异步组件。
- 使用路由懒加载。
- 大对象避免不必要的深层响应式，必要时用 `shallowRef`、`markRaw`。
- 列表保持稳定 key。
- 对大列表使用虚拟滚动。
- 避免在模板中执行复杂计算，使用 computed 或预处理。

```ts
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
```

### Astro / Islands Architecture

Astro 这类 Islands Architecture 的思路非常适合内容站点：

- 默认输出静态 HTML。
- 只有需要交互的组件才加载 JS。
- 可以按组件选择 `client:load`、`client:idle`、`client:visible` 等激活策略。

这类架构的优势是减少客户端 JS，非常适合博客、文档、营销页和内容型网站。

## 工程化与持续监控

性能优化不能只靠一次专项。真正有效的是持续治理。

### 实验室监控

适合开发和 CI 阶段：

- Lighthouse
- WebPageTest
- Chrome DevTools Performance
- Lighthouse CI
- Bundle Analyzer

实验室数据可复现，适合定位问题，但它不等于真实用户体验。

### 真实用户监控

线上应该采集 RUM 数据：

- LCP
- INP
- CLS
- TTFB
- FCP
- 路由切换耗时
- 接口耗时
- 静态资源加载失败率
- JS 错误和 Promise rejection
- 设备、网络、地区、浏览器维度

采集时建议按页面、设备、网络、版本分组。不要只看平均值，更应该看 P75、P90、P95。

### 性能预算进入 CI

建议在 CI 中至少做几件事：

- 检查首屏 bundle 是否超预算。
- 输出构建产物体积变化。
- 对关键页面跑 Lighthouse CI。
- 对 PR 标记性能风险。
- 对新增三方依赖进行审查。

性能优化一旦进入工程流程，就不会完全依赖个人经验。

## 场景化优化清单

### 包体积过大

- 用分析工具找出最大依赖。
- 检查是否误引入全量库。
- 路由级拆包。
- 重型组件交互后加载。
- 移除无效代码。
- 限制 polyfill 范围。
- 对三方 SDK 单独统计。

### 首屏加载慢

- 定位 LCP 元素。
- 优化 TTFB。
- 减少首屏 JS。
- 关键 CSS 前置，非关键资源延后。
- LCP 图片 preload 或设置 fetch priority。
- 首屏接口并行化。
- 内容型页面考虑 SSR/SSG。

### 页面点不动

- 用 Performance 面板找长任务。
- 拆分同步计算。
- 事件处理函数保持轻量。
- 大计算放 Worker。
- 减少组件重复渲染。
- 延后低优先级三方脚本。

### 列表滚动卡

- 使用虚拟滚动。
- 降低单行组件复杂度。
- 避免滚动时同步读写布局。
- 图片懒加载并固定尺寸。
- 合理设置 overscan。
- 表格优先使用成熟组件方案。

### 页面布局跳动

- 图片、视频、iframe 固定宽高。
- 广告位预留空间。
- 字体使用 `font-display`。
- 骨架屏尺寸贴近真实内容。
- 不在顶部异步插入未预留内容。

### 返回页面仍然很慢

- 检查 bfcache 是否命中。
- 移除 `unload` 监听。
- 谨慎使用 `no-store`。
- 用 `pageshow` 恢复数据。
- 对下一页使用 Speculation Rules 预取。

## 常见误区

### 误区一：请求越少越好

HTTP/2 和 HTTP/3 下，请求数量不是唯一问题。更重要的是关键资源优先级、资源大小、是否阻塞渲染和主线程执行成本。盲目合并所有资源，可能反而让首屏必须下载一个更大的包。

### 误区二：所有图片都懒加载

首屏图片，尤其是 LCP 图片，不应该懒加载。首屏图需要尽早被浏览器发现并下载。

### 误区三：骨架屏等于性能优化

骨架屏只是体验缓冲。真正的优化仍然是减少真实内容出现的时间。

### 误区四：memo 越多越快

memoization 有成本。如果 props 每次都变化，`memo` 可能没有收益，还会增加代码复杂度。先用 Profiler 定位，再优化。

### 误区五：虚拟滚动适合所有列表

小列表用虚拟滚动会增加复杂度。虚拟滚动适合大量 DOM 或复杂单元格场景，不适合所有列表。

## 一套可落地的优化流程

可以把性能优化沉淀为团队流程：

1. 建立指标：LCP、INP、CLS、资源体积、接口耗时。
2. 建立监控：实验室数据 + 线上 RUM 数据。
3. 找出重点页面：流量高、转化关键、投诉多的页面优先。
4. 定位瓶颈：网络、资源、主线程、接口、渲染分别排查。
5. 制定方案：只处理真正影响指标和体验的问题。
6. 灰度验证：对比优化前后的 P75/P90 数据。
7. 固化规则：性能预算、CI 检查、依赖审查、代码规范。

## 小结

2026 年的前端性能优化更像一项系统工程。包体积管理决定页面需要下载和执行多少东西，首屏加载决定用户多久看到主体内容，INP 决定页面是否真正可交互，虚拟滚动和渲染隔离决定复杂业务页面能不能稳定运行。

真正有效的优化，不是把所有技巧都用上，而是基于指标找到瓶颈，然后在架构、工程、资源、渲染和监控层面持续治理。前端性能做得好，用户感知是“页面很轻、反馈很快、操作不断”；工程团队感知是“问题可定位、变化可监控、优化可持续”。

## 参考资料

- [web.dev: Optimize Interaction to Next Paint](https://web.dev/articles/optimize-inp)
- [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)
- [web.dev: Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp)
- [web.dev: Optimize resource loading with the Fetch Priority API](https://web.dev/articles/fetch-priority)
- [web.dev: Preload responsive images](https://web.dev/articles/preload-responsive-images)
- [web.dev: Browser-level image lazy loading for the web](https://web.dev/articles/lazy-loading)
- [web.dev: Back/forward cache](https://web.dev/articles/bfcache)
- [web.dev: content-visibility](https://web.dev/content-visibility)
- [Chrome Developers: Prerender pages in Chrome for instant page navigations](https://developer.chrome.com/docs/web-platform/prerender-pages)
- [Chrome Developers: Guide to implementing speculation rules for more complex sites](https://developer.chrome.com/docs/web-platform/implementing-speculation-rules)
- [Vite: Build Optimizations](https://vite.dev/guide/features.html)
- [React: React Compiler Introduction](https://react.dev/learn/react-compiler/introduction)
- [React: memo API Reference](https://react.dev/reference/react/memo)
