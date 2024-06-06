# 创建 Vue3 + Vite 项目

创建 Vue3 + Vite 项目，并初始化常见的依赖。

- 1.使用 pnpm 
- 2. 创建 Vite 项目
  - 2.1 初始化项目
  - 2.2 安装常见库
- 3.配置项目
  - 3.1 基础配置
  - 3.2 配置 Axios
  - 3.3 配置 Vue Router
  - 3.4 配置 Pinia
  - 3.5 编写第一个页面
  
::: warning Node.js 版本
  过低的 Node.js 版本（14 和 14 以下）不受支持，请升级的 Node.js 16 / 18 或者更高的版本。
:::
  
## 1. 使用 pnpm

本文全面使用 pnpm，如果没有安装 pnpm，安装命令如下：

```js
  npm i -g pnpm
```

更新 pnpm：

```js
pnpm add -g pnpm
```

## 2. 创建 Vite 项目

### 2.1 初始化项目

```js
pnpm create vite
```

下面进行配置：

1.项目名，任意，遵循 Slug 命名
2.项目类型 Vue
3.TypeScript 或 JavaScript

安装依赖：

```js
cd my-proj
pnpm i
```

### 2.2 安装常见库

```js
pnpm add vue-router
pnpm add pinia
pnpm add pinia-plugin-persistedstate
pnpm add axios
pnpm add mitt
pnpm add @vueuse/core
pnpm add less -D
```

## 3. 配置项目

### 3.1 基础配置

`vite.config.ts` 的常见配置：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})

```

现在进行调试：

```js

pnpm dev

```

看到页面证明配置无误.

### 3.2 配置 Axios

新建 src/request/index.ts 文件，然后复制下面的代码：

```js
import axios from 'axios'

const request = axios.create({
  baseURL: '/api/',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(config => {
  if (config.headers === undefined || config.headers.Authorization !== undefined) {
    return config
  }
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  // TODO: 错误处理
  console.log(error, '请求错误：请替换为你的错误处理逻辑')
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  if (response.data.code !== 0) {
    // TODO: 错误处理
    console.log(response.data, '响应错误：请替换为你的错误处理逻辑')
    return Promise.reject(response)
  }
  return response
}, error => {
  console.log(error)
  if (error.response && error.response.status === 401) {
    // TODO: 错误处理
    console.log(error, '未授权错误：请替换为你的错误处理逻辑')
  } else {
    // TODO: 各种不同类型的错误处理
    console.log(error, '网络错误：请替换为你的错误处理逻辑')
  }
  return Promise.reject(error)
})

export default request

```

各种错误处理逻辑可以自行定义。

### 3.3 配置 Vue Router

创建 src/router/index.ts：

```js
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './config'

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

```

创建 src/router/config.ts：

```js
import { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      keepAlive: true,
      requiresAuth: false
    }
  }
]

```

### 3.4 配置 Pinia

创建 src/store/index.ts：

```js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export default store

```

创建应用级别存储，创建 src/store/app.ts：

```js
import { defineStore } from 'pinia'

export const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      // 此处填写应用级别 store 项目
    }
  },
  getters: {
  },
  actions: {
  },
  persist: {
    key: 'app',
    storage: window.localStorage
  }
})

```

<span class="c-#fff bg-#4bba84 b-rd-2 p1">可选</span> 创建用户存储，创建 src/store/user.ts：

```js
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      user: {},
      token: ''
    }
  },
  getters: {
  },
  actions: {
  },
  persist: {
    key: 'user',
    storage: window.localStorage
  }
})

```

### 3.5 编写第一个页面

创建 src/views/Home.vue，然后编写一些内容，例如：

```js
<script setup lang="ts">

</script>

<template>
  <h2>Hello World</h2>
  <p>这是段落</p>
</template>

<style lang="less" scoped>

</style>

```

为了让页面可见，我们先删除 `src/style.css`、`src/components/HelloWorld.vue` 和 `src/assets/vue.svg`，然后修改 `main.ts` 为下面的内容：

```js
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'

const app = createApp(App)
app.use(store).use(router).mount('#app')

```

下面修改 App.vue：

```js
<script setup lang="ts">
console.log('全局环境:', import.meta.env)
</script>

<template>
  <router-view></router-view>
</template>

<style lang="less" scoped>

</style>

```

下面修改 `index.html` 的一些项目：

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Home</title>

```

然后将 `public/vite.svg` 修改为你的图标，保存 `public/favicon.svg`，这样图标就是统一的样式了。