---
title: es6
author: 皮明宇
date: 2024.03.28
---
# es6
这天科目一考了`97`,诶嘿~

## 目标
 - 了解ES6的scope
 - 了解ES6的常见面试题

重点：
- ECMA Script 是标准，JavaScript 是实现
  - common js 是标准，node是实现
  - amd 规范是标准，require.js是实现
  - cmd 规范是标准，sea.js是实现

- JavaScript最早只是浏览器端的一个脚本，用于实现动态html效果
- 语言不是万能的，语言不是银弹，为什么会有这么多难记忆的东西？new...
  - const p = new Person()干了什么事：
  - p.__propto__ === Person.protoType;
  - Person.protoType.constructor = Person;
  - p.constructor = Person;

## 为什么会有babel？
6 to 5
es5(xx,xx,xx)
es6(yy,yy,yy) -- 如何用起来？
浏览器要支持。

- 浏览器对于一些语言特性的实现，滞后的
- 浏览器在用户侧的升级，滞后的

### 主要用途
#### 转译 esnext，typescript，flow等到目标环境支持的 javascript
#### 一些特定用途代码的转换
taro react
#### 代码的静态分析

how？
### babel的解析流程
- parser
- tranform
- generate

### babel 6 
插件
- es的发布
    - stage 0：strawman 是指一个想法
    - stage 1：proposal 值得继续的提议
    - stage 2：draft
    - stage 3：candidate
    - stage 4：finished
  
babel-preset-stage-2
babel-preset-2016

### babel 7
@babel/perset-env
    target

## ES 特性

### 函数解析
#### new 一个箭头函数会如何？（面试）
```js
    const a = () => { };
    const b = new a();
```
- 会报错，提示a is not a constructor;
- babel 编译时，会把this 转换为(void 0);

#### 哪些不能用箭头函数（面试）
- arguments
- yield
- 构造函数的原型方法上

#### 参数 arguments/callee/caller的区别?
- arguments 代表着正在执行的函数和函数的参数
- callee 使用arguments.callee 可以获取到目标是正在执行的函数（常用于递归）

#### 数组/对象的扩展于结构
##### 数组的细节
```js
    // 函数生成器
    const funGenerator = (num) => new Array(num).fill(0).map(v => 
    (v) => { console.log(v) }
    )

    funGenerator(10).map((func, index) => {
        func(index);
    })
```

##### 对象的细节
Object.js
才用了一个叫做 SameValueZero 的函数，这个引擎内置的比较方式，没有对外的接口，最直接的收益就是可以判断NaN;
```js
    console.log(NaN===NaN) // false
    console.log(Object.is(NaN, NaN)) // true
    console.log([NaN].includes(NaN)) // true, SameValueZero
    console.log([NaN].indexOf(NaN)) // -1, no SameValueZero
```
##### Object.assign
浅拷贝。

#### 如何实现一个断言函数？（面试）
```js
    // 实现一个断言函数 assert
    const teacher = "luyi"
    const assert = new Proxy({}, {
        get: function (target, proKey, receiver) {
            return Reflect.get(target, proKey, receiver)
        },
        set: function (target, proKey, value, receiver) {
            if (!value) {
                console.error(proKey)
            }
            return Reflect.set(target, proKey, value, receiver)
        }
    })
    console.log(1)
    assert["the teacher is Luyi!!!"] = (teacher === "yunyin")
    console.log(2)
    assert["the teacher is Luyi!!!"] = (teacher === "luyi")
```

#### proxy / reflect /map /set /symbol
Vue3

##### proxy天生的代理模式

##### reflect
1. 将Objec的一些明显属于语言内部的方法，放到Reflect上;
2. 修改了某些Object 的返回结果，让其变得更合理。
   - Object.defineProperty throw Error
   - Reflect.defineProperty 返回false

##### map、set、weakmap、weakset的区别
- Map 是一个hash结构，Set是一个数组结构
- Weak 都是弱引用
    - GC 不考虑引用关系
    - key 都是对象

#### 实现一个成员函数，并让该函数无法被调用或报错（面试）
```js
    const foos = new WeakSet();
    class Foo {
        constructor() {
            foos.add(this);
        }
        method() {
            if (!foos.has(this)) throw new TypeError("methods只能在Foo实例上调用")
            else console.log("using method")
        }
    }

    // const f = new Foo();
    // f.method();

    let b = {};
    Foo.prototype.method.call(b);
```


##### Symbol
独一无二的属性名

#### 迭代器 -- Iterator
他是一种接口，为各种不同的数据结构，提供统一的访问机制，任何的数据结构只要部署了`Iterator`，就可以完成遍历操作。
- 为各种数据结构，提供一个统一、简单的访问接口
- 使数据结构的成员，按照某种次序排列
- 接口主要供`for...of`消费
- 本质：**指针**

##### 原生具备这些接口的数据结构
- Array
- Map
- Set
- String
- TypedArray
- arguments
- NodeList

- 一个对象如果要具备可被`for...of`循环调用的Iterator接口，就必须在`Symbol.iterator`的属性上，部署遍历生成方法


# es实战

- Svelte 的前端
- 装饰路由

<!-- svelte / expores / koa /observer -->

## koa & express
### express
express是一个后端框架
example
```js
    const express = require("express");
    // node端有一个http的模块（基于net的模块(eventEmitter / stream 的模块)）

    // Vite 1 koa
    // Vite 2 connect

    const app = express();
    const PORT = 3000;

    app.use((req, res, next) => {
        console.log("querying srat 1");
        next();
        console.log("querying end 1");
    })

    app.use((req, res, next) => {
        console.log("querying srat 2");
        next();
        console.log("querying end 2");
    })

    app.use((req, res, next) => {
        console.log("querying srat 3");
        next();
        console.log("querying end 3");
    })

    app.get("/", (req, res) => {
        res.send("hello");
    })

    app.listen(PORT, (req, res) => {
        console.log(`Example listening in port ${PORT}`);
    })
```

koa 是一个后端框架，由exprese 原班人马打造，主要是轻量，插件分了出去

### 尝试 node 使用 esm
- tupe:"module"
- .mjs

#### 本文，我们尝试使用 rollup 对esm 打包，构建成bundle，然后实时执行这个bundle；









> 当领导，一定要克制住帮下属干活的冲动
> 当领导，一定要忍得住看到，下属把自己最擅长的事情干的稀烂
