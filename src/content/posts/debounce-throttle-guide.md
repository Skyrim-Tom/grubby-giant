---
title: "Debounce Throttle Guide"
description: "详解 JavaScript 防抖(debounce)和节流(throttle)的概念、实现原理及应用场景"
pubDate: 2020-04-12
category: "技术教程"
tags: ["JavaScript", "性能优化", "防抖", "节流"]
readTime: "8 分钟"
featured: false
---

# 浅谈JS防抖和节流

文章参考自[安歌的《浅谈js防抖和节流》](https://segmentfault.com/a/1190000018428170 "安歌的《浅谈js防抖和节流》")
首先很感谢文章作者安歌可以从一个实例中去详细解释js的防抖和节流机制，通俗易懂。本文主要针对引用文章稍作记录，方便个人理解。具体详解可以点击上方传送门哦！

首先是一个常见的回到首页功能，获取滚动条到顶部的高度：

```javascript
function showTop () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
　　console.log('滚动条位置：' + scrollTop);
}
window.onscroll = showTop
```

原有实现逻辑可以是当滚动条到顶部达到一定的高度，则显示回到顶部按钮。但是这里存在一个问题，函数的执行频率会非常高。
对类似场景的优化，可以引出防抖这个概念。

### 防抖(debounce)

基于上述场景，有这样的解决方案：**在第一次触发事件时，不立即执行函数，而是给出一个期限值比如200ms**，然后：

- 如果在200ms内没有再次触发滚动事件，那么就执行函数；
- 如果在200ms内再次触发滚动事件，那么当前的计时取消，重新开始计时。

效果：如果短时间内大量触发同一事件，只会执行一次函数。
防抖函数实现：关键就在于setTimeout这个函数，使用闭包保存计时变量，维护全局纯净

```javascript
/*
* fn [function] 需要防抖的函数
* delay [number] 毫秒，防抖期限值
*/
function debounce(fn, delay) {
    let timer = null //借助闭包
    return function() {
        if (timer) {
            clearTimeout(timer) //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
            timer = setTimeout(fn, delay) 
        } else {
            timer = setTimeout(fn, delay) // 进入该分支说明当前并没有在计时，那么就开始一个计时
        }
    }
}
```

将上方代码再稍微简化一下：

```javascript
/*****************************简化后的分割线 ******************************/
function debounce(fn, delay) {
    let timer = null //借助闭包
    return function() {
        if (timer) {
            clearTimeout(timer) 
        }
        timer = setTimeout(fn, delay) // 简化写法
    }
}
// 然后是旧代码
function showTop () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
　　console.log('滚动条位置：' + scrollTop);
}
window.onscroll = debounce(showTop, 1000) // 为了方便观察效果我们取个大点的间断值，实际使用根据需要来配置
```

此时会发现，必须在停止滚动1秒以后，才会打印出滚动条位置。
到目前位置，就已经把**防抖**实现了，现在给出定义：

- 对于**短时间内连续触发的事件**（上面的滚动事件），**防抖的含义就是让某个时间期限（如上面的1000毫秒）内，事件处理函数只执行一次。**

### 节流(throttle)

继续思考，使用上面的防抖方案来处理问题的结果是：

- 如果在限定时间段内，不断触发滚动事件（比如某个用户闲着无聊，按住滚动不断的拖来拖去），只要不停止触发，理论上就永远不会输出当前距离顶部的距离。

这里我们可以设计一种类似控制阀门一样定期开放的函数，也就是让函数执行一次后，在某个时间段内暂时失效，过了这段时间后再重新激活（类似于技能CD）。
效果：如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。
这里借助`setTimeout`来做一个简单的实现，加上一个状态位`valid`来表示当前函数是否处于工作状态：

```javascript
function throttle(fn, delay) {
    let valid = true
    return function() {
       if (!valid) {
           //休息时间 暂不接客
           return false 
       }
       // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}
/* 请注意，节流函数并不止上面这种实现方案,
   例如可以完全不借助setTimeout，可以把状态位换成时间戳，然后利用时间戳差值是否大于指定间隔时间来做判定。
   也可以直接将setTimeout的返回的标记当做判断条件-判断当前定时器是否存在，如果存在表示还在冷却，并且在执行fn之后消除定时器表示激活，原理都一样
    */

// 以下照旧
function showTop  () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
　　console.log('滚动条位置：' + scrollTop);
}
window.onscroll = throttle(showTop,1000) 
```

运行以上代码的结果是：

- 如果一直拖着滚动条进行滚动，那么会以1s的时间间隔，持续输出当前位置和顶部的距离。

### 其他可应用场景举例

1. 搜索框input事件，例如要支持输入实时搜索可以使用节流方案（间隔一段时间就必须查询相关内容），或者实现输入间隔大于某个值（如500ms），就当做用户输入完成，然后开始搜索，具体使用哪种方案要看业务需求。
2. 页面resize事件，常见于需要做页面适配的时候。需要根据最终呈现的页面情况进行dom渲染（这种情形一般是使用防抖，因为只需要判断最后一次的变化情况）。
