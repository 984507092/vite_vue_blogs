---
date: 2024-06-06
---

# Vue2/3使用 sass 定义全局样式及变量

## vue-cli2使用sass定义全局样式及变量

vue-cli2创建的vue项目使用sass预处理器需按顺序安装以下插件，其中 sass-loader 版本和 node-sass 需要安装固定版本，其他的依赖不要求版本，亲测有效。如果不不固定 sass-loader 和 node-sass 的版本，可能会报出一些运行时的错误：Node Sass version 5.0.0 is incompatible with^4.0.0

```js
Node Sass version 5.0.0 is incompatible with^4.0.0
```

需要卸载已安装的sass-loader和node-sass，除以下方式外也可以在package.json中手动将sass-loader和node-sass的版本修改为指定的7.3.1和4.14.1版本

```js
npm uninstall node-sass
npm install node-sass@4.14.1
```

```js
"@babel/core": "^7.12.3",
"sass-resources-loader": "^2.1.1",
"sass-loader": "^7.3.1",
"node-sass": "^4.14.1",
```

build/utils.js中配置exports.cssLoaders中return部分，配置如下:

```javascript
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass').concat(
      {
        loader: 'sass-resources-loader',
        options: {
          resources: path.resolve(__dirname, '../src/assets/css/var.scss') //这里是单独建的存放变量的scss，我的是 var.scss
        }
      }
    ),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
```

/src/assets/css/var.scss文件中是定义的全局的sass变量，例如色值变量：

```javascript
$link-blue: #2b83e6;
$yellow-green: #b0eb00;
$gray: #595959;
$dark-gray: #363636;
$light-gray: #a6a6a6;
```

main.js文件中也可以引入公共的scss样式，如清除浮动，去除padding之类的样式，main.js中的引入方式如下：

```js
import './assets/css/global.scss'
```

global.scss文件如下：

```js
*{
  padding: 0;
  margin: 0;
}
clearfix:after{
  content: "";
  display: block;
  height: 0;
  clear:both;
  visibility: hidden;
}
.clearfix{
  *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
```

如果在main.js中引入global.scss文件时，出现如下报错：* ./assets/css/global.scss in ./src/main.js

```js
 ERROR  Failed to compile with 1 errors                                                                           8:47:07
 
 
This relative module was not found:
 
* ./assets/css/global.scss in ./src/main.js
Error from chokidar (D:\): Error: EBUSY: resource busy or locked, lstat 'D:\pagefile.sys'
```

需要在build/文件中module.rule去掉类似如下的对scss文件的处理：

```js
{
    test: /\.scss$/,
    loader:'style!css!sass'
}
```

## vue-cli3使用sass定义全局样式及变量

vue-cli3创建的项目无需配置，可以直接在vue文件中使用lang="scss"

vue-cli3中要使用全局定义的色值变量需要在vue.config.js中配置

```js
module.exports = {
  // ...
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/css/var.scss";`
      }
    }
  }
}

或

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./", //或者/ headlines
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "/src/common/common.less";`,
          },
        },
      },
    },
  },
});

```

在vue文件中使用全局变量的方式如下：

```js
<template></template>
<script></script>
<style lang="scss" scoped>
button{
color: $link-blue;
}
</style>
```

## vue2.6 sass 全局变量配置

- 安装 `sass-loader`

```js
npm install sass-loader@8.0.2 --save-dev

```

- `vue.config.js` 中配置
  
```js
module.exports = {
    css: {
    loaderOptions: {
      sass: {
        prependData: `@import '@/assets/styles/variables.scss';` // 注意此处的 ; 不能少！ node-sass 配置全局变量
        // additionalData: `@import '@/assets/styles/variables.scss';` // 如果上面的配置报错试试这个，dart-sass 配置全局变量
      }
    }
  }
}

```

- variables.scss
  
```scss
$color-main: #f60;
$bg-main: #999;
```

- 全局vue文件中使用
  
```css
.container {
	color: $color-main;
}
```

### 作为变量在js或html标签中使用

