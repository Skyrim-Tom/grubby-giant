---
title: "ES6 Array Methods and Tips"
description: "全面总结 ES6 中常用的数组操作方法，包括检测、遍历、转换、排序等各种实用技巧"
pubDate: 2020-04-01
category: "技术教程"
tags: ["JavaScript", "ES6", "Array", "前端基础"]
readTime: "8 分钟"
featured: false
---

# ES6常用数组操作及技巧汇总

原文转载自[ES6常用数组操作及技巧汇总](https://segmentfault.com/a/1190000012429718 "ES6常用数组操作及技巧汇总")。作者：hellobaby
文章总结得非常全面，所以也趁此机会把作者辛苦总结好的重新按照自己的思路整理一遍加深记忆，同时也记录下来方便往后用到。

## 定义数组

```javascript
const array = [1, 2, 3];
//or
const array = new Array();
array[0] = '1';
array[1] = '2';
```

建议尽量使用第一种形式定义数组，采用new的形式在大量的数组定义时，会比较耗时。
new关键字的使用，除了在需要实例化一个对象，或罕见的需要延时加载数据的情况外，你基本上不需要使用new关键字。在Javascript里分配大量的new变量地址是一项很慢的操作，为了效率起见，你应该始终使用对象符号。

> 在另外一个搜索结果中，有提到这样的一个说法："很简单，Array()是一个对象，\[]是一个数据原型。使用new Array()系统每次都会新生成一个对象（浏览器每生成一个对象都会耗费资源去构造他的属性和方法），他的子集是\[]；个人推荐使用\[]，效率高。浏览器对于CPU很吃紧，所以很多时候要有技巧。比如数字转换成字符只要`a = a + ''`; 就可以了，比用String效率高了很多。

## 检测数组

```javascript
Array.isArray([]); //true
Array.isArray(undefined); //false

//or
array instanceof Array; //true 检测对象的原型链是否指向构造函数的prototype对象
//or
array.constructor === Array; //true

//终极大招：
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

//注意：typeof []; //"Object" 不可以用此方法检查！！！
```

## 常用方法

### 1. array.concat(array1, array2, ...arrayN);

**合并多个数组，返回合并后的新数组，原数组没有变化。**

```javascript
const array = [1, 2].concat(['a', 'b'], ['name']);
// [1, 2, "a", "b", "name"]
```

### 2. array.every(callback\[, thisArg]);

**检测数组中的每一个元素是否都通过了callback测试，全部通过返回true，否则返回false。**

```javascript
//callback定义如下： element:当前元素值；index：当前元素下标； array:当前数组
function callback(element, index, array) {
  //callback函数必须返回true或者false告知every是否通过测试
  return true || false;
}
```

### 3. array.filter(callback\[, thisArg]);

**返回一个新数组，包含通过callback函数测试的所有元素。**

```javascript
// callback定义如下，三个参数： element:当前元素值；index：当前元素下标； array:当前数组
function callback(element, index, array) {
  // callback函数必须返回true或者false，返回true保留该元素，false则不保留。
  return true || false;
}
const filtered = [1, 2, 3].filter(element => element > 1);
// filtered: [2, 3]
```

### 4. array.find(callback\[, thisArg]);

**返回通过callback函数测试的第一个元素，否则返回undefined，callback函数定义同上。**

```javascript
const finded = [1, 2, 3].find(element => element > 1);
// finded: 2
```

**如果你需要找到一个元素的位置或者一个元素是否存在于数组中，使用**\*\*`Array.prototype.indexOf()`或****`Array.prototype.includes()`****。\*\*

### 5. array.findIndex(callback\[, thisArg]);

**返回通过callback函数测试的第一个元素的索引，否则返回-1，callback函数定义同上。**

```javascript
const findIndex = [1, 2, 3].findIndex(element => element > 1);
// findIndex: 1
```

### 6. array.includes(searchElement, fromIndex);

**includes() 方法用来判断一个数组是否包含一个指定的值，返回 true 或 false。searchElement：要查找的元素；fromIndex：开始查找的索引位置。**

```javascript
[1, 2, 3].includes(2, 2);
// false
```

### 7. array.indexOf(searchElement\[, fromIndex = 0]);

**返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。searchElement：要查找的元素；fromIndex：开始查找的索引位置。**

```javascript
[2, 9, 7, 8, 9].indexOf(9);
// 1
```

### 8. array.join(separator=',');

**将数组中的元素通过separator连接成字符串，并返回该字符串，separator默认为",".**

```javascript
[1, 2, 3].join(';');
// "1;2;3"
```

### 9. array.map(callback\[, thisArg]);

**返回一个新数组，新数组中的每个元素都是调用callback函数后返回的结果。注意：如果没有return值，则新数组会插入一个undefined值。**

**array.map由于不具有过滤的功能，因此array调用map函数时，如果array中的数据并不是每一个都会return，则必须先filter，然后再map，即map调用时必须是对数组中的每一个元素都有效。**

```javascript
const maped = [{name: 'aa', age: 18}, {name: 'bb', age: 20}].map(item => item.name + 'c');
// maped: ['aac', 'bbc'];
```

### 10. array.pop() 与 array.shift();

**pop为从数组中删除最后一个元素，并返回最后一个元素的值，原数组的最后一个元素被删除。数组为空时返回undefined。**

```javascript
[1, 2, 3].pop();
// 3
```

**shift删除数组的第一个元素，并返回第一个元素，原数组的第一个元素被删除。数组为空返回undefined。**

```javascript
const shifted = ['one', 'two', 'three'].shift();
// shifted: 'one'
```

### 11. array.push(element1, element2, ....elementN) 与 array.unshift(element1, element2, ...elementN);

**push是将一个或多个元素添加到数组的末尾，并返回新数组的长度; unshift将一个或多个元素添加到数组的开头，并返回新数组的长度。唯一的区别就是插入的位置不同。**

```javascript
const arr = [1, 2, 3];
const length = arr.push(4, 5);
// arr: [1, 2, 3, 4, 5]; length: 5
```

**push和unshift方法具有通用性，通过call()或者apply()方法调用可以完成合并两个数组的操作。**

```javascript
const vegetables = ['parsnip', 'potato'];
const moreVegs = ['celery', 'beetroot'];

// 将第二个数组融合进第一个数组
// 相当于 vegetables.push('celery', 'beetroot');
Array.prototype.push.apply(vegetables, moreVegs);
//or
[].push.apply(vegetables, moreVegs);
// vegetables: ['parsnip', 'potato', 'celery', 'beetroot']
```

### 12. array.reduce(callback\[, initialValue]);

**对数组中的每个元素（从左到右）执行callback函数累加，将其减少为单个值。**

```javascript
const total = [0, 1, 2, 3].reduce((sum, value) => {
  return sum + value;
}, 0);
// total is 6

const flattened = [[0, 1], [2, 3], [4, 5]].reduce((a, b) => {
  return a.concat(b);
}, []);
// flattened is [0, 1, 2, 3, 4, 5]

// initialValue累加器初始值， callback函数定义：
function callback(accumulator, currentValue, currentIndex, array) {
}
//accumulator代表累加器的值，初始化时，如果initialValue有值，则accumulator初始化的值为initialValue，整个循环从第一个元素开始；initialValue无值，则accumulator初始化的
//值为数组第一个元素的值，currentValue为数组第二个元素的值，整个循环从第二个元素开始。initialValue的数据类型可以是任意类型，不需要跟原数组内的元素值类型一致。


const newArray = [{ name: 'aa', age: 1 }, { name: 'bb', age: 2 }, { name: 'cc', age: 3 }].reduce((arr, element) => {
  if (element.age >= 2) {
    arr.push(element.name);
  }
  return arr; // 必须有return，因为return的返回值会被赋给新的累加器，否则累加器的值会为undefined。
}, []);

// newArray is ["bb", "cc"];

//上面代码的同等写法：
const newArray = [{ name: 'aa', age: 1 }, { name: 'bb', age: 2 }, { name: 'cc', age: 3 }].filter(element => element.age >= 2).map(item => item.name);
// newArray is ["bb", "cc"];

//对于reduce的特殊用法，其实类似于省略了一个变量初始化步骤，然后通过每次的callback的返回修改该变量，最后返回最终变量值的过程，类似于一个变量声明 + 一个forEach执行过程。
const newArray = [];
[{ name: 'aa', age: 1 }, { name: 'bb', age: 2 }, { name: 'cc', age: 3 }].forEach(item => {
 if (item.age >=2) {
  newArray.push(item.name);
 }
});
```

### 13. array.reverse();

**将数组中元素的位置颠倒。**

```javascript
['one', 'two', 'three'].reverse();
// ['three', 'two', 'one']，原数组被翻转
```

### 14. array.slice(begin, end);

**返回一个新数组，包含原数组从begin 到 end(不包含end)索引位置的所有元素。**

```javascript
const newArray = ['zero', 'one', 'two', 'three'].slice(1, 3);
// newArray: ['one', 'two'];
```

### 15. array.some(callback\[, thisArg]);

**判断数组中是否包含可以通过callback测试的元素，与every不同的是，这里只要某一个元素通过测试，即返回true。callback定义同上。**

```javascript
[2, 5, 8, 1, 4].some(item => item > 6);
// true
```

### 16. array.sort(\[compareFunction]);

**对数组中的元素进行排序，compareFunction不存在时，元素按照转换为的字符串的诸个字符的Unicode位点进行排序，慎用！请使用时一定要加compareFunction函数，而且该排序是不稳定的。**

```javascript
[1, 8, 5].sort((a, b) => {
  return a-b; // 从小到大排序
});
// [1, 5, 8]
```

### 17. array.splice(start\[, deleteCount, item1, item2, ...]);

**通过删除现有元素和/或添加新元素来更改一个数组的内容。start:指定修改的开始位置；deleteCount：从 start位置开始要删除的元素个数；item...：要添加进数组的元素,从start 位置开始。**

**返回值是由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。**

**如果 deleteCount 大于start 之后的元素的总数，则从 start 后面的元素都将被删除（含第 start 位）。**

```javascript
const myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];

const deleted = myFish.splice(2, 0, 'drum'); // 在索引为2的位置插入'drum'
// myFish 变为 ["angel", "clown", "drum", "mandarin", "sturgeon"]，deleted为[]
```

***

> **push、 shift、 pop、 unshift、 reverse、 sort、 splice方法会对原来的数组进行修改，其他的数组操作方法只有返回值不同，对原数组都没有影响，即原数组不变。**
