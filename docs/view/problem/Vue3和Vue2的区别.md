---
title: Vue3和Vue2的区别
date: 2024.04.15
---

# Vue2、3响应式对比

- Vue2: Object.definProperty 重写getter setter 不能监听数组长度的变化
- Vue3: Proxy

## this.$set

Vue.set(target, key, value)

- target:要修改的数据源
- key:要修改、要添加的属性名
- value: 对应key的值

实现逻辑：

1. 如果target时是undefined、null、基础类型，直接报错
2. 对于数组，[1,2] => [3,2] // [1,2].splice(0,1,3)

```js
// 数组的处理
if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(tanget.length, key)
    target.splice(key, 1, val)
    return val
}
```

3. 对于对象，如果key存在直接更新走响应式逻辑；如果不是响应式对象就重新收集

## 两种响应式的实现

```js
const initData = { value: 1 }
const data = {}
Object.keys(initData).forEach(key => {
    Object.defineProperty(data, key, {
        get() {
            console.log("访问了", key)
            return initData[key]
        },
        set(v) {
            console.log("修改了", key)
            initData[key] = v
        }
    })
})

const initData1 = { value: 1 }
const proxy = new Proxy(initData1, {
    get: function (target, key, receiver) {
        console.log("访问了", key)
        return Reflect.get(target, key, receiver)
    },
    set: function (target, key, value, receiver) {
        console.log("修改了", key)
        return Reflect.set(target, key, value, receiver)
    }
})
```

## Vue3新特性

1. main.js可以支持多个实例的声明
2. composition api 对比mixin
    - mixin：
      - 命名冲突
      - 不清楚谁暴露出来的内容
    - composition api：
      - setup允许按照功能分布代码而不是按照类型
3. 生命周期
4. 异步组件
   - build以后是独立文件
5. 自定义hook
6. teleport
   - 将子组件渲染到不存在的父组件之外的dom上（dialog等实现原理）

### setup

代替beforeCreate、created生命周期之前执行
