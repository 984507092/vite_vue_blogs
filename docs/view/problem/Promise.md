---
title: promse相关
author: 皮明宇
date: 2024.03.19
---

# promise手写

## promise基础规则

1. Promise是一个构造函数
2. Promise接受一个函数，同时这个函数接收两个参数 (resolve,reject)，他们也是函数
3. Promise返回的对象，包含一个then函数，then函数接收两个参数，一般他们也是函数
4. 在使用new关键字调用 Promise 构造函数时，在结束的时候
     如果正确执行，调用resolve方法，将结果放在resolve的参数中执行，这个结果可以在then中的第一个函数参数(onFulfilled)中拿到
     如果错误执行，调用reject方法，将结果放在reject的参数中执行，这个结果可以在then中的第一个函数参数(onRejected)中拿到

[rule--]

Promise 的 status:
1. `pending`
- 初始的状态，可改变，
- 一个promise 在`resolve’`/`reject`前都处于这个状态
- 我们可以通过调用`resolve’`方法或`reject`方法，让这个promise，变成`fulfilled`/`rejected`状态;
  
2. `fulfilled`
- 不可变状态
- 在`resolve`之后，变成这个状态，拥有一个`value`

3. `rejected`
- 不可变状态
- 在`reject`之后，变成这个状态，拥有一个`reason`

then函数：
1. 参数:
`onFulfilled`必须是函数类型，如果不是，应该被忽略;
`onRejected`必须是函数类型，如果不是，应该被忽略;
2. onFulfilled / onRejected 的特性
在 promise 变成`fulfilled`/`rejected`状态的时候，应该调用`onFulfilled`/`onRejected`;
在 promise 变成`fulfilled`/`rejected`状态之前，不应该被调用;
只能被调用一次。

[--rule]

## 一、申明promise类
进行初始化的一些操作

```js
function MyPromise(callback) {
    // 初始化状态为 pending
    this.status = 'pending';
    // 初始化成功状态的值
    this.value = undefined;
    // 初始化失败状态的值
    this.reason = undefined;

    // 定义 resolve 函数
    this.resolve = value => {
        if (this.status === 'pending') {
            // 更新状态为 fulfilled
            this.status = 'fulfilled';
            // 存储成功状态的值
            this.value = value;
        }
    };

    // 定义 reject 函数
    this.reject = reason => {
        if (this.status === 'pending') {
            // 更新状态为 rejected
            this.status = 'rejected';
            // 存储失败状态的值
            this.reason = reason;
        }
    };

    // 调用回调函数，将 resolve 和 reject 传递给它
    callback(this.resolve, this.reject);
}
```

## 二、写then方法

onFulfilled和onRejected分别是用户自己定义的成功和失败的回调方法

但是并非无脑执行，只有状态对应`fulfilled`/`rejected`，所以需要进行一个发布订阅

```js
function MyPromise(callback) {
    // 存储成功状态的回调函数
    this.onFulfilledCallbacks = [];
    // 存储失败状态的回调函数
    this.onRejectedCallbacks = [];
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason };

    // 创建一个新的 Promise 对象
    const promise2 = new MyPromise((resolve, reject) => {
        if (this.status === 'fulfilled') {
            try {
                // 执行 onFulfilled 回调函数
                const x = onFulfilled(this.value);
                // 处理返回值
                resolve(x);    
            } catch (error) {
                // 如果回调函数抛出异常，将异常作为失败状态的值
                reject(error);
            }
        } 
        if (this.status === 'rejected') {
            try {
                // 执行 onRejected 回调函数
                const x = onRejected(this.reason);
                // 处理返回值
                resolve(x);
            } catch (error) {
                // 如果回调函数抛出异常，将异常作为失败状态的值
                reject(error);
            }
        }  
        if (this.status === 'pending') {
            // 将 onFulfilled 和 onRejected 保存起来
            // 等待异步操作完成后再执行
            this.onFulfilledCallbacks.push(() => {
                if (this.status === 'fulfilled') {
                    try {
                        // 执行 onFulfilled 回调函数
                        const x = onFulfilled(this.value);
                        // 处理返回值
                        resolve(x);
                    } catch (error) {
                        // 如果回调函数抛出异常，将异常作为失败状态的值
                        reject(error);
                    }
                }
            });

            this.onRejectedCallbacks.push(() => {
                if (this.status === 'rejected') {
                    try {
                        // 执行 onRejected 回调函数
                        const x = onRejected(this.reason);
                        // 处理返回值
                        resolve(x);
                    } catch (error) {
                        // 如果回调函数抛出异常，将异常作为失败状态的值
                        reject(error);
                    }
                }
            });
        } else {
            // 执行完所有回调函数之后，清空回调数组
            this.onFulfilledCallbacks = [];
            this.onRejectedCallbacks = [];
        }
    });
    // 返回新的 Promise 对象
    return promise2;
}
```
[qestion] 

