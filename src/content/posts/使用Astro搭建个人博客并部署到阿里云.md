---
title: "使用 Astro 搭建个人博客并部署到阿里云"
description: "从零开始，详细介绍如何使用 Astro 框架搭建一个高性能的静态博客网站，包括项目初始化、页面创建、GitHub Actions 自动化部署到阿里云服务器的完整流程。"
pubDate: 2026-03-18
category: "技术教程"
tags: ["Astro", "GitHub Actions", "阿里云", "部署", "静态网站"]
readTime: "10 分钟"
featured: true
---

## 前言

在这篇文章中，我将详细介绍如何使用 **Astro** 框架从零开始搭建一个高性能的静态博客网站，并通过 **GitHub Actions** 自动化部署到 **阿里云**服务器。

## 什么是 Astro？

Astro 是一个现代化的静态网站生成器，它的特点是：

- **零 JavaScript 默认**：页面默认不加载 JavaScript，加载速度极快
- **Islands 架构**：只在需要的地方加载 JavaScript
- **支持多种框架**：可以在同一个项目中使用 React、Vue、Svelte 等多种前端框架
- **优秀的开发体验**：支持 TypeScript、热更新等现代开发特性

## 项目初始化

### 1. 创建 Astro 项目

首先确保你已经安装了 Node.js（建议版本 >= 22.12.0），然后使用以下命令创建项目：

```bash
# 使用 npm
npm create astro@latest

# 或使用 pnpm
pnpm create astro@latest
```

按照提示选择：
- 项目名称：`my-blog`
- 模板：选择 "A few best practices"（推荐）
- TypeScript：选择 "Strict" 或 "Strictest"
- 安装依赖：选择 "Yes"

### 2. 项目结构

创建完成后，项目结构如下：

```
my-blog/
├── src/
│   ├── components/     # 组件目录
│   ├── layouts/        # 布局文件
│   ├── pages/          # 页面文件
│   └── assets/         # 静态资源
├── public/             # 公共静态资源
├── astro.config.mjs    # Astro 配置文件
├── package.json
└── tsconfig.json
```

### 3. 安装 Vue 集成（可选）

如果你想在项目中使用 Vue 组件，可以安装 Vue 集成：

```bash
npx astro add vue
```

## 创建页面

### 4. 创建首页

修改 `src/pages/index.astro`：

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="首页">
  <h1>欢迎来到我的博客</h1>
  <p>这是我的 Astro 博客首页</p>
</Layout>
```

### 5. 创建关于页面

创建 `src/pages/about.astro`：

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="关于我">
  <h1>关于我</h1>
  <p>这里写一些关于你的介绍...</p>
</Layout>
```

### 6. 创建相册页面

创建 `src/pages/gallery.astro`：

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="相册">
  <h1>我的摄影作品</h1>
  <div class="gallery">
    <!-- 照片展示区域 -->
  </div>
</Layout>
```

## 配置 GitHub Actions 部署

### 7. 创建 GitHub 仓库

1. 在 GitHub 上创建一个新仓库
2. 将本地项目推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M master
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin master
```

### 8. 配置阿里云服务器

在阿里云服务器上：

**创建部署目录：**
```bash
mkdir -p /home/web/my-blog
```

**配置 Nginx：**
编辑 `/etc/nginx/conf.d/my-blog.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /home/web/my-blog/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

**测试并重载 Nginx：**
```bash
nginx -t
systemctl reload nginx
```

**生成 SSH 密钥对：**
```bash
# 在本地生成密钥
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions

# 查看并复制私钥
cat ~/.ssh/github_actions

# 将公钥添加到服务器的 authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
```

### 9. 创建 GitHub Actions 工作流

创建 `.github/workflows/deploy.yml`：

```yaml
name: Build and Deploy to Aliyun

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Aliyun
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.ALIYUN_SSH_KEY }}
          ARGS: "-avzr --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.ALIYUN_HOST }}
          REMOTE_USER: ${{ secrets.ALIYUN_USER }}
          TARGET: "/home/web/my-blog/"
```

### 10. 配置 GitHub Secrets

在 GitHub 仓库的 **Settings -> Secrets and variables -> Actions** 中添加以下 secrets：

| Secret Name | 说明 |
|------------|------|
| `ALIYUN_SSH_KEY` | 阿里云服务器的 SSH 私钥（完整内容） |
| `ALIYUN_HOST` | 服务器 IP 地址 |
| `ALIYUN_USER` | 服务器用户名（如 root） |

**添加私钥的步骤：**
1. 复制私钥文件的全部内容（包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）
2. 在 GitHub Secrets 中新建 secret，名称为 `ALIYUN_SSH_KEY`
3. 将私钥内容粘贴进去

## 测试部署

### 11. 本地测试

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

### 12. 推送到 GitHub 触发部署

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin master
```

推送后，GitHub Actions 会自动运行，构建项目并部署到阿里云服务器。

### 13. 查看部署状态

1. 在 GitHub 仓库页面点击 **Actions** 标签
2. 查看工作流的运行状态
3. 绿色 ✓ 表示部署成功

## 常见问题

### Q1: 部署后页面 404

**解决方案：**
确保 Nginx 配置中添加了 `try_files` 指令，支持前端路由：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Q2: 样式没有生效

**解决方案：**
检查构建输出的 `dist` 目录中是否包含所有资源文件。确保 `astro.config.mjs` 中的 `base` 配置正确。

### Q3: SSH 连接失败

**排查步骤：**
1. 检查服务器的 SSH 端口（默认 22）是否开放
2. 确认私钥格式正确（PEM 格式）
3. 检查服务器上的 `~/.ssh/authorized_keys` 权限：
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

### Q4: 部署后文件没有更新

**解决方案：**
检查 GitHub Actions 日志，确认 `SOURCE` 路径是否正确。Astro 构建输出在 `dist/` 目录。

## 进阶优化

### 启用 HTTPS

使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot
apt install certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d your-domain.com
```

### 配置 CDN

在阿里云控制台：
1. 开通 CDN 服务
2. 添加加速域名
3. 配置源站为你的服务器 IP
4. 修改 DNS 解析到 CDN 提供的 CNAME

### 添加自定义域名

1. 在阿里云购买域名
2. 配置 DNS 解析到你的服务器 IP
3. 修改 Nginx 配置中的 `server_name`

## 总结

通过本文，你已经学会了：

1. ✅ 使用 Astro 创建静态博客项目
2. ✅ 创建多个页面（首页、关于、相册等）
3. ✅ 配置 GitHub Actions 自动化工作流
4. ✅ 将网站部署到阿里云服务器
5. ✅ 配置 Nginx 和 HTTPS

现在你可以开始创作内容，每次推送代码到 master 分支，网站都会自动更新！

## 参考资源

- [Astro 官方文档](https://docs.astro.build/)
- [GitHub Actions 文档](https://docs.github.com/cn/actions)
- [阿里云 ECS 文档](https://help.aliyun.com/ecs)

---

*如果你有任何问题，欢迎在评论区留言交流！*
