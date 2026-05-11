---
title: "浅谈前端Web性能优化"
description: "前端 Web 性能优化全面指南，涵盖 HTTP 请求优化、SEO、SPA 首屏加载、SSR 等技术方案"
pubDate: 2020-04-13
category: "技术教程"
tags: ["前端优化", "性能", "SEO", "SPA", "SSR"]
readTime: "15 分钟"
featured: false
---

# 浅谈前端Web性能优化

关于前端web性能优化的问题，在文章中我会随着项目的积累，把所知的和实用的优化经验总结一下。文章参考：

> [《毫秒必争，前端网页性能最佳实践》](https://www.cnblogs.com/developersupport/p/webpage-performance-best-practices.html#httprequest "《毫秒必争，前端网页性能最佳实践》")[《12道腾讯前端面试真题及答案整理》](https://mp.weixin.qq.com/s/caBOODlnPJDdzw45Ngn_Fw "《12道腾讯前端面试真题及答案整理》")[rwyin博客园](https://www.cnblogs.com/yinrw/p/10694735.html "rwyin博客园")

前端虽然涉及的数据处理没有后端多，但是当一个项目足够大的时候，包括 HTML、 CSS、 Javascript、Image 、Flash等等各种各样的资源的加载，就会影响到项目的整体性能以及请求速度。因此，前端优化的目的，可以总结为以下两点：

1. 从用户角度而言，优化能够让页面加载得更快、对用户的操作响应得更及时，能够给用户提供更为友好的体验。
2. 从服务商角度而言，优化能够减少页面请求数、或者减小请求所占带宽，能够节省可观的资源。

总而言之，前端性能优化，是前端进阶的必备技能。

### 必须知道的基本优化

#### 尽量减少前端的HTTP请求

一个完整的请求都需要经过 DNS寻址、与服务器建立连接、发送数据、等待服务器响应、接收数据这样一个 "漫长" 而复杂的过程。多一秒的等待有可能就会导致丢失一大部分的用户。另外，由于浏览器进行并发请求的请求数是有上限的，因此请求数多了以后，浏览器需要分批进行请求，因此会增加用户的等待时间，会给用户造成站点速度慢这样一个印象，即使可能用户能看到的第一屏的资源都已经请求完了，但是浏览器的进度条会一直存在。

- 设计层面的优化：这个得跟产品和原型大佬沟通...
- *合理设置 HTTP 缓存*：很少变化的图片资源可以直接通过 HTTP Header中的 Expires 设置一个很长的过期头；变化不频繁而又可能会变的资源可以使用 Last-Modifed 来做请求验证。
- *资源合并与压缩*：尽可能的将外部的脚本、样式进行合并，多个合为一个。另外， CSS、 Javascript、Image 都可以用相应的工具进行压缩，压缩后往往能省下不少空间。
- CSS Sprites：合并 CSS图片，通过坐标来控制显示导航，减少请求数的又一个好办法。
- Inline Images：通过编码的字符串将图片内嵌到网页文本中。(未曾使用) 如果是嵌入页面的话换来的是增大了页面的体积，而且无法利用浏览器缓存。使用在 CSS中的图片则更为理想一些。
  ```css
    .sample-inline-png {
      padding-left: 20px;
      background: white url('data:image/png;base64,iVBORw0KGoAA...') no-repeat scroll left top;
    }
  ```
- Lazy Load Images(图片懒加载)：这条策略实际上并不一定能减少HTTP请求数，但是却能在某些条件下或者页面刚加载时减少HTTP请求数。对于图片而言，在页面刚加载的时候可以只加载第一屏，当用户继续往后滚屏的时候才加载后续的图片。这样一来，假如用户只对第一屏的内容感兴趣时，那剩余的图片请求就都节省了。

#### 将外部脚本置底

将脚本内容在页面信息内容加载后再加载。前文有谈到，浏览器是可以并发请求的，这一特点使得其能够更快的加载资源，然而外链脚本在加载时却会阻塞其他资源，例如在脚本加载完成之前，它后面的图片、样式以及其他脚本都处于阻塞状态，直到脚本加载完成后才会开始加载。因此，最简单的办法，就是把较大的脚本文件尽可能往后挪动。

#### 将 CSS 放在 HEAD 中

如果将 CSS 放在其他地方比如 body 中，则浏览器有可能还未下载和解析到 CSS 就已经开始渲染页面了，这就导致页面由无 CSS 状态跳转到 CSS 状态，用户体验比较糟糕。除此之外，有些浏览器会在 CSS 下载完成后才开始渲染页面，如果 CSS放在靠下的位置则会导致浏览器将渲染时间推迟。

#### 最小化iframe的数量

iframe提供了一个简单的方式把一个网站的内容嵌入到另一个网站中。但其创建速度比其他包括JavaScript和CSS的DOM元素的创建慢了1-2个数量级。

#### 减少DOM元素数量

页面中存在大量DOM元素，会导致javascript遍历DOM的效率变慢。

### 进阶版优化

#### 前端需要注意哪些 SEO（搜索引擎优化）

- 合理的title(网站标题)，description(描述)，keywords(关键字)：搜索对着三项的权重逐个减小，title 值强调重点即可，重要关键词出现不要超过 2 次，而且要靠前，不同页面 title 要有所不同；description 把页面内容高度概括，长度合适，不可过分堆砌关键词，不同页面 description 有所不同；keywords 列举出重要关键词即可。
- 语义化代码，符合W3C规范：语义化代码让搜索引擎容易理解网页。
- 重要内容 HTML 代码放在最前：搜索引擎抓取 HTML 顺序是从上到下，有的搜索引擎对抓取长度有限制，保证重要内容一定会被抓取。
- 重要内容不要用js输出：爬虫不会执行 js 获取内容。
- 少用 iframe(搜索引擎不会抓取 iframe 中的内容)。
- 非装饰性图片必须加alt。
- 提高网站速度(网站速度是搜索引擎排序的一个重要指标)。

#### 细说 GET / POST 请求的区别

> （本标准答案参考自w3schools）

在客户机和服务器之间进行请求-响应时，两种最常被用到的方法是：GET 和 POST。
GET和POST本质上就是TCP链接，并无差别。但是由于HTTP的规定和浏览器/服务器的限制，导致他们在应用过程中体现出一些不同。

- **GET** - 从指定的资源请求数据。
- **POST** - 向指定的资源提交要被处理的数据。

#### GET方法

请注意，查询字符串（名称/值对）是在 GET 请求的 URL 中发送的：

```javascript
/test/demo_form.asp?name1=value1&name2=value2
```

有关GET请求的其他一些注释：

- GET 请求可被缓存；
- GET 请求保留在浏览器历史记录中；
- GET 请求可被收藏为书签；
- GET 请求不应在处理敏感数据时使用；
- GET 请求有长度限制；(严格意义上来说并不是)
- GET 请求只应当用于取回数据。

#### POST方法

请注意，查询字符串（名称/值对）是在 POST 请求的 HTTP 消息主体中发送的：

```javascript
POST /test/demo_form.asp HTTP/1.1
Host: w3schools.com
name1=value1&name2=value2
```

有关 POST 请求的其他一些注释：

- POST 请求不会被缓存；
- POST 请求不会保留在浏览器历史记录中；
- POST 不能被收藏为书签；
- POST 请求对数据长度没有要求。

#### 总结区别

1. GET是从服务器上获取数据，POST是向服务器传送数据。
2. GET是把参数数据队列加到提交表单的ACTION属性所指的URL中，值和表单内各个字段一一对应，在URL中可以看到；POST是通过HTTP POST机制，将表单内各个字段与其内容放置在HTML HEADER内一起传送到ACTION属性所指的URL地址。用户看不到这个过程。
3. 对于GET方式，服务器端用Request.QueryString获取变量的值，对于POST方式，服务器端用Request.Form获取提交的数据。
4. GET传送的数据量较小，不能大于2KB。POST传送的数据量较大，一般被默认为不受限制。但理论上，IIS4中最大量为80KB，IIS5中为100KB。(严格意义上来说，大小长度取决于浏览器，服务器限制，下文会阐述。)
5. GET安全性非常低，POST安全性较高。

另外值得注意的是：
GET和POST还有一个重大区别，简单的说：
**GET产生一个TCP数据包；POST产生两个TCP数据包。**

展开来说：(这里很感谢rwyin博客园作者的指出)
对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据）；
而对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）。

#### 一表带你看清两者的区别

| 差别类型     | GET                                                              | POST                                                                 |
| -------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| 后退按钮/刷新  | 无害                                                               | 数据会被重新提交（浏览器应该告知用户数据会被重新提交）                                          |
| 书签       | 可收藏为书签                                                           | 不可收藏为书签                                                              |
| 编码类型     | application/x-www-form-urlencoded                                | application/x-www-form-urlencoded 或 multipart/form-data 为二进制数据使用多重编码 |
| 历史       | 参数保留在浏览器历史中                                                      | 参数不会保存在浏览器历史中                                                        |
| 对数据长度的限制 | 当发送数据时，GET 方法向 URL 添加数据；URL 的长度是受限制的（URL 的最大长度是 2048 个字符）        | 无限制                                                                  |
| 对数据类型的限制 | 只允许 ASCII 字符                                                     | 没有限制，也允许二进制数据                                                        |
| 安全性      | 与 POST 相比，GET 的安全性较差，因为所发送的数据是 URL 的一部分。(在发送密码或其他敏感信息时绝不要使用 GET) | POST 比 GET 更安全，因为参数不会被保存在浏览器历史或 web 服务器日志中                           |
| 可见性      | 数据在 URL 中对所有人都是可见的                                               | 数据不会显示在 URL 中                                                        |

#### 关于请求长度

(感谢前端Q公众号的科普)
我们经常说get请求参数的大小存在限制，而post请求的参数大小是无限制的。这是一个错误的说法，实际上HTTP 协议从未规定 GET/POST 的请求长度限制是多少。对get请求参数的限制是来源与浏览器或web服务器，浏览器或web服务器限制了url的长度。为了明确这个概念，我们必须再次强调下面几点：

1. HTTP 协议 未规定 GET 和POST的长度限制；
2. GET的最大长度显示是因为 浏览器和 web服务器限制了 URI的长度；
3. 不同的浏览器和WEB服务器，限制的最大长度不一样；
4. 要支持IE，则最大长度为2083byte，若只支持Chrome，则最大长度 8182byte。

#### 如何优化SPA(单页面)应用的首屏加载速度？

- 将公用的JS库通过script标签外部引入，减少app.bundel的大小，让浏览器并行下载资源文件，提高下载速度；
- 在配置路由时，页面和组件使用懒加载的方式引入，进一步缩小app.bundel的体积，在调用某个组件时再加载对应的js文件；
- root中插入loading或者骨架屏prerender-spa-plugin，提升用户体验；
- 如果在webview中的页面，可以进行页面预加载；
- 独立打包异步组件公共Bundle，以提高复用性&缓存命中率；
- 静态文件本地缓存，有两种方式分别为HTTP缓存，设置Cache-Control，Last-Modified，Etag等响应头和Service Worker离线缓存；
- 配合PWA使用；
- SSR；
- 使用Tree Shaking 减少业务代码体积。

#### 实现一个页面操作不会整页刷新的网站，并且能在浏览器前进后退时正确响应，给出你的技术实现方案

HTML5提供history接口，把URL以state的形式添加或者替换到浏览器中，其实现函数正是 pushState 和 replaceState。
pushState() 的基本参数是：

```javascript
window.history.pushState(state, title, url); //pushState()可以创建历史，可以配合popstate事件
```

replaceState() 同理：

```javascript
window.history.replaceState(state, title, href);
```

1. 通过使用 pushState + ajax 实现浏览器无刷新前进后退，当一次ajax调用成功后将一条state记录加入到history中；
2. 一条state记录包含了url，title，和content属性，在popstate事件中可以获取到这个state对象，我们可以使用content来传递数据。
3. 通过对`window.onpopstate`事件监听来响应浏览器的前进后退操作。

现在用Ajax + pushState来提供全新的ajax调用风格。以jQuery为例，为了SEO需要，应该为a标签的onclick添加方法。

```javascript
$("~target a").click(function(evt) {
  evt.preventDefault(); // 阻止默认的跳转操作
  var uri = $(this).attr('href');
  var newTitle = ajax_Load(uri); // 你自定义的Ajax加载函数，例如它会返回newTitle
  document.title = newTitle; // 分配新的页面标题
  if (history.pushState) {
  var state = ({
    url: uri, title: newTitle
  });
  window.history.pushState(state, newTitle, uri);
  } else { 
    window.location.href = "#!" + ~fakeURI;
  } // 如果不支持，使用旧的解决方案
  return false;
});

function ajax_Load(uri) {
  //...
  return newTitle;
} // 你自定义的ajax函数，例如它会返回newTitle
```

想要良好的支持浏览器的历史前进后退操作，应当部署popstate监听：

```javascript
window.addEventListener('popstate', function(evt) {
  var state = evt.state;
  var newTitle = ajax_Load(state.url); //你自定义的ajax加载函数，例如它会返回newTitle

  document.title = newTitle;
}, false);
```

使用pushState来实现有两个问题：

1. 打开首页时没有记录，我们可以使用replaceState来将首页的记录替换；
2. 当一个页面刷新的时候，仍然会向服务器端请求数据，因此如果请求的url需要后端的配合将其重定向到一个页面。

#### 服务端渲染(SSR)

此部分参考[coder\_Lucky的简书](https://www.jianshu.com/p/10b6074d772c "coder_Lucky的简书")
服务端渲染（SSR：server side render）简单理解是将组件或页面通过服务器生成html字符串，再发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

- 没使用服务渲染，当请求页面时，返回的body里为空，之后执行js将html结构注入到body里，结合css显示出来；
- 使用了服务端渲染，当请求页面时，返回的body里已经有了首屏的html结构，之后结合css显示出来；

使用SSR的利弊：

- 优势：
  1. **更利于SEO**。不同爬虫工作原理类似，只会爬取源码，不会执行网站的任何脚本（Google除外，据说Googlebot可以运行javaScript）。使用了React或者其它MVVM框架之后，页面大多数DOM元素都是在客户端根据js动态生成，可供爬虫抓取分析的内容大大减少(如图一)。另外，浏览器爬虫不会等待我们的数据完成之后再去抓取我们的页面数据。服务端渲染返回给客户端的是已经获取了异步数据并执行JavaScript脚本的最终HTML，网络爬中就可以抓取到完整页面的信息。
  2. **更利于首屏渲染**。首屏的渲染是node发送过来的html字符串，并不依赖于js文件了，这就会使用户更快的看到页面的内容。尤其是针对大型单页应用，打包后文件体积比较大，普通客户端渲染加载所有所需文件时间较长，首页就会有一个很长的白屏等待时间。
- 局限：
  1. 服务端压力大。本来是通过客户端完成渲染，现在统一到服务端node服务去做。尤其是高并发访问的情况，会大量占用服务端CPU资源；
  2. 开发条件受限。在服务端渲染中，只会执行到componentDidMount之前的生命周期钩子，因此项目引用的第三方的库也不可用其它生命周期钩子，这对引用库的选择产生了很大的限制；
  3. 学习成本相对较高。除了对webpack、React要熟悉，还需要掌握node、Koa2等相关技术。相对于客户端渲染，项目构建、部署过程更加复杂。
