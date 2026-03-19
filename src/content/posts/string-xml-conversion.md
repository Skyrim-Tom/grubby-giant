---
title: "String XML Conversion"
description: "在 JavaScript 中实现 String 与 XML 对象的相互转换，兼容 IE 和现代浏览器"
pubDate: 2020-04-10
category: "技术教程"
tags: ["JavaScript", "XML", "DOM", "数据处理"]
readTime: "3 分钟"
featured: false
---

# 在JavaScript中将String与XML相互转换

将字符串换成 XML 对象

```javascript
function convert_string_to_xml(strXML)  

{  

    if (window.ActiveXObject) {  

        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");  

        xmlDoc.async="false";  

        xmlDoc.loadXML(strXML);  

        return xmlDoc;  

    } else {  

        parser=new DOMParser();  

        xmlDoc=parser.parseFromString(strXML,"text/xml");  

        return xmlDoc;  

    }  

}  
```

将 XML 对象转换成字符串

```javascript
function convert_xml_to_string(xmlObject)  

{  

    if (window.ActiveXObject) { // for IE  

        return xmlObject.xml;  

    } else {  

        return (new XMLSerializer()).serializeToString(xmlObject);  

    }  

}  
```
