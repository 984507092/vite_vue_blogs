---
date: 2024-08-19
---

# vue3 如何监听子组件的生命周期

在 vue2 中监听子组件的生命周期有这么一个原发 `@hook:mounted` 用来监听子组件的生命周期，

但在 vue3 中就不支持这个了，在 vue3 中，我们可以通过 `@vue:mounted` 来监听子组件的生命周期，

```vue
<template>
<!-- vue2 -->
<!-- <HelloWorld @hook:mounted></HelloWorld> -->
<!-- vue3 -->
<HelloWorld @vue:mounted></HelloWorld>
</template>

<script setup lang='ts'>
import HelloWorld from "@/components/HelloWorld.vue"

const childMounted(){
  console.log('HelloWorld mounted')
}
</script>
```
