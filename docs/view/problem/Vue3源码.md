---
title: Vue3源码
author: 皮明宇
date: 2024.04.17
---

# Vue3源码

## compiler-core
vue3 编译的核心，字符串模板转AST，最后渲染成真是的代码块

## reactivity
isReadOnly isReactive ref isRef

Q:为什么reactiveMap使用weakMap定义？

A:

1. weakMap接受对象类型作为key
 
2. 无引用会被回收

## runtime-dom
Vue3实现了VNode组成的VDOM，天然的支持了跨平台的能力，runtime-dom为跨平台提供了渲染器的能力

## runtime-test
runtime-dom的延展，是对外提供runtime-dom的环境的测试，是为了方便测试runtime-core

## 实现一个响应式

实现一个effect来实现{{a}}这个形式的响应式功能。

### 版本1
```js
const bucket = new WeakMap()
// 重新定义bucket数据类型为WeakMap
let activeEffect
const effect = function (fn) {
  activeEffect = fn
  fn()
}
// 追踪
function track (target, key) {
  // activeEffect无值意味着没有执行effect函数，无法收集依赖，直接return掉
  if (!activeEffect) {
    return
  }
  // 每个target在bucket中都是一个Map类型： key => effects
  let depsMap = bucket.get(target)
  // 第一次拦截，depsMap不存在，先创建联系
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  // 根据当前读取的key，尝试读取key的effects函数  
  let dep = depsMap.get(key)
  if (!dep) {
    // dep本质是个Set结构，即一个key可以存在多个effect函数，被多个effect所依赖
    depsMap.set(key, (dep = new Set()))
  }
  if(!dep.has(activeEffect)){
    // 将激活的effectFn存进桶中
    dep.add(activeEffect)
  }
}
// trigger执行依赖
function trigger (target, key) {
  // 读取depsMap 其结构是 key => effects
  const depsMap = bucket.get(target)
  if (!depsMap) {
    return
  }
  // 真正读取依赖当前属性值key的effects
  const effects = depsMap.get(key)
  // 挨个执行即可
  effects && effects.forEach((fn) => fn())
}
// 统一对外暴露响应式函数
function reactive (state) {
  return new Proxy(state, {
    get (target, key) {
      const value = target[ key ]
      track(target, key)
      return value
    },
    set (target, key, newValue) {
      target[ key ] = newValue
      trigger(target, key)
    }
  })
}
```

```js
const data = reactive({name:'foo'})
effect(()=>{
    console.log(`我变化了`+data.name);
})
data.name = 'foo2'
```

### 版本2
上述有一个什么问题呢，执行下面代码会多执行一次：

```js
const state = reactive({
    ok: true,
    text: 'hello world',
});

effect(() => {
    console.log('渲染执行')
    console.log(state.ok ? state.text : 'not')
})

setTimeout(() => {
    state.ok = false // 此时页面变成了not
    setTimeout(() => {
        state.text = 'other' // 页面依然是not，但是副作用函数却还会执行一次
    }, 1000)
}, 1000)
```

为了解决这个问题，可以清空依赖重新收集一次，而调用`effect`本身就会重新收集依赖

所以需要修改`effect`和`track`以及`trigger`

```js
const bucket = new WeakMap()
// 重新定义bucket数据类型为WeakMap
let activeEffect
const effect = function (fn) {
    const effectFn = function () { 
        cleanup(effectFn)  // [!code ++]
        activeEffect = effectFn; 
        fn() 
    } 
    effectFn.deps = []; // [!code ++]
    // 在这里执行一次_effect，这样可以触发proxy的get执行dep收集
    effectFn()
}

function cleanup(effectFn) {  // [!code ++]
    const { deps } = effectFn  // [!code ++]
    for (let i = 0; i < deps.length; i++) {  // [!code ++]
        deps[i].delete(effectFn)  // [!code ++]
    }  // [!code ++]
    deps.length = 0  // [!code ++]
} // [!code ++]

// 追踪 
function track(target, key) {
    // activeEffect无值意味着没有执行effect函数，无法收集依赖，直接return掉
    if (!activeEffect) {
        return
    }
    // 每个target在bucket中都是一个Map类型： key => effects
    let depsMap = bucket.get(target)
    // 第一次拦截，depsMap不存在，先创建联系
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    // 根据当前读取的key，尝试读取key的effects函数  
    let dep = depsMap.get(key)
    if (!dep) {
        // dep本质是个Set结构，即一个key可以存在多个effect函数，被多个effect所依赖
        depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        // 收集当前激活的 effect 作为依赖
        dep.add(activeEffect)
        // 当前激活的 effect 收集 dep 集合作为依赖
        activeEffect.deps.push(dep)  // [!code ++]
    }
}
// trigger执行依赖
function trigger(target, key) {
    // 读取depsMap 其结构是 key => effects
    const depsMap = bucket.get(target)
    if (!depsMap) return
    // 真正读取依赖当前属性值key的effects
    const effects = depsMap.get(key)

    // 再使用这个会无限循环，因为cleanup清空了effects,同时fn执行又添加了新的fn
    // effects && effects.forEach((fn) => fn())

    // 解决cleanup无限执行就很简单了，直接取出来执行就好，
    // 源码里面是定义了一个add方法循环effects取出来的
    const effectsToRun = new Set(effects)  // [!code ++]
    // 挨个执行即可
    effectsToRun.forEach((fn) => fn());  // [!code ++]
}
// 统一对外暴露响应式函数
function reactive(state) {
    return new Proxy(state, {
        get(target, key) {
            const value = target[key]
            track(target, key)
      
            return value
        },
        set(target, key, newValue) {                 
            target[key] = newValue
            trigger(target, key)
        }
    })
}
```

