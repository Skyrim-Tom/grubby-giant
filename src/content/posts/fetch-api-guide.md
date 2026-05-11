---
title: "还在用Ajax？不如试试Fetch"
description: "Fetch API 详解，包括基本用法、与 AJAX 的区别以及封装方法"
pubDate: 2020-04-15
category: "技术教程"
tags: ["JavaScript", "Fetch", "网络请求", "异步编程"]
readTime: "6 分钟"
featured: false
---

# 还在用Ajax？不如试试Fetch

> 文章参考自[anna\_0707的简书文章](https://www.jianshu.com/p/7762515f8d1a "anna_0707的简书文章") [MDN 使用Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch "MDN 使用Fetch")

#### Fetch的特点

1. 第一个参数是URL；
2. 第二个是可选参数，可以控制不同配置的 init 对象；
3. 使用了 **JavaScript Promises** 来处理结果/回调。

```javascript
fetch(url).then(response => response.json())
  .then(data => console.log(data))
  .catch(e => console.log("Oops, error", e))
```

甚至，你也可以通过Request构造器函数创建一个新的请求对象，你还可以基于原有的对象创建一个新的对象。 新的请求和旧的并没有什么不同，但你可以通过稍微调整配置对象，将其用于不同的场景。例如：

```javascript
var req = new Request(URL, {method: 'GET', cache: 'reload'});
fetch(req).then(function(response) {
  return response.json();
}).then(function(json) {
  insertPhotos(json); //上传图片
});
```

上面的代码中我们指明了请求使用的方法为GET，并且指定不缓存响应的结果，你可以基于原有的GET请求创建一个POST请求，它们具有相同的请求源。代码如下：

```javascript
// 基于req对象创建新的postReq对象
var postReq = new Request(req, {method: 'POST'});
```

#### Fetch和Ajax的区别

1. 当接收到一个代表错误的 HTTP 状态码时，从 `fetch()` 返回的 Promise **不会被标记为 reject**， 即使响应的 HTTP 状态码是 404 或 500。相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false ），仅当网络故障时或请求被阻止时，才会标记为 reject。
2. 在默认情况下 `fetch()` 不会接受或者发送cookies，默认情况下，你也不能使用 `fetch()` 建立起跨域会话。

#### Fetch的封装

```javascript
export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
    type = type.toUpperCase();
    url = baseUrl + url;

    if (type == 'GET') {
        let dataStr = ''; //数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        })

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    if (window.fetch && method == 'fetch') {
        let requestConfig = {
            credentials: 'include',//为了在当前域名内自动发送 cookie ， 必须提供这个选项
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: "cors",//请求的模式
            cache: "force-cache"
        }

        if (type == 'POST') {
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }
        
        try {
            const response = await fetch(url, requestConfig);
            const responseJson = await response.json();
            return responseJson
        } catch (error) {
            throw new Error(error)
        }
    } else {
        return new Promise((resolve, reject) => {
            let requestObj;
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                requestObj = new ActiveXObject;
            }

            let sendData = '';
            if (type == 'POST') {
                sendData = JSON.stringify(data);
            }

            requestObj.open(type, url, true);
            requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState == 4) {
                    if (requestObj.status == 200) {
                        let obj = requestObj.response
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj)
                    } else {
                        reject(requestObj)
                    }
                }
            }
        })
    }
}
```
