---
title: NodeAPI
author: 皮明宇
date: 2024.04.01
---


# node API

## node 的内置对象
### Buffer
早起的 js 是没有用于读取或者操作二进制数据流的机制
JS 最初被设计用于处理HTML文档的，而文档主要由字符串组成。

#### 浏览器端
ECMAScript 2015 发布了 TypeArray，更高效的访问和处理二进制
TypedArray 是给 ArrayBuffer 提供写能力的
Blob，File，FileRcader，ArrayBuffer

#### Buffer 的一些概念
Buffer 是一个计算机中的数据流结构，表示的是一个固定长度的缓冲区序列

            --------------------
File -->        Buffer 缓冲区        wait --> 被进程处理
            --------------------

#### Buffer 的 API
##### 声明
```js
    const Buffer = require("Buffer")

    const buf1 = Buffer.alloc(5);  // <Buffer 00 00 00 00 00>
    const buf2 = Buffer.from("地底");  // <Buffer e5 9c b0 e5 ba 95>
    const buf3 = Buffer.from([0xe4, 0xe8, 0x80])

    const arr = [buf1, buf2]

    Array.prototype.forEach.call(arr, (v) => {
        console.log(v)
    })
```

##### 拼接
```js
    const buf4 = Buffer.from("")
    let new_buf = Buffer.alloc(6)
    buf4.copy(new_buf, 0, 0, 2);
    buf2.copy(new_buf, 2, 2, 6);
    console.log(new_buf.toString())
    console.log(buf4)
    console.log(buf2)
```

防御型编程
```js
    let buf5 = Buffer.from([0xe4, 0xe8]);
    let buf6 = Buffer.from([0xe4, 0xe8, 0x80, 0xba]);
    console.log(Buffer.concat([buf5,buf6],6).toString())

```

##### 截取
```js
    console.log(buf4.slice(3,6).toString())
```

##### 类型判断
```js
    Buffer.isBuffer(buf)
```

##### 编解码

##### base64
- 16进制中：a b c d e f,a表示10，f表示15
- 3 个 字节:
0xff 0xff 0xff (11111111 11111111 11111111)
- 111111 | 11,1111 | 1111,11 | 111111
- 00111111 | 00111111 | 00111111 | 00111111
- 这个0-63我们用字母表示
- 一共有64个字符
  | 大写字母 | 小写字母 | 数字  | 加号 | 除号 |
  | -------- | -------- | ----- | ---- | ---- |
  | 0-25     | 26-51    | 52-61 | 62   | 63   |
  | A-Z      | a-z      | 0-9   | +    | /    |
- 以上就是base64字符与二进制的对应


// example

e9 ba 93   ，注意这里的e是14 b是11 a是10

11101001 10111010 10010011

111010 011011 101010 010011

58 27 42 19

6bqT

##### 文件读写

### stream
Buffer 在 大文件的情况下，内存会被淹没

```js
```

### Event 
发布订阅
```js
    new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(1)
        },1000)
    }).then(()=>{
        console.log("xxx");
    })

    // 事件监听
    function EventEmitter() {
        this._events = {};
    }

    EventEmitter.prototype.on = function (eventName, callback) {
        if (!this._events) this._events = {};
        let eventList = this._events[eventName] || (this._events[eventName] = []);
        eventList.push(callback);
    }

    EventEmitter.prototype.emit = function (eventName, ...rest) {
        this._events[eventName] && this._events[eventName].forEach(cb => cb(...rest))
    }

    EventEmitter.prototype.off = function (eventName, callback) {
        if (this._events[eventName]) {
            this._events[eventName] = this._events[eventName].filter(item => item !== callback && item.cb !== callback)
        }
    }

    EventEmitter.prototype.once = function (eventName, callback) {
        const once = (...rest) => {
            callback(...rest);
            this.off(eventName, once);
        }
        once.cb = callback;
    }

    const e = new EventEmitter();
    const handle = function (string) {
        console.log(`hello,${string}`)
    }
    e.on("data", handle);
    setTimeout(() => {
        e.emit("data", "pp")
        e.off("data", handle);
        e.emit("data", "pp2");
    }, 200)
```
内部本质上也有一些发布订阅的逻辑

```js
   

```

#### 发布订阅和观察者的区别



## 事件循环
注意要区分两个东西：
nodejs中 process.nextTick 比 promise的优先级要高
vuejs中 vue.nextTick 跟 promise优先级相同
```js

    async function async1() {
        console.log("async1 started");  //1.2
        await async2();
        console.log("async end")  //微任务2.2
    }
    async function async2() {
        console.log("async2")  //1.3
    }
    console.log("script start.")  //1.1
    setTimeout(() => {
        console.log("setTimeout0"); //宏任务3.1
        setTimeout(() => {
            console.log("setTimeout1"); //宏任务4.1
        }, 0)
        setImmediate(() => {
            console.log("setImmediate"); //宏任务3.2
        })
    }, 0)

    async1();
    process.nextTick(() => {
        console.log("nextTick")   //微任务2.1
    })

    new Promise((resolve) => {
        console.log("Promise1");  //1.4
        resolve();
        console.log("Promise2");  //1.5
    }).then(() => {
        console.log("promise.then") //微任务2.3
    })
    console.log("script end.")  //1.6

```

#### 发布订阅和观察者的区别
观察者 subject -> Observers
Subject.setState() -> subject.notifyAll() -> subject.Observers.update() -> Obervers.update()

发布订阅(无耦合)
     A                         B
[e.emit()] -> e.events() -> [e.on()]