### 版本3

此时还不支持effect嵌套，首先要知道vue中组件执行：
```js
const Foo = {
  render () {
    return // ....
  }
}

effect(() => {
  Foo.render()
})
```

当组件发生嵌套时，就会存在effect嵌套:
```js
const Bar = {
  render () {
    return // ....
  }
}
const Foo = {
  render () {
    return <Bar /> // ...
  }
}
```

```js
effect(() => {
  Foo.render()
  
  effect(() => {
    Bar.render()
  })
})

```

在版本2代码中执行以下代码：
```js
const state = reactive({
    foo: true,
    bar: true
})

effect(function effectFn1() {
    console.log('effectFn1')

    effect(function effectFn2() {
        console.log('effectFn2')
        console.log('Bar', state.bar)
    })

    console.log('Foo', state.foo)
})

state.foo = false;

state.bar = false;
```

会发现输出是：
```js
// effectFn1
// effectFn2
// Bar true
// Foo true
// effectFn2
// Bar true
// effectFn2
// Bar false
```

问题来了，修改foo为什么也是输出bar呢？

很明显是因为activeEffect的问题导致的，当`effectFn1`执行的时候会后执行`effectFn2`；

那么我等`effectFn2`执行完再指向`effectFn1`不就好了，这就是一个栈顶指针！！！

所以我们对`effcet`做一下修改：

```js
const bucket = new WeakMap()
// 重新定义bucket数据类型为WeakMap
let activeEffect
const effectStack = []   // [!code ++]
const effect = function (fn) {
    const effectFn = function () {
        cleanup(effectFn)
        activeEffect = effectFn  
        effectStack.push(effectFn)  // [!code ++]
        fn()
        effectStack.pop()  // [!code ++]
        activeEffect = effectStack[effectStack.length - 1]  // [!code ++]
    }
    effectFn.deps = [];

    // 在这里执行一次_effect，这样可以触发proxy的get执行dep收集
    effectFn()
}
function cleanup(effectFn) {
    const { deps } = effectFn
    for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effectFn)
    }
    deps.length = 0
}
// 追踪
function track(target, key) {
    // activeEffect无值意味着没有执行effect函数，无法收集依赖，直接return掉
    if (!activeEffect) {
        return
    }
    // 每个target在bucket中都是一个Map类型： key => effects
    let depsMap = bucket.get(target)
    // 第一次拦截，depsMap不存在，先创建联系
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    // 根据当前读取的key，尝试读取key的effects函数  
    let dep = depsMap.get(key)
    if (!dep) {
        // deps本质是个Set结构，即一个key可以存在多个effect函数，被多个effect所依赖
        depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        // 收集当前激活的 effect 作为依赖
        dep.add(activeEffect)
        // 当前激活的 effect 收集 dep 集合作为依赖
        activeEffect.deps.push(dep)
    }
}
// trigger执行依赖
function trigger(target, key) {
    // 读取depsMap 其结构是 key => effects
    const depsMap = bucket.get(target)
    if (!depsMap) return
    // 真正读取依赖当前属性值key的effects
    const effects = depsMap.get(key)

    // 再使用这个会无限循环，因为cleanup清空了effects,同时fn执行又添加了新的fn
    // effects && effects.forEach((fn) => fn())

    // 解决cleanup无限执行就很简单了，直接取出来执行就好，'
    // 源码里面是定义了一个add方法循环effects取出来的
    const effectsToRun = new Set(effects)
    // 挨个执行即可
    effectsToRun.forEach((fn) => fn());
}
// 统一对外暴露响应式函数
function reactive(state) {
    return new Proxy(state, {
        get(target, key) {
            const value = target[key]
            track(target, key)      
            return value
        },
        set(target, key, newValue) {            
            target[key] = newValue
            trigger(target, key)
        }
    })
}

const state = reactive({
    foo: true,
    bar: true
})

effect(function effectFn1() {
    console.log('effectFn1')

    effect(function effectFn2() {
        console.log('effectFn2')
        console.log('Bar', state.bar)
    })

    console.log('Foo', state.foo)
})

setTimeout(() => {
    state.foo = false
}, 1000)
```

