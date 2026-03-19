---
title: "Express Router Guide"
description: "Express 路由对象的常用知识点整理，包括基本用法、router.param、路由连用和正则匹配等"
pubDate: 2020-04-02
category: "技术教程"
tags: ["Node.js", "Express", "后端开发"]
readTime: "5 分钟"
featured: false
---

# Express知识点摘抄

#### Express Router 对象

```javascript
let router = express.Router({
  mergeParams: true, //导入父级参数到子级配置
  caseSensitive: true, //区分大小写配置
  strict: true, //路径严格模式配置 启动严格模式后 /test 和 /test/ 是不同路径
})
```

#### 基本用法

**index.js**

```javascript
app.user('/admin', require('./routers/admin')) // 引入路由文件
```

**admin.js**

```javascript
const express = reqire('express');
const router = express.Router(); // 引入router

router.get('/user', function(req, res, next) {
  //...
})
module.exports = router // 导出路由
```

#### router.param

单独监听参数，然后处理

```javascript
router.param('id', function(req, res, next, value){
  //... // id就是value
})
```

等同于下面的param的id

```javascript
router.get('.user/:id', function(req, res){
  //...
})
```

#### router连用

```javascript
const express = reqire('express');
const router = express.Router(); // 引入router

router.router('/test')
    .get(function(req, res, next) {
      //...
    })
    .get(function(req, res, next) {
      //...
    })
    .post(function(req, res, next) {
      //...
    })
```

#### 路由的正则匹配

```javascript
// ? 有或没有
router.get('.user/abc?d', function(req, res){
  //...
})
// + 一或多次
router.get('.user/abc+d', function(req, res){
  //...
})
// * 无或任意字符
router.get('.user/ab\*d', function(req, res){
  //...
})
// (bc) 优先级运算符
router.get('.user/a(bc)?d', function(req, res){
  //...
})
// 完全用正则
router.get(/\/user[1,2]\/abcd/, function(req, res){
  //...
})
```
