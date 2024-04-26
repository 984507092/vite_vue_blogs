## Reactive 全家桶

### reactive

数组异步赋值问题
这样赋值页面是不会变化的  因为会脱离响应式

```typescript
let person = reactive<number[]>([])
setTimeout(() => {
  person = [1, 2, 3]
  console.log(person);
  
},1000)
```

reactive 源码约束了我们的类型
他是不可以绑定普通的数据类型这样是不允许 会给我们报错

``` typescript
import { reactive} from 'vue'
 
let person = reactive('sad')
```

 ### readonly 

readonly 只读的 , 但是 readonly 会受原始的数据的修改而改变
拷贝一份proxy对象将其设置为只读

``` typescript
let obj = reactive({name:"鹤鸣"})
const read = readonly(obj)

const show = ()=>{
    obj.name = '梦泽' // 此时 readonly 也会跟着改变
    read.name // 会提示你不可以更改，是只读的 
    console.log(obj,read)
}
```

### shallowReactive

shallowReactive 和 shallowRef 一样都是浅层次的 ，同时也会因为主题改变而改变 ，但自身改变的时候只会改变第一层的属性值
只能对浅层的数据 如果是深层的数据只会改变值 不会改变视图

``` typescript
<template>
  <div>
    <div>{{ state }}</div>
    <button @click="change1">test1</button>
    <button @click="change2">test2</button>
  </div>
</template>
 
<script setup lang="ts">
import { shallowReactive } from 'vue'
 
const obj = {
  a: 1,
  first: {
    b: 2,
    second: {
      c: 3
    }
  }
}
 
const state = shallowReactive(obj)
 
function change1() {
  state.a = 7
}
function change2() {
  state.first.b = 8
  state.first.second.c = 9
  console.log(state);
}
 
 
</script> 

<style>
</style>
```

### 异步的解决方案

1、方案一 使用push

数组 采用 push 等数组方法 加 解构的形式

2、方案二 包裹一层对象

 添加一个对象 把数组作为一个对象去解决

 ``` typescript
let list = reactive<string[]>([]})

//  第二种
let list = reactive<{
    arr:string[]
}>({
    arr:[]
})

const add = () {
    setTimeout(()=>{
        let res = ['heming','mufeng','changfeng']    
        list = res  // X 这种直接赋值是会丢失响应式的，破坏了 proxy 代理的对象
        //方法
        list.push(...res) // 采用 push 等数组方法 加 解构的形式
        // 或者 对象
        list.arr = res
    },2000)
}
 ```

### 总结：

reactive 和 ref 的区别
1、ref 支持所有的类型 reactive 引用类型 Array Object Map Set

2、ref 取值 赋值都需要加 .value ，而 reactive 是不需要 .value

3、reactive 采用的是 proxy 不能直接赋值 否则破坏响应式对象的

4、reactive 异步数据的时候 如果直接赋值是会丢失响应式的，可以采用 push 或者对象的方式来解决

5、shallowReactive只能对浅层的数据 如果是深层的数据只会改变值 不会改变视图

6、readonly 拷贝一份proxy对象将其设置为只读，但如果主题改变了，也会受到影响进行改变

### Reactive 源码分析

1、首先会进行一个泛型的约束，然后会有一个 createReactiveObject 的这个函数，在这个函数中会有一些判断，首先判断是否是基本类型，如果是就会进行报错

2、如果传入的对象被 proxy 代理了也会进行一个直接的返回 

3、他是从缓存中去找的，这个缓存是通过 weakMap 实现的 ， 然后 从缓存中找值如果找到就返回，没有继续往下走

4、如果以上的条件都没有触发就会做一个 proxy 的代理