最后的输出：
```js
// effectFn1
// effectFn2
// Bar true
// Foo true
// effectFn1
// effectFn2
// Bar true
// Foo false
```
实际上我觉得这里的输出还是存在其他问题的，为什么要输出bar，

未完待续研究吧。

### 版本4

但是我们可以聊一聊调度性，即自主控制副作用函数执行的时机。

```js

const bucket = new WeakMap()
// 重新定义bucket数据类型为WeakMap
let activeEffect
const effectStack = []
const effect = function (fn, options = {}) {  // [!code ++]
    const effectFn = function () {
        cleanup(effectFn)
        activeEffect = effectFn

        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    // 将options参数挂在effectFn上，便于effectFn执行时可以读取到scheduler
    effectFn.options = options  // [!code ++]
    // 在这里执行一次_effect，这样可以触发proxy的get执行dep收集
    effectFn()
}
function cleanup(effectFn) {
    const { deps } = effectFn
    for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effectFn)
    }
    deps.length = 0
}
// 追踪
function track(target, key) {
    // activeEffect无值意味着没有执行effect函数，无法收集依赖，直接return掉
    if (!activeEffect) {
        return
    }
    // 每个target在bucket中都是一个Map类型： key => effects
    let depsMap = bucket.get(target)
    // 第一次拦截，depsMap不存在，先创建联系
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    // 根据当前读取的key，尝试读取key的effects函数  
    let dep = depsMap.get(key)

    if (!dep) {
        // deps本质是个Set结构，即一个key可以存在多个effect函数，被多个effect所依赖
        depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        // 收集当前激活的 effect 作为依赖
        dep.add(activeEffect)
        // 当前激活的 effect 收集 dep 集合作为依赖
        activeEffect.deps.push(dep)
    }
}
// trigger执行依赖
function trigger(target, key) {
    // 读取depsMap 其结构是 key => effects
    const depsMap = bucket.get(target)

    if (!depsMap) return

    // 真正读取依赖当前属性值key的effects
    const effects = depsMap.get(key)

    const effectsToRun = new Set(effects)

    const run = (effectFn) => {   // [!code ++]
        if (effectFn.options.scheduler) {   // [!code ++]
            effectFn.options.scheduler(effectFn)   // [!code ++]
        } else {   // [!code ++] 
            effectFn()   // [!code ++]
        }   // [!code ++]
    }   // [!code ++]
  
    // 挨个执行即可
    effectsToRun.forEach(run);   // [!code ++]
}
// 统一对外暴露响应式函数
function reactive(state) {
    return new Proxy(state, {
        get(target, key) {
            const value = target[key]
            track(target, key)
      
            return value
        },
        set(target, key, newValue) {
            
            
            target[key] = newValue
            trigger(target, key)
        }
    })
}

const jobQueue = new Set()   // [!code ++]
const p = Promise.resolve()   // [!code ++]
let isFlushing = false   // [!code ++]

const flushJob = () => {   
    if (isFlushing)  return  // [!code ++]    

    isFlushing = true  // [!code ++]
    // 微任务
    p.then(() => {  // [!code ++]
        jobQueue.forEach((job) => job())  // [!code ++]
    }).finally(() => {  // [!code ++]
        // 结束后充值设置为false
        isFlushing = false  // [!code ++]
    })  // [!code ++]
}

const state = reactive({
    num: 1
})

effect(() => {
    console.log('num', state.num)
}, {
    scheduler(fn) {
        // 每次数据发生变化都往队列中添加副作用函数
        jobQueue.add(fn)
        // 并尝试刷新job，但是一个微任务只会在事件循环中执行一次，
        // 所以哪怕num变化了100次，最后也只会执行一次副作用函数
        flushJob()
    }
})

let count = 100

while (count--) {
    state.num++
}
```

