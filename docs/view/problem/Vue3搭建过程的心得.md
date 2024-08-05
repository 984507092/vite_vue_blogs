---
date: 2024-08-05
---

# Vue3 从 0 - 1 搭建后台的心得

刚开始搭建的时候感觉没有什么东西，因为用到了脚手架，就感觉很快就完成了，然后处理了一些 `env` 一些配置，紧接着就引入了组件款，我采用的是 `element-plus` 组件库,这个基本没什么问题，按照正常的来就可以了 ，问题就是在登录的时候使用到了表单，路由模式使用的 `hash` 刚开始的时候想着应该是路由模式的原因，换了路由模式后，确实好了，最后也没有多想，重新走流程的时候发现这个问题还有，然后才进行了深究等等一些问题，如下：

## 页面刷新并且URL上面多了一个问号

当 form 表单中提交的时候，输入数据按下回车键，或者说提交的时候，页面会刷新，并在url上面多出一个问号，导致页面错误

<img src="/public/2024-08-05_16-06-48.png" />

解决方案：

**<span class="c-red">在el-form上面加上@submit.native.prevent</span>**

原因分析： form 表单提交时，在该输入框中按下回车默认是提交该表单。我们需要阻止这一默认行为。

```html
     <el-form :model="formData" @submit.native.prevent>
        <div class="item">
          <input id="username" type="text" required v-model="formData.username" />
          <label for="username">username</label>
        </div>
        <div class="item">
          <input id="password" type="password" required v-model="formData.password" />
          <label for="password">password</label>
        </div>
        <button class="btn" @click="handleSubmitForm">
          submit
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </el-form>
```

## 面包屑跳转侧边栏激活颜色变动

第二个问题是，我在写面包屑的时候发现点击上一级的时候，跳转了，但是侧边栏没有进行跳转

在做一个后台管理系统的时候，发现了element plus文档中的面包屑的使用方式，觉得还挺不错的，准备拿来用，发现可以与 vue 的 route 结合使用。

### 1. 编写面包屑

代码如下：

```vue
<template>
  <el-breadcrumb class="app-breadcrumb h-60px line-height-60px" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in state.levelList"
        :key="index"
        :to="{path:item.path}"
      >{{item.meta.title}}</el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>


<script setup lang="ts">
import { reactive ,onMounted, watch} from 'vue'
import { useRoute } from 'vue-router'
import {ElBreadcrumb,ElBreadcrumbItem} from 'element-plus'
import type { LoginInfo } from '@/types/login.d.ts'

const $route = useRoute()
const state = reactive({
  levelList: []
})

watch($route,(to, from)=>{
  getBreadcrumb()
})


let getBreadcrumb = () => {
  let matched: LoginInfo = $route.matched.filter(item => item.name)
  const  second = matched[1]

  if (second&&second.name!=="home") {
    matched.splice(0,1,{ path: '/home', meta: { title: '首页' }})
    matched.splice(1,0,{ path: second.meta.fatherPath, meta: { title: second.meta.fatherTitle }})
  }else if (second&&second.name=="home") {
    matched = [{ path: "/home", meta: { title: "首页" } }]
  }
  state.levelList = matched
}


onMounted(() => {
  getBreadcrumb()
})
</script>

<style>
</style>

<style  lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 60px;
  margin-left: 10px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>

```

watch 是用来路由改变的监听器，通过动态改变 levelList 来改变每个页面的面包屑显示

3、适配路由

我们需要实现的是，点击面包屑，路由会跳转到相应页面，我们通过绑定的:to已经完成了，但是我们还需要左侧的菜单栏跳转到相应的位置

我的左侧菜单路由单独写了一个 vue，这里直接给出代码，核心逻辑就是使用 **<span class="c-red"> onBeforeRouteUpdate</span>** 方法在每次路由改变的时候进行监听，将el-menu 的 default-active 更改成我们面包屑点击的目标 url

参考的文章 <https://blog.csdn.net/woodwhale/article/details/123944372>

```js
 onBeforeRouteUpdate(to => {
    curPath.value = to.path
 });
```