- `:export` 变量导出

```scss
// 将variables.scss中定义的变量导出
:export {
  mainColor: $color-main;
  mainBg: $bg-main;
}

```

- 引入变量使用

```js
import variables from "@/assets/styles/variables.scss";

// 变量替换，为了在标签中使用
data() {
    return {
      variables: variables,
    }
},
computed: {
    bgStyle() {
      return {
        background: this.variables.mainBg
      }
    }
},

// 修改颜色和背景色
<div :style="{...bgStyle, color: variables.mainColor}">测试文字</div>

```

## vue3 + vite sass 全局变量配置

在Vue 3 + Vite项目中配置 Sass

在Vue 3 + Vite项目中，使用 Sass 非常简单。首先，确保已经安装了相关的依赖。可以通过以下命令进行安装：

```js
npm install -D sass
npm install -D sass-loader

```

安装完成后，在项目的根目录下找到 vite.config.js 文件，并添加以下配置:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  }
})

```

在上述配置中，我们通过 css.preprocessorOptions.scss.additionalData 来引入一个全局的Sass文件，可以在这个文件中定义一些全局的变量和混合器。

Sass 语法基础

Sass 提供了许多强大的语法特性，下面介绍几个常用的：

- 嵌套规则：可以在一个选择器中嵌套另一个选择器，减少重复的代码。

```css
.container {
  width: 100%;
  
  .title {
    font-size: 20px;
  }
}

```

- 变量：可以定义和使用变量，方便在样式中复用值。
  
```scss
$primary-color: #007bff;

.button {
  background-color: $primary-color;
}

```

- 混合器：类似于函数，可以定义一段可复用的样式代码。

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  @include flex-center;
}

```

在Vue组件中使用 Sass 样式

在Vue组件中使用 Sass 样式非常简单，只需将样式文件

的扩展名从 .css 改为 .scss 或 .sass 即可。在Vue单文件组件的 `<style>` 标签中，使用lang属性指定使用的语言。

```html
<template>
  <div class="container">
    <h1 class="title">Hello, Vue 3 + Vite + Sass!</h1>
  </div>
</template>

<style lang="scss">
.container {
  width: 100%;

  .title {
    font-size: 20px;
  }
}
</style>
```

抽取 Sass 样式到全局

为了在多个组件中共享一些样式代码，我们可以将 Sass 样式抽取到全局中。在上面的 vite.config.js 配置文件中，我们已经引入了一个全局的 Sass 文件，例如 variables.scss。在这个文件中，可以定义一些全局的样式变量和混合器。

```scss
// variables.scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$font-size: 16px;

// mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

```

然后，在需要使用这些全局样式的组件中，只需使用 @import 将全局样式文件引入即可。

```html
<template>
  <div class="container">
    <h1 class="title">Hello, Vue 3 + Vite + Sass!</h1>
    <button class="button">Click me</button>
  </div>
</template>

<style lang="scss">
@import "./styles/variables.scss";
@import "./styles/mixins.scss";

.container {
  width: 100%;

  .title {
    font-size: $font-size;
  }

  .button {
    @include flex-center;
    background-color: $primary-color;
    color: $secondary-color;
    font-size: $font-size;
  }
}
</style>

```

全局Sass代码的常用技巧

- 定义全局的样式变量，例如颜色、字体大小等，以便在整个项目中统一使用。
- 定义一些常用的样式混合器，例如布局、动画等，以便在多个组件中复用。
- 使用嵌套规则来减少重复的代码，提高样式的可读性和维护性。
- 利用Sass的函数和操作符来进行样式计算和动态生成样式
  
### 结语：

在Vue 3 + Vite项目中使用Sass可以帮助开发者更高效地编写和维护样式代码。本篇博客介绍了如何在Vue项目中配置Sass，以及Sass语法的基础用法。同时，还提供了如何将Sass样式抽取到全局并使用的方法，以及全局Sass代码的常用技巧。希望这些内容对你在Vue 3 + Vite项目中使用Sass有所帮助！