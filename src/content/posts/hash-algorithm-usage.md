---
title: "哈希算法的精简运用"
description: "哈希算法的精简运用，使用 hash 思想对数组进行分组处理，适用于朋友圈时间线等场景"
pubDate: 2020-04-09
category: "技术教程"
tags: ["JavaScript", "算法", "数据结构", "Hash"]
readTime: "4 分钟"
featured: false
---

# 哈希算法的精简运用

Hash算法，简称散列算法，也可英译为哈希算法。可用于将一个大文件映射成一个小串字符串。与指纹一样，就是以较短的信息来保证文件的唯一性标志，这种标志与文件的每一个字节都相关，而且难以找到逆向规律。

简单点说，hash就是将任意长度的消息压缩成某一固定长度的消息摘要的函数。

可能仅仅看文字是很难理解，下面一段代码可能会让你更能进一步了解到它的用处。
```javascript
const array = [
    {
        time: '2018-11-14',
        text: '123'
    },
    {
        time: '2018-11-13',
        text: '321'
    },
    {
        time: '2018-11-28',
        text: '233'
    },
    {
        time: '2018-11-13',
        text: '322'
    }
]; //假设有这么一段对象数组格式

let data = {};
array.forEach( function(item, index) {
    if (!data[item.time]) {
        data[item.time] = [item.text]
    } else {
        data[item.time].push(item.text)
    }
})
console.log(data);
```

以time作为key值对数组里的每一个对象进行遍历，当key值为相等时，则把text值push到该key值所对应的数组，最后可以输入以下的结果：
```javascript
{
    '2018-11-13': ['321', '322'],
    '2018-11-14': ['123'],
    '2018-11-28': ['233']
}
```

当然，这样的效果还可以应用到一些简单的项目案例中，比如说朋友圈的个人主页布局，将相同日期的动态push到一个数组里面，再进行渲染，非常省事。
