# UnoCSS

## vitepress 使用 unocss 方式

## 第一步 

1、安装unocss

::: info
pnpm add -D unocss
:::


2、在config.mts也就是入口文件中配置vite的unocss插件

::: info
``` javascript
import UnoCSS from 'unocss/vite'

export default defineConfig({
  title: "测试",
  description: "测试",
  vite:{
    plugins: [
      UnoCSS()
    ]
  },
  themeConfig: {}
})
```
:::


3、在.vitepress/theme/index中导入unocss

::: info
import "virtual:uno.css";
:::
