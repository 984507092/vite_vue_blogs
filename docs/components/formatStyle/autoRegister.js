import { defineAsyncComponent } from 'vue'

export default {
  install(app) {
    // import.meta.glob是vite的api
    // import.meta.globEager新的vite版本已弃用
    const components = import.meta.glob('./*/index.vue')
    // 遍历组件模块实现自动注册
    for (const [key, value] of Object.entries(components)) {
      // 拼接组件注册的 name
      const componentName = 'auto-' + key.replace('./', '').split('/')[0]
      console.log(componentName, 'componentName');
      // 通过 defineAsyncComponent 异步导入指定路径下的组件
      app.component(componentName, defineAsyncComponent(value))
    }

  }
}