输出为：
```js
// num 1
// num 101
```

## 继续,computed

他有什么炫酷的特效么：
1. 依赖追踪
2. 缓存结果
3. 懒计算(如果不被引用,就不会执行,坑过我很多次了，一度以为热更新失效了)
   
### 懒计算
```js
const state = reactive({
  a: 1,
  b: 2,
  c: 3
})
// 有没有很像计算属性的感觉
const sum = effect(() => {
  console.log('执行计算') // 立刻被打印
  const value = state.a + state.b
  return value
})

console.log(sum) // undefined
```

诶嘿没有值，那么要解决咋搞捏，很明显搞个主动触发函数，并且返回一个返回值就行了。

```js
const effect = function (fn, options = {}) {
  const effectFn = () => {
    // ... 省略
    // 新增res存储fn执行的结果
    const res = fn()
    // ... 省略
    // 新增返回结果
    return res
  }
  // ... 省略
  // 新增，只有lazy不为true时才会立即执行
  if (!options.lazy) {
    effectFn()
  }
  // 新增，返回副作用函数让用户执行
  return effectFn
}
```

```js
const state = reactive({
    a: 1,
    b: 2,
    c: 3,
});
// 有没有很像计算属性的感觉
const sum = effect(() => {
    console.log("执行计算"); // 调用sum函数后被打印
    const value = state.a + state.b;
    return value;
}, {
    lazy: true
});
// 不执行sum函数，effect注册的回调将不会执行
console.log(sum()); // 3
```

### 依赖追踪

首先封装一个function：
```js
function computed (getter) {
  const effectFn = effect(getter, {
    lazy: true,
  })

  const obj = {
    get value () {
      return effectFn()
    }
  }

  return obj
}
```

测试一下

```js
const state = reactive({
    a: 1,
    b: 2,
    c: 3
})

const sum = computed(() => {
    console.log('执行计算')
    return state.a + state.b
})

console.log(sum.value)
console.log(sum.value)
```

```js
// 执行计算
// 3
// 执行计算
// 3
```

### 缓存
特性：
1. 只有当其依赖的东西发生变化了才需要重新计算
2. 否则就返回上一次执行的结果

缓存上次的结果很简单，搞个值存一下就好了，熟悉的`dirty`来了；

但是怎么知道依赖变化了重新计算？

```js
function computed (getter) {
  const effectFn = effect(getter, {
    lazy: true,
  })
  let value
  let dirty = true

  const obj = {
    get value () {
      // 只有数据发生变化了才去重新计算
      if (dirty) {
        value = effectFn()
        dirty = false
      }

      return value
    }
  }

  return obj
}
```

试一试？

```js
const state = reactive({
    a: 1,
    b: 2,
    c: 3
})

const sum = computed(() => {
    console.log('执行计算')
    return state.a + state.b
})

console.log(sum.value) // 3

state.a = 4

console.log(sum.value) // 3 答案是错误的
```

当然就算这个也只会执行一次，dirty什么时候变回去呢？

答案是引入强大的调度器。

```js
function computed (getter) {
  const effectFn = effect(getter, {
    lazy: true,
    // 数据发生变化后，不执行注册的回调，而是执行scheduler
    scheduler () {
      // 数据发生了变化后，则重新设置为dirty，那么下次就会重新计算
      dirty = true
    }
  })
  let value
  let dirty = true

  const obj = {
    get value () {
      // 只有数据发生变化了才去重新计算
      if (dirty) {
        value = effectFn()
        dirty = false
      }

      return value
    }
  }

  return obj
}
```

再试一下：
```js
const state = reactive({
    a: 1,
    b: 2,
    c: 3
})

const sum = computed(() => {
    console.log('执行计算')
    return state.a + state.b
})

console.log(sum.value) // 3

state.a = 4

console.log(sum.value) // 6 好了
```

## watch

watch可以直接监听一个对象，也可以监听对象的一个属性，这就不演示了，直接上Faker和四个菜：

```js
const state = reactive({
    name: '111'
})

effect(() => {
    // 原本state发生变化之后，应该执行这里
    console.log("raw:" + state.name)
}, {
    // 但是指定scheduler之后，会执行这里
    scheduler() {
        console.log("scheduler:" +state.name)
    }
})

state.name = '222'
```

