---
title: "JavaScript通用脱敏方法"
description: "JavaScript 通用数据脱敏方法封装，用于手机号、银行卡等隐私信息的脱敏处理"
pubDate: 2020-04-04
category: "技术教程"
tags: ["JavaScript", "工具函数", "数据处理"]
readTime: "3 分钟"
featured: false
---

# JavaScript通用脱敏方法

针对业务需求中经常会用到的手机号，或者银行卡等等较为隐私的信息，以" *"号的形式渲染出来，这个时候就需要用到脱敏处理。因此封装了一个JS下的通用脱敏方法，方便批量处理。代码如下：

```javascript
/**
* 
* @param str 需要转换的字符串
* @param beginLen 从字符串下标的第几位开始
* @param endLen 从字符串下标的第几位结束
* @returns {string|*} 返回转换好的字符串
*/
function desensitization(str, beginLen, endLen){
    var len = str.length;
    var firstStr = str.substr(0, beginLen);
    var lastStr = str.substr(endLen);
    var middleStr = str.substring(beginLen, len-Math.abs(endLen)).replace(/[\s\S]/ig, '*');

    tempStr = firstStr+middleStr+lastStr;

    return tempStr;
}
desensitization('12345678901234',4, -4); //调用函数
```

原文出处：[JS通用脱敏方法](https://blog.csdn.net/yfds2008/article/details/86511593 "JS通用脱敏方法")
