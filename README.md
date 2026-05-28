# Grubby Giant / Momoc's Blog

这是一个基于 Astro 构建的个人博客与摄影相册网站，站点内容围绕前端开发、工程实践、摄影作品与生活记录展开。项目采用静态输出方式，适合部署到 Nginx、对象存储、CDN 或其他静态站点托管平台。

线上站点：<https://www.momoc.cn>

## 项目特点

- 使用 Astro 6 构建，默认输出静态站点，页面加载轻量快速。
- 集成 Vue 3 组件，用于导航栏、主题切换、文章卡片、目录、搜索框等交互模块。
- 使用 Astro Content Collections 管理文章与相册内容，Markdown 文件即内容源。
- 支持文章分类、标签、阅读时间、特色文章等元信息。
- 支持摄影相册集合，包含地点、封面图、分类和标签。
- 内置浅色 / 深色主题切换，并针对 Shiki 代码高亮配置了双主题。
- 集成 Algolia DocSearch，方便站内内容检索。
- 包含响应式布局，适配桌面端与移动端。
- 配置 GitHub Actions，可在推送到 `master` 分支后构建并部署到阿里云服务器。

## 技术栈

- [Astro](https://astro.build/)：站点框架与静态构建
- [Vue 3](https://vuejs.org/)：局部交互组件
- [TypeScript](https://www.typescriptlang.org/)：类型支持
- [Shiki](https://shiki.style/)：Markdown 代码块高亮
- [Algolia DocSearch](https://docsearch.algolia.com/)：站内搜索
- [Lucide Vue](https://lucide.dev/)：图标组件

## 目录结构

```text
/
├── public/                  # 静态资源与 favicon
├── src/
│   ├── assets/              # 本地图片、SVG 等资源
│   ├── components/          # Astro / Vue 组件
│   ├── content/
│   │   ├── posts/           # 博客文章 Markdown
│   │   └── gallery/         # 摄影相册 Markdown
│   ├── layouts/             # 页面布局
│   ├── pages/               # 路由页面
│   │   ├── posts/           # 文章列表与详情页
│   │   └── gallery/         # 相册列表与详情页
│   └── content.config.ts    # 内容集合 Schema
├── astro.config.mjs         # Astro 配置
├── package.json             # 脚本与依赖
└── README.md
```

## 本地开发

项目要求 Node.js `>=22.12.0`。推荐使用 pnpm 安装依赖和运行脚本。

```sh
pnpm install
pnpm dev
```

开发服务器默认运行在：

```text
http://localhost:4321
```

## 常用命令

| 命令 | 说明 |
| :--- | :--- |
| `pnpm install` | 安装项目依赖 |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建生产环境静态文件到 `dist/` |
| `pnpm preview` | 本地预览生产构建结果 |
| `pnpm astro ...` | 执行 Astro CLI 命令 |

## 内容管理

### 新增文章

在 `src/content/posts/` 下新增 Markdown 文件。文章 front matter 需要符合 `src/content.config.ts` 中的 `posts` 集合定义：

```yaml
---
title: 文章标题
description: 文章摘要
pubDate: 2026-01-01
updatedDate: 2026-01-02
author: Momoc
category: 前端开发
tags:
  - JavaScript
  - Astro
readTime: 8 分钟
featured: false
---
```

### 新增相册

在 `src/content/gallery/` 下新增 Markdown 文件。相册 front matter 需要包含封面图、地点、分类等信息：

```yaml
---
title: 相册标题
description: 相册摘要
pubDate: 2026-01-01
author: Momoc
category: 旅行
location: 珠海
cover: https://example.com/photo.jpg
coverAlt: 相册封面描述
tags:
  - 摄影
  - 旅行
---
```

## 页面说明

- `/`：首页，展示站点介绍、最新文章和最新摄影作品。
- `/posts`：文章列表页，支持按分类和标签筛选。
- `/posts/[slug]`：文章详情页，渲染 Markdown 正文。
- `/gallery`：摄影相册列表页，支持按分类筛选。
- `/gallery/[slug]`：相册详情页。
- `/about`：个人介绍、技能栈与联系方式。

## 构建与部署

执行生产构建：

```sh
pnpm build
```

构建产物会输出到 `dist/` 目录。当前仓库包含 GitHub Actions 工作流，推送到 `master` 分支时会自动安装依赖、构建项目，并通过 SSH 部署到阿里云服务器的目标目录。

部署前需要确保 GitHub Secrets 中已配置服务器私钥等必要信息。
