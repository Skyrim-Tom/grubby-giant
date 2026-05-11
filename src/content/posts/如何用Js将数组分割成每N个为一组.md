---
title: "如何用Js将数组分割成每N个为一组"
description: "JavaScript 中将数组分割成每 N 个为一组的方法，适用于 Swiper 分页等场景"
pubDate: 2020-04-11
category: "技术教程"
tags: ["JavaScript", "Array", "工具函数"]
readTime: "3 分钟"
featured: false
---

# 如何用Js将数组分割成每N个为一组

假设有这么一个数组：

```javascript
let array = ['法国','澳大利亚','智利','新西兰','西班牙','加拿大','阿根廷','美国','中国','波多黎各','英国','比利时','德国','意大利'];
```

现在希望将数组分割成每3个值组成一个新数组：

```javascript
array = [['法国','澳大利亚','智利'],['新西兰','西班牙','加拿大'],['阿根廷','美国','中国'],['波多黎各','英国','比利时'],['德国','意大利']];
```

可通过以下方法进行处理：

```javascript
let array = ['法国','澳大利亚','智利','新西兰','西班牙','加拿大','阿根廷','美国','中国','波多黎各','英国','比利时','德国','意大利'];
let newArray = [];
for (let i = 0, len = array.length; i < len; i += 3) {
   newArray.push(array.slice(i, i + 3));
}
```

也可以单独封装一个方法来进行套用：

```javascript
function group(array, subGroupLength) {
  let index = 0;
  let newArray = [];

  while(index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }

  return newArray;
}

let countries = []; //这里定义的是你需要用作处理的数组
let groupedCountries = group(countries, 3);
```

文章列举的为常用的方法，在笔者的业务需求中主要用于swiper分割。将数组每3个值组成一个swiper-slide，实现每一页swiper有3个值的效果。
更多方法可以前往 [传送门](https://segmentfault.com/q/1010000004921251 "传送门") 。

感谢阅读。