结果：
```js
// raw:111
// scheduler:222
```

### 支持单属性+回调
```js
const watch = (source, cb) => {
  effect(source, {
    scheduler () {
      cb()
    },
  })
}

// 测试一波
const state = reactive({
  name: '111',
})

watch(() => state.name, () => {
  console.log('state.name发生了变化', state.name)
})

state.name = '222'
```

### 支持对象+回调
实际上就是把对象的所有属性全部都拿出来，然后再跟上边一样就好

搞一个广度优先遍历拿到所有属性：

```js
const watch = (source, cb) => {
    let getter
    // 处理传回调的方式
    if (typeof source === "function") {
        getter = source
    } else {
        // 封装成读取source对象的函数，触发任意一个属性的getter，进而搜集依赖
        getter = () => bfs(source)
    }
    const effectFn = effect(getter, {
        scheduler() {
            cb()
        }
    })
}

const bfs = (obj, callback) => {
    const queue = [obj]
    while (queue.length) {
        const top = queue.shift()
        if (top !== null && typeof top === 'object') {
            for (let key in top) {
                // 读取操作出发getter，完成依赖搜集
                queue.push(top[key])
            }
        } else {
            callback && callback(top)
        }
    }
}
```

```js
const state = reactive({
    name: "111",
    age: 100,
    obj2: {
        name: "222",
        age: 10,
    },
})

watch(state, () => {
    console.log("state发生变化了");
});

console.log("第一层");
state.name = 1

console.log("第二层");
state.obj2.name = 2
```

结果发现 `state.obj2.name = 2` 这里并没有触发watch

实际上，上文中的 `bucket` 是这样的：

<img src="/docs/public/vue/bucket.png"> 

问题在哪呢，打断点会发现，诶？关键问题在于`reactive`函数中，他把对象也当属性塞进去了，那咋搞呢？递归！！！

```js
function reactive(state) {
    return new Proxy(state, {
        get(target, key) {
            const value = target[key]
            // 这里要注意无论key是对象还是string等都要劫持
            // 否则你的属性后面跟着对象，你把这个属性改成5，监测不到
            track(target, key)
            if (value !== null && typeof value === 'object') {  // [!code ++]
                return reactive(value)  // [!code ++]
            }  // [!code ++]
            return value
        },
        set(target, key, newValue) {
            
            target[key] = newValue
            trigger(target, key)
        }
    })
}
```

再试一次上面测试用例就好咯，个中具体原因自己打断点研究吧。

### 新值和旧值
别忘了这个还没实现，那么上代码：
```js
const watch = (source, cb) => {
    let getter, oldValue, newValue    // [!code ++]
    // 处理传回调的方式
    if (typeof source === "function") {
        getter = source
    } else {
        // 封装成读取source对象的函数，触发任意一个属性的getter，进而搜集依赖
        getter = () => bfs(source)   
    }
    const effectFn = effect(getter, {
        scheduler() {
            newValue = effectFn()    // [!code ++]
            cb(newValue, oldValue)    // [!code ++]
            oldValue = newValue    // [!code ++]
        }
    })
    // 第一次执行获取值
    oldValue = effectFn()    // [!code ++]
}
```

```js
const state = reactive({
    name: "111",
    age: 100,
    obj2: {
        name: "222",
        age: 10,
    },
})

watch(() => state.obj2.name, (oVal, newVal) => {
    console.log("发生变化了" + oVal + "||" + newVal);  // 发生变化了222||1
});
state.obj2.name = 1
```

### 立即调用

```js
const watch = (source, cb, options = {}) => {
    let getter, oldValue, newValue
    // 处理传回调的方式
    if (typeof source === "function") {
        getter = source
    } else {
        getter = () => bfs(source)
    }
    const job = () => {  // [!code ++]
        // 变化后获取新值
        newValue = effectFn()
        cb(newValue, oldValue)
        // 执行回调后将新值设置为旧值
        oldValue = newValue
    }

    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            job()  // [!code ++]
        }
    })
    // 如果指定了立即执行，便执行第一次
    if (options.immediate) {
        job()  // [!code ++]
    } else {
        oldValue = effectFn()
    }
}
```

测试：

```js
watch(() => state.obj2.name, (oVal, newVal) => {
    console.log("发生变化了" + oVal + "||" + newVal);
}, { immediate: true });
state.obj2.name = 1

// 发生变化了222||undefined
// 发生变化了1||222
```

未完待续，比如`deep`,或者`source`传递一个数组都没实现，下次一定