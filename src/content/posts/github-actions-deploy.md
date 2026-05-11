---
title: "GitHub Actions 自动化部署实战"
description: "深入了解 GitHub Actions 的工作原理，学习如何配置工作流实现代码推送到主分支后自动构建并部署到服务器。"
pubDate: 2026-03-15
category: "DevOps"
tags: ["GitHub Actions", "CI/CD", "自动化部署"]
readTime: "8 分钟"
featured: false
---

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的持续集成和持续部署（CI/CD）平台，可以自动化构建、测试和部署流程。

## 核心概念

- **Workflow（工作流）**：自动化的过程定义
- **Job（任务）**：工作流中的执行单元
- **Step（步骤）**：任务中的具体执行步骤
- **Action（动作）**：可复用的自动化单元

## 基础配置示例

```yaml
name: CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run a one-line script
      run: echo Hello, world!
```

## 高级用法

### 条件执行

```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: echo "Deploying..."
```

### 矩阵构建

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
```

## 实战：部署到阿里云

在 Astro 博客项目中，我们可以配置 GitHub Actions 来自动部署到阿里云服务器：

```yaml
name: Deploy to Aliyun

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.ALIYUN_SSH_KEY }}
          ARGS: "-avzr --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.ALIYUN_HOST }}
          REMOTE_USER: ${{ secrets.ALIYUN_USER }}
          TARGET: "/home/web/blog/"
```

## 总结

通过 GitHub Actions，我们可以实现从代码提交到自动部署的完整流程，大大提高开发效率。