[rule--]

onFulfilledCallbacks 和 onRejectedCallbacks为什么是数组？
- 因为then可以被链式调用，且是按照then的顺序执行，或者说注册顺序
- 同时数组每个内容都应该是一个promise
  
[--rule]

## 三、写catch方法
```js
class MyPromise {
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}
```

## 四、测试
- 完整代码
```js
function MyPromise(callback) {
    // 初始化状态为 pending
    this.status = 'pending';
    // 初始化成功状态的值
    this.value = undefined;
    // 初始化失败状态的值
    this.reason = undefined;
    // 存储成功状态的回调函数
    this.onFulfilledCallbacks = [];
    // 存储失败状态的回调函数
    this.onRejectedCallbacks = [];

    // 定义 resolve 函数
    this.resolve = value => {
        if (this.status === 'pending') {
            // 更新状态为 fulfilled
            this.status = 'fulfilled';
            // 存储成功状态的值
            this.value = value;
            // 执行所有成功状态的回调函数
            this.onFulfilledCallbacks.forEach(cb => cb());
        }
    };

    // 定义 reject 函数
    this.reject = reason => {
        if (this.status === 'pending') {
            // 更新状态为 rejected
            this.status = 'rejected';
            // 存储失败状态的值
            this.reason = reason;
            // 执行所有失败状态的回调函数
            this.onRejectedCallbacks.forEach(cb => cb());
        }
    };

    // 调用回调函数，将 resolve 和 reject 传递给它
    try {
        callback(this.resolve, this.reject);
    } catch (error) {
        reject(error);
    }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason };

    // 创建一个新的 Promise 对象
    const promise2 = new MyPromise((resolve, reject) => {
        if (this.status === 'fulfilled') {
            try {
                // 执行 onFulfilled 回调函数
                const x = onFulfilled(this.value);
                // 处理返回值
                resolve(x);
            } catch (error) {
                // 如果回调函数抛出异常，将异常作为失败状态的值
                reject(error);
            }
        }  
        if (this.status === 'rejected') {
            try {
                // 执行 onRejected 回调函数
                const x = onRejected(this.reason);
                // 处理返回值
                resolve(x);
            } catch (error) {
                // 如果回调函数抛出异常，将异常作为失败状态的值
                reject(error);
            }
        }  
        if (this.status === 'pending') {
            // 将 onFulfilled 和 onRejected 保存起来
            // 等待异步操作完成后再执行
            this.onFulfilledCallbacks.push(() => {
                if (this.status === 'fulfilled') {
                    try {
                        // 执行 onFulfilled 回调函数
                        const x = onFulfilled(this.value);
                        // 处理返回值
                        resolve(x);
                    } catch (error) {
                        // 如果回调函数抛出异常，将异常作为失败状态的值
                        reject(error);
                    }
                }
            });

            this.onRejectedCallbacks.push(() => {
                if (this.status === 'rejected') {
                    try {
                        // 执行 onRejected 回调函数
                        const x = onRejected(this.reason);
                        // 处理返回值
                        resolve(x);
                    } catch (error) {
                        // 如果回调函数抛出异常，将异常作为失败状态的值
                        reject(error);
                    }
                }
            });
        } else {
            // 执行完所有回调函数之后，清空回调数组
            this.onFulfilledCallbacks = [];
            this.onRejectedCallbacks = [];
        }
    });
    // 返回新的 Promise 对象
    return promise2;
}

MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}
```

