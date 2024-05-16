---
title: promise管理
author: 皮明宇
date: 2024.03.20
---

# promise管理
对pormise函数进行一些额外的操作来实现一些逻辑。

## 定义promise数组
定义一个数组，数组里面都是方法，方法返回一个promise
```js
const interval = 100;
const setPromiseArray = (num) => {
    return Array(num).fill(0).map((val, index) => {
        return () => new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(index)
            }, interval * Math.random())
        })
    })
}
const promiseArr = setPromiseArray(100);
```

## 如何让多个promise方法并行
```js
Promise.all(promiseArr.map(v => v())).then(res => {
    console.log(res)
})
```

## 如何让多个promise方法串行
```js
promiseArr.reduce((pre, cur) => {
    return pre.then(res => {
        console.log(res)
        return cur();
    })
}, Promise.resolve(-1)).then(res => {
    console.log("last index is " + res)
})
```

## 如何设计一个窗口
窗口大小是一个正整数，最多只允许窗口大小的promise并行；
```js
const promisePipe = (promiseArr, windowLen) => {
    if (promiseArr.length <= windowLen) {
        Promise.all(promiseArr.map(v => v())).then(res => {
            console.log(res)
        })
        return
    }
    function run(fn) {
        fn().then(res => {
            console.log(res)
            if (promiseArr.length) run(promiseArr.shift())
        })
    }
    for (let i = 0; i < windowLen; i++) {
        run(promiseArr[i])
    }
}
promisePipe(promiseArr, 10)
```

## 设计一个wrap方法
wrap方法,传入一个promise，函数正常执行的时候返回这个promise的结果，同时随时可以abort promise
```js
const wrap = (promise) => {
    let _reject;
    const obj = Promise.race([promise, new Promise((resolve, reject) => {
        _reject = reject
    })])
    obj.abort = () => {
        _reject("abort");
    }
    return obj
}
const myPromise = new Promise((resovle, reject) => {
    setTimeout(() => {
        resovle("done")
    }, 2000)
})
const myWrap = wrap(myPromise);
myWrap.then(res => {
    console.log(res)
}).catch(e => {
    console.log(e)
})
setTimeout(() => {
    myWrap.abort();
}, 1000)
```

<span style="color:red">注意：</span>

这里的pormise虽然看起来好像直接放弃了那个函数，但实际上他已经执行完了,看例子：

```js
const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(1)
        resolve('Promise 1 resolved');
    }, 1500);
});

const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(2)
        resolve('Promise 2 resolved');
    }, 500);
});

const promise3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(3)
        reject(new Error('Promise 3 rejected'));
    }, 1000);
});

Promise.race([promise1, promise2, promise3])
    .then((value) => {
        console.log('Resolved:', value);
    })
    .catch((error) => {
        console.error('Rejected:', error.message);
});
```

::: details 结果
```js
// 2
// Resolved: Promise 2 resolved
// 1
// 3
```
:::