---
title: "纯原生JavaScript封装AJAX请求"
description: "纯原生 JavaScript 封装 AJAX 请求方法，支持 GET 和 POST 请求"
pubDate: 2020-04-14
category: "技术教程"
tags: ["JavaScript", "AJAX", "网络请求", "原生JS"]
readTime: "4 分钟"
featured: false
---

# 纯原生JavaScript封装AJAX请求

业务中可以需要直接使用原生的JavaScript进行网络请求，这个时候可以简单封装一个AJAX方法：

#### 调用方法

```javascript
 ajax({
   method: 'post',
   url: 'user-center/app/shop/follow',
   data: {
     access_token: 0000000,
     shop_id: 0000000
   },
   success: function(response) {
     console.log(response);
   }
 });
```

#### 封装方法

```javascript
function ajax(opt) {
  opt = opt || {};
  opt.method = opt.method.toUpperCase() || 'POST';
  opt.url = opt.url || '';
  opt.async = opt.async || true;
  opt.data = opt.data || null;
  opt.success = opt.success || function() {};
  var xmlHttp = null;
  if (XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  var params = [];
  for (var key in opt.data) {
    params.push(key + ':' + opt.data[key]);
  }
  var postData = params.join('&');
  console.log(postData);
  if (opt.method.toUpperCase() === 'POST') {
    xmlHttp.open(opt.method, opt.url, opt.async);
    //设置请求头
    xmlHttp.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.setRequestHeader('Cache-Control', 'private');
    xmlHttp.send(JSON.stringify(opt.data));
  } else if (opt.method.toUpperCase() === 'GET') {
    xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
    xmlHttp.send(null);
  }
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      opt.success(xmlHttp.responseText);
    }
  };
}
```

感谢观看。
