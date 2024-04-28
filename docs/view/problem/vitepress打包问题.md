# vitepress打包问题

::: warning
在 vitepress 打包中不能使用死链接，否则会打包失败
:::

如果你的vitepress相关十分丝滑，那就恭喜你了，实际上笔者打包遇到了诸多问题，比如
<span style="color:red">navie打包`amd不兼容`，leaflet报错 `ReferenceError: window is not defined`</span>

## vitepress菜单栏

### 上一页和下一页

一般来讲，vitepress的md上一页和下一页是自动读取`config.mjs`中的配置的，如果你的上一页和下一页不对劲：

- 要么就是md文件你写死了，因为可以通过配置`frontmatter`来配置上下页；
- 要么就是`config.mjs`中路径有问题，仔细检查一下纰漏，特别是那些自动生成路径的孩子们；

### 左侧多级菜单栏

左侧菜单栏分级，只需要在`config.mjs`的树结构中多定义几层就行了,简单说就是嵌套n层children；

还不懂的话，看看[官方例子吧](https://vitepress.dev/zh/reference/default-theme-sidebar#the-basics)

### 右侧多级菜单栏

直接去找`themeConfig`：

```js
themeConfig: {
    outline: [2, 3],
}
```

## vitepress打包

### window is not defined

如果你看到这了，首先恭喜你：node环境只有global没有window的坑被你发现了，实际上是因为vitepress是一个SSR系统，打包分后端和前端两阶段，所以要解决这个问题，需要让前端的插件在打包前端的时候再执行，官方给出了一个 [解答](https://vitepress.dev/zh/guide/ssr-compat#ssr-compatibility)

如果还在往下看，也许是官方给出的解决方案，对你来说不太解决，实际上笔者用的是最后一个 [方法defineClientComponent](https://vitepress.dev/zh/guide/ssr-compat#defineclientcomponent)

原来的写法：

```js
    import autoPath from './../components/autoPath.vue'
    import trackPlay from './../components/trackPlay.vue'
```

解决问题的写法：

```js
    import { defineClientComponent } from 'vitepress'
    const autoPath = defineClientComponent(() => {
        return import('./../components/autoPath.vue')
    })
    const trackPlay = defineClientComponent(() => {
        return import('./../components/trackPlay.vue')
    })
```

但是上述存在一个问题，通过`defineClientComponent`会导致组件变成异步的，所以如果在外部传入数据，内部要定义`watch`监听触发一些钩子方法。

### navie

```js
    import { NSpace, NSlider, NInputNumber, NGradientText } from "naive-ui";
```

当你代码里面使用按需加载的时候，这个东西报错是这样的:

```md
SyntaxError: Named export 'NButton' not found. The requested module 'naive-ui' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'naive-ui';
const { lightTheme, createDiscreteApi, NSpace, NGradientText, NInputNumber, NSlider, NButton, NIcon, NSelect, NCheckbox } = pkg;
```

那么怎么解决呢？

- 实际上 [window-is-not-defined](#window-is-not-defined) 这个地方的配置方案已经帮你解决了这个问题。
- 另一个思路就是全局引用，然后打包以后就大1.5MB，过程就是在 [这里](https://vitepress.dev/zh/guide/ssr-compat#conditional-import) 做条件引入。
  - `.vitepress`文件夹下面建立一个`theme`文件夹，然后塞一个`index.js`,配置如下：

```js
    // https://vitepress.dev/guide/custom-theme
    import DefaultTheme from "vitepress/theme";
    import naive from 'naive-ui'
    // 这里是自定义了一个layout
    import MyLayout from './layout.vue'
    import '../../styles/index.scss'

    export default {
    ...DefaultTheme,
    NotFound: () => "404", // <- this is a Vue 3 functional component
    enhanceApp({ app, router, siteData }) {
        // app is the Vue 3 app instance from createApp()
        // router is VitePress' custom router (see `lib/app/router.js`)
        // siteData is a ref of current site-level metadata.
        app.use(naive);  
    },
    Layout: MyLayout
    };
```

当然了，这么解决还有另一个问题，组件异步加载，那万一网速很慢加载卡顿，怎么办捏？
那就只能搞个loading动画欺骗一下用户，安抚一下他们的耐心了：

```js
    // 定义部分
    const autoPathLoading = ref(true)
    const autoPath = defineClientComponent(() => {
    return import('./../components/autoPath.vue')
    },[],()=>{
    autoPathLoading.value = false;
    })
    const trackPlayLoading = ref(true)
    const trackPlay = defineClientComponent(() => {
    return import('./../components/trackPlay.vue')
    },[],()=>{
    trackPlayLoading.value = false;

    // 使用部分
    <loading v-if="autoPathLoading"/>
    <trackPlay class="min-width-set"/>
})
```

[原理参考](https://vitepress.dev/zh/guide/ssr-compat#defineclientcomponent)