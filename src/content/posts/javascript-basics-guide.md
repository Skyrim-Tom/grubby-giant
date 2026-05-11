---
title: "JavaScript知识点整理"
description: "JavaScript 核心知识点整理，涵盖数据类型、隐式转换、类型检测、原型链、var/let/const区别等内容"
pubDate: 2020-04-03
category: "技术教程"
tags: ["JavaScript", "前端基础", "ES6"]
readTime: "12 分钟"
featured: false
---

# JavaScript知识点整理

### JavaScript数据类型总结

数据类型指的就是字面量的类型，可以分为两类：1. 原始类型(基本类型); 2. 引用类型。

1. 基本数据类型(原始数据类型)

- String(字符串)
- Number(数字)
- Boolean(布尔)
- Null(对空)
- Undefined(为定义)
- Symbol(ES6 引入了一种新的原始数据类型，表示独一无二的值。)
- BigInt(ES10)

1. 引用数据类型

- Object
  - Array
  - Function
  - Date
  - ...

### 隐式转换

该部分内容参考自[《那些年的代码的博客》](https://www.cnblogs.com/zhuyeshen/p/10997893.html "《那些年的代码的博客》")

1. `+` 和 `-`

巧用 + 和 - 规则转换类型
把变量转换成**数字**：`num - 0`
把变量转换成**字符串**：`num + ''`
2\. a == b

```javascript
"1.23" == 1.23 //true
0 == false //true
null == undefined //true
new Object() == new Object() //true
[1, 2] == [1, 2] //true
NaN == NaN //false
null == NaN //false
```

1. a === b

```javascript
0 === false //false
null === null //true
undefined === undefined //true
null === undefined //false
NaN === NaN //false
new Object === new Object //false
```

### 类型检测

JavaScript中类型检测方法有很多种：

- typeof
- instanceof
- Object.prototype.toString
- constructor
- duck type

下面将具体列出这几种检测方法的用法和特点：

#### typeof

最常见的就是typeof：

```javascript
typeof 100 //number
typeof true //boolean
typeof function(){} //function
typeof undefined //undefined
typeof new Object() //object
typeof [1, 2] //object
typeof NaN //number
typeof null //object
```

比较特殊的是`typeof null`返回`object`。
`typeof NaN`返回`number`，NaN参与任何数值计算的结构都是NaN，而且`NaN != NaN` 。
typeof对基本类型和函数对象很方便，但是其他类型就没办法了。

判断一个对象是不是数组？用typeof返回"object"。对对象的判断常用`instanceof`：

#### instanceof

基于原型链操作。`obj instanceof Object`。
左操作数为**对象**，不是就返回`false`，右操作数必须是**函数对象**或者**函数构造器**，不是就返回`typeError`异常。
原理：判断左边的左操作数的对象的原型链上是否有右边这个构造函数的`prototype`属性。
{% asset\_img instanceof.png instanceof具体操作演示 %}
任何一个构造函数都有一个prototype对象属性，这个对象属性将用作new出来的对象的原型。
`bosn instanceof Person`的时候发现bosn的原型也就是`Student.prototype`不等于`Person.prototype`，所以原型链还会向上查找，bosn的原型的原型等于`Person.prototype`所以返回`true`。
instanceof在判断对象是不是**数组**，**Data**，**正则**等时很好用。

> instanceof坑：不同window或iframe之间的对象类型检测不能使用instanceof！

#### Object.prototype.toString

```javascript
Object.prototype.toString.apply([]); //"[object Array]"
Object.prototype.toString.apply(function (){}); //"[object Function]"
Object.prototype.toString.apply(null); //"[object Null]"
Object.prototype.toString.apply(undefined); //"[object Undefined]"
```

需要注意的是IE6/7/8中 `Object.prototype.toString.apply(null)`返回`"[object Object]"`。

#### constructor

```javascript
Student.prototype.constructor === Student; //true
```

任何对象都有constructor属性，继承自原型的，constructor会指向构造这个对象的构造器或者构造函数。
constructor可以被改写，所以使用要小心。

#### duck typing

计算机领域中，duck typing相对应的是normal typing（对象的类型决定了对象的特性），duck typing中对象的类型不重要，只要对象有类型A的方法和属性，那么它被当做类型A来使用。
比如不知道一个对象是不是数组，可以判断它的length是不是数字，它是不是有join，push这样一些数组的方法。通过一些特征判断对象是否属于某些类型，这个有时候也常用。

### new操作中发生了什么？(可以继续补充)

比较直观的感觉，当我们new一个构造函数，得到的实例继承了**构造器的构造属性**(this.name这些)以及**原型上的属性**。
在《JavaScript模式》这本书中，new的过程说的比较直白，当我们new一个构造器，主要有三步：

- 创建一个空对象，将它的引用赋给 this，继承函数的原型；
- 通过 this 将属性和方法添加至这个对象；
- 最后返回 this 指向的新对象，也就是实例（如果没有手动返回其他的对象）。

### JavaScript中var，let，const的区别

1. var定义的变量可以被修改，存在变量提升的问题，如果不初始化会输出undefined，不会报错。

```javascript
var a = 1;
// var a; //不会报错
console.log('函数外var定义a：' + a); //函数外var定义a：1
function change(){
  a = 4;
  console.log('函数内var定义a：' + a);//函数外var定义a：4
}
change();
console.log('函数调用后var定义a为函数内部修改值：' + a); //函数调用后var定义a为函数内部修改值：4
```

1. let是块级作用域，函数内部使用let定义后，对函数外部无影响。

```javascript
let b = 3;
console.log('函数外let定义b：' + b); //函数外let定义b：3
function change() {
let b = 6;
console.log('函数内let定义b：' + b); //函数外let定义b：6
}
change();
console.log('函数调用后let定义b不受函数内部定义影响：' + b); //函数调用后let定义b不受函数内部定义影响：3
```

1. const定义的变量不可以修改，而且必须初始化。

```javascript
const c = 2; //正确
//const b; //错误，必须初始化
console.log('函数外const定义c：' + c); //函数外const定义c：2
// c = 5; //无法被修改
// console.log('函数外修改const定义c：' + c); //报错
```

> 补充：
> var：只有全局作用域和函数作用域概念，没有块级作用域的概念。但是会把{ }内也假称为块作用域。
> let：只有块级作用域的概念 ，由{ }包括起来，if语句和for语句里面的{ }也属于块级作用域。
> 同一作用域下let和const不能声明同名变量，而var可以。

### JavaScript中的call()和apply()

该部分内容参考自[JS中call()和apply()](https://www.jianshu.com/p/aa2eeecd8b4f "JS中call()和apply()")

每个函数都包含两个非继承而来的方法：call()和apply()。
在JavaScript中，call和apply作用是一样的，都是为了改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部this的指向。

```javascript
function fruits() {}

fruits.prototype = {
  color: "red",
  say: function() {
    console.log("My color is " + this.color);
  }
};

var apple = new fruits;
apple.say(); //My color is red
```

当另一个对象想使用fruits中的`say()`方法时不用重新写，使用call和apply可以实现"劫持"别人的方法。代码如下：

```javascript
function fruits(){}
            
fruits.prototype = {
  color: "red",
  say: function(){
    console.log("My color is " + this.color);
  }
};

var another = {
  color: "yellow"
};

var apple = new fruits;
apple.say();                //My color is red
apple.say.call(another);    //My color is yellow
apple.say.apply(another);   //My color is yellow
```

区别：参数书写方式不同。
**call(thisObj, arg1, arg2, ...);****apply(thisObj, \[args]);**

**thisObj**： call和apply第一个参数是一样的，该参数将替代Function类里面的this对象。
**arg1, arg2, ...**：是一个个的参数，必须全部都列出来。
**args**：一个数组或类数组，是一个参数列表。

用法：

- 改变函数作用域

```javascript
var name = "小白";
var obj = {
    name: "小红"
};

function sayName() {
    return this.name;
}
console.log(sayName.call(this)); //小白
console.log(sayName.call(obj)); //小红
```

- 实现继承

```javascript
//实现js继承
//父类
function Person(name, height) {
  this.sayInfo = function() {
    return "姓名：" + name + ", 身高：" + height + ", 体重：" + this.weight;
  }
}
//子类
function Chinese(name, height, weight) {
  Person.call(this, name, height);
  this.weight = weight;
  this.nation = function() {
    console.log("我是中国人");
  }
}
//子类
function America(name, height, weight) {
  Person.apply(this, [name, height]);
  this.weight = weight;
}

let chiness = new Chinese("成龙", "178cm", "60kg");
console.log(chiness.sayInfo());    //姓名：成龙, 身高：178cm, 体重：60kg
let america = new America("jack", "180cm", "55kg");
console.log(america.sayInfo());    //姓名：jack, 身高：180cm, 体重：55kg
```

子类里面的 `Person.call(this, name, height);` 是调用了父类构造方法，使用 call 将父类的this指向子类，则父类中 this.sayInfo = ... 相当于子类执行了this.sayInfo = ... ，则子类就继承了父类的属性和方法。
使用构造函数继承，每个子类实例中都有一个单独的副本，不会相互影响。

### JS的原型和原型链

该部分内容参考自饕餮猪的简书文章[JS的原型和原型链](https://www.jianshu.com/p/be7c95714586 "JS的原型和原型链")
构造函数创建对象：

```javascript
function Person() {

}
var person = new Person();
person.name = 'Kevin';
console.log(person.name) // Kevin
```

Person 就是一个构造函数，我们使用 new 创建了一个实例对象 person。

#### prototype

每个函数都有一个 prototype 属性。
每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

```javascript
function Person() {

}
// 虽然写在注释里，但是你要注意：
// prototype是函数才会有的属性
Person.prototype.name = 'Kevin';
var person1 = new Person();
var person2 = new Person();
console.log(person1.name) // Kevin
console.log(person2.name) // Kevin
```

{% asset\_img prototype.png prototype示例图 %}

#### proto

每一个JavaScript对象(除了 null )都具有的一个属性，叫proto，这个属性会指向该对象的原型。

```javascript
function Person() {

}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
```

{% asset\_img proto.png proto示例图 %}

#### constructor

每个原型都有一个 constructor 属性指向关联的构造函数 实例原型指向构造函数。

```javascript
function Person() {

}
console.log(Person === Person.prototype.constructor); // true
```

{% asset\_img constructor.png constructor示例图 %}

```javascript
function Person() {

}

var person = new Person();

console.log(person.__proto__ == Person.prototype) // true
console.log(Person.prototype.constructor == Person) // true
// 顺便学习一个ES5的方法,可以获得对象的原型
console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```

#### 实例与原型

```javascript
function Person() {

}

Person.prototype.name = 'Kevin';

var person = new Person();

person.name = 'Daisy';
console.log(person.name) // Daisy

delete person.name;
console.log(person.name) // Kevin
```

在这个例子中，我们给实例对象 person 添加了 name 属性，当我们打印 person.name 的时候，结果自然为 Daisy。
但是当我们删除了 person 的 name 属性时，读取 person.name，从 person 对象中找不到 name 属性就会从 person 的原型也就是 person.proto ，也就是 Person.prototype中查找，幸运的是我们找到了 name 属性，结果为 Kevin。

#### 原型与原型

```javascript
var obj = new Object();
obj.name = 'Kevin'
console.log(obj.name) // Kevin
```

{% asset\_img 原型与原型.png 原型与原型示例图 %}

#### 原型链

`console.log(Object.prototype.__proto__ === null) // true`
{% asset\_img 原型链.png 原型链示例图 %}
JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。

### Ajax

#### Ajax请求中contentType 和 dataType 的区别

contentType: 告诉服务器，我要发什么类型的数据；
dataType: 告诉服务器，我想要什么类型的数据，如果没有指定，那么会自动推断是返回 XML，还是JSON，还是script，还是String。