- 测试一下
```js
const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log('1')
        resolve('成功')
    }, 1000)
})

promise.then(value => {
    console.log(value)
    return "第一次"
}).then(value => {
    console.log(value)
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('第二次处理结果');
        }, 1000);
    });
}).then(value => {
    console.log(value);
    throw new Error('抛出异常');
}).catch(error => {
    console.log("到最后了:" + error);
});
```

::: details 执行结果
```js
// 1
// 成功
// 第一次
// MyPromise {
//   status: 'pending',
//   value: undefined,
//   reason: undefined,
//   onFulfilledCallbacks: [],
//   onRejectedCallbacks: [],
//   resolve: [Function (anonymous)],
//   reject: [Function (anonymous)]
// }
// 到最后了:Error: 抛出异常
```
<span style="color:red">注意到存在一个MyPromise没有被处理</span>
:::

[qestion] 

why?

实际上,下文中的话应该进行改写：

resolve(x) =>  resolvePromise(promise2, x, resolve,reject)

[rule--] 

--- 下文看看就行，不需要记忆 ---
resolvePromise 的规范：
- 如果 promise2和x相等，那么 reject TypeError
- 如果 x 是一个 promise
    如果 x 是 pending 态，那么 promise 必须要在 pending,直到 x 变成 fulfilled or rejected.
    如果 x 被 fulfilled,fulfill promise with the same value.
    如果 x 被 rejected,reject promise with the same reason.
- 如果 x 是一个 object 或者 是一个 function
    let then =x.then.
    如果 x.then 这步出错，那么 reject promise with e as the reason.
    如果 then 是一个函数,then.call(x,resolvePromiseFn,rejectPromise)
        resolvePromiseFn的入参是y，执行resolvePromise(promise2，y，resolve，reject);
        rejectPromise的入参是r,reject promise with r.
        如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
        如果调用then抛出异常e
            如果 resolvePromise或rejectPromise 已经被调用，那么忽略
            否则，reject promise with e as the reason
    如果 then不是-个function.fulfill promise with x.

[--rule]



