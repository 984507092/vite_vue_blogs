## Ref 全家桶

### Ref

ref 接受一个内部值并返回一个 响应式 且可变的 ref 对象 。ref 对象仅有一个 .value property ,指向该内部值

案例:

我们这样操作是无法改变 message 的值 应为 message 不是响应式的无法被 vue 跟踪要改成 ref

```tsx
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
let message: string = "我是message"

const changeMsg = () => {
   message = "change msg"
}
</script>

<style lang="scss" scoped>
</style>
```

改为 ref

Ref TS 对应的接口

```tsx
interface Ref<T> {
  value: T;
}
```

<span style="color:red">注意被 ref 包装之后需要 .value 来进行赋值</span>

### isRef
判断是不是一个 ref 对象

```tsx
import { ref, Ref, isRef } from "vue";
let message: Ref<string | number> = ref("我是message");
let notRef: number = 123;
const changeMsg = () => {
  message.value = "change msg";
  console.log(isRef(message)); //true
  console.log(isRef(notRef)); //false
};
```

### shallowRef

创建一个跟踪自身 .value 变化的 ref , 但不会使其值也变成响应式的

例子 1

修改其属性是非响应式的这样是不会改变的

```tsx
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { Ref, shallowRef } from 'vue'
type Obj = {
  name: string
}
let message: Ref<Obj> = shallowRef({
  name: "鹤鸣"
})

const changeMsg = () => {
  message.value.name = '梦泽'
}
</script>

<style lang="scss">
</style>
```

例子 2

这样是可以被监听到的修改的 value

```tsx
import { Ref, shallowRef } from "vue";
type Obj = {
  name: string;
};
let message: Ref<Obj> = shallowRef({
  name: "鹤鸣",
});

const changeMsg = () => {
  message.value = { name: "梦泽" };
};
```

### triggerRef

强制更新页面 DOM

这样也是可以改变值的

```tsx
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { Ref, shallowRef,triggerRef } from 'vue'
type Obj = {
  name: string
}
let message: Ref<Obj> = shallowRef({
  name: "鹤鸣"
})

const changeMsg = () => {
  message.value.name = '梦泽'
 triggerRef(message)
}
</script>

<style>
</style>
```

### customRef

自定义 ref

customRef 是一个工厂函数要求我们返回一个对象 并且实现 get 和 set 适合去做防抖之类的

```tsx
<template>
  <div ref="div">鹤鸣Ref</div>
   <hr>
  <div>
    {{ name }}
  </div>
  <hr>
  <button @click="change">修改 customRef</button>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, shallowRef, customRef } from 'vue'

function myRef<T = any>(value: T) {
  let timer:any;
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newVal) {
        clearTimeout(timer)
        timer =  setTimeout(() => {
          console.log('触发了set')
          value = newVal
          trigger()
        },500)
      }
    }
  })
}

const name = myRef<string>('梦泽')

const change = () => {
  name.value = '鹤鸣'
}

</script>
<style scoped>
</style>
```

**Ref 获取元素**

获取元素节点的元素信息 子组件的话获取组件实例

```tsx
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div ref="dom">{{ message }}</div>
  </div>
</template>


<script setup lang="ts">
import { Ref, shallowRef } from 'vue'

let dom = ref<HTMLDivElement>()
console.log(dom.value?.innerText,'获取文本信息')
</script>

<style>
</style>
```

### 总结：

1.**Ref** 和 **shallowRef** 对比 **shallowRef** 只是浅层次的响应，只到 <span class="fontColor"> **.value** </span> 部分

2.**Ref** 和 **ShallowRef** 不能同时使用， **ShallowRef** 会被 ref 影响

3.ShallowRef 可以搭配 **tiggerRef(xx)** 进行强制的页面更新 ， xx 是更新的值

4.custimRef 是让我们自定义一个 ref 的效果

5.获取 dom 元素 使用 ref 在标签上写上 **ref="dom"** 的时候 在定义的时候 必须写 **const dom = ref()**

6.Ref 获取元素信息的时候一般不要放到 setup 里面， 因为那个时候的 dom 还没有渲染完成，获取不到 dom 信息，可以放到 onMountend 生命周期中

### Ref 源码分析

1. ref 在 引用类型的时候其实是调用了 reactive 进行值的修改，对基本类型的值直接返回，这个时候进行了判断是不是 ref 对象，是的话直接返回，不是的话去创建一个 ref 对象
2. ref 和 shallowRef 两者区分是在源码中有一个 createRef 的函数中进行传值 true 和 false ,如果是 true 就直接返回 value , 如果是 false 就会到 toReactive 函数中，判断是否引用类型 ，如果是就会执行 reactive 不是直接返回 value
3. shallowRef 不能和 ref 同时写在一块的原因是，在源码中他们其实都会调用 triggerRef ，triggerRefValue 又会调用 triggerEffects 就会导致依赖的更新所以他就把 shallowRef 的依赖一块更新了，所以，ref 和 shallowRef 不能写在一块









<style lang="scss">
  .fontColor{
    color:red;
  }
</style>