## 五、所以最终版本
```js
function MyPromise(callback) {
    // 初始化状态为 pending
    this.status = 'pending';
    // 初始化成功状态的值
    this.value = undefined;
    // 初始化失败状态的值
    this.reason = undefined;
    // 存储成功状态的回调函数
    this.onResolvedCallbacks = [];
    // 存储失败状态的回调函数
    this.onRejectedCallbacks = [];

    // 定义 resolve 函数
    this.resolve = value => {
        if (this.status === 'pending') {
            // 更新状态为 fulfilled
            this.status = 'fulfilled';
            // 存储成功状态的值
            this.value = value;
            // 执行所有成功状态的回调函数
            this.onResolvedCallbacks.forEach(cb => cb());
        }
    };

    // 定义 reject 函数
    this.reject = reason => {
        if (this.status === 'pending') {
            // 更新状态为 rejected
            this.status = 'rejected';
            // 存储失败状态的值
            this.reason = reason;
            // 执行所有失败状态的回调函数
            this.onRejectedCallbacks.forEach(cb => cb());
        }
    };

    // 调用回调函数，将 resolve 和 reject 传递给它
    try {
        callback(this.resolve, this.reject);
    } catch (error) {
        reject(error);
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    // 如果 promise2 和 x 是同一个对象，则抛出一个类型错误，因为这样会导致循环引用
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // 判断 x 是否是一个 Promise 实例
    if (x instanceof MyPromise) {
        // 如果 x 是一个 Promise 实例，则执行 x，并在其 resolve 或 reject 后再执行 promise2 的 resolve 或 reject
        x.then(function (value) {
            resolve(value);
        }, function (reason) {
            reject(reason);
        });
    } else if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        // 如果 x 不是一个 Promise 实例 ，是一个对象或者函数
        let then;
        try {
            then = x.then;
        } catch (e) {
            // 如果获取 then 属性时抛出异常，则直接 reject 这个异常
            return reject(e);
        }
        if (typeof then === 'function') {
            // 如果 then 是一个函数，则将 x 作为 this 执行 then 函数
            let called = false;
            try {
                then.call(x, function (y) {
                    // 如果 then 被调用过，则忽略后续调用
                    if (called) return;
                    called = true;
                    // 递归调用 resolvePromise，直到解析出一个普通值
                    resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    // 如果 then 被调用过，则忽略后续调用
                    if (called) return;
                    called = true;
                    // 如果调用 then 的过程中出现异常，则将异常作为原因 reject promise2
                    reject(r);
                });
            } catch (e) {
                // 如果在调用 then 的过程中抛出异常，则如果 then 还未被调用过，则将异常作为原因 reject promise2
                if (called) return;
                reject(e);
            }
        } else {
            // 如果 x 是一个普通对象，则直接 resolve x
            resolve(x);
        }
    } else {
        // 如果 x 是一个普通值，则直接 resolve x
        resolve(x);
    }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason };

    // 创建一个新的 Promise 对象
    const promise2 = new MyPromise((resolve, reject) => {
        if (this.status === 'fulfilled') {
            try {
                // 执行 onFulfilled 回调函数
                const x = onFulfilled(this.value);
                // 处理返回值
                resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
                // 如果回调函数抛出异常，将异常作为失败状态的值
                reject(error);
            }
        } 
        if (this.status === 'rejected') {
            try {
                // 执行 onRejected 回调函数
                const x = onRejected(this.reason);
                // 处理返回值
                resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
                // 如果回调函数抛出异常，将异常作为失败状态的值
                reject(error);
            }
        } 
        if (this.status === 'pending') {
            // 将 onFulfilled 和 onRejected 保存起来
            // 等待异步操作完成后再执行
            this.onResolvedCallbacks.push(() => {
                if (this.status === 'fulfilled') {
                    try {
                        // 执行 onFulfilled 回调函数
                        const x = onFulfilled(this.value);
                        // 处理返回值
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        // 如果回调函数抛出异常，将异常作为失败状态的值
                        reject(error);
                    }
                }
            });

            this.onRejectedCallbacks.push(() => {
                if (this.status === 'rejected') {
                    try {
                        // 执行 onRejected 回调函数
                        const x = onRejected(this.reason);
                        // 处理返回值
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        // 如果回调函数抛出异常，将异常作为失败状态的值
                        reject(error);
                    }
                }
            });
        } else {
            // 执行完所有回调函数之后，清空回调数组
            this.onResolvedCallbacks = [];
            this.onRejectedCallbacks = [];
        }
    });
    // 返回新的 Promise 对象
    return promise2;
}


MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}
const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log('1')
        resolve('成功')
    }, 1000)
})
promise.then(value => {
    console.log(value)
    return "第一次"
}).then(value => {
    console.log(value)
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('第二次处理结果');
        }, 1000);
    });
}).then(value => {
    console.log(value);
    throw new Error('抛出异常');
}).catch(error => {
    console.log("到最后了:" + error);
});
```

::: details 执行结果
```js
// 1
// 成功
// 第一次
// 第二次处理结果
// 到最后了:Error: 抛出异常
```
<span style="color:green">完结撒花</span>
:::