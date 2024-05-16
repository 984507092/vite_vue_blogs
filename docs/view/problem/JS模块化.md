---
title: js模块化
author: 皮明宇
date: 2024.03.22
---

# js模块化(发展历程)

js模块化：-------------背景--------------复杂度
                          --------------工程化
                          --------------服务化

         -------------语法基础-----------IIFE

         -------------分类---------------传统-----------无模块化
                                            -----------CJS
                                            -----------AMD
                                            -----------CMD
                          ---------------现代化--------拓扑组合 <=> 工程化


js本身定位：简单的页面设计-----页面动画+基本的表单提交
    并没有模块化的概念

## 幼年期
无模块化（委婉的辩解）
1. 开始需要在页面加载不同的js：动画库、表单库、格式化单位
2. 多种js被分在不同的文件中
3. 不同的文件又被同一个模板引用

```js
  // test.html
  <script src="jquery.js"></script>
  <script src="tools.js"></script>
  <script src="main.js"></script>
```
可取的地方：
文件分离是最基础的模块化，第一步

* 随之而来存在一个面试问题：script标签两个参数（async 、 defer）
```js
  <script src="jquery.js" type="text/javascript" async></script>
```
总结：
普通 - 解析到标签，立刻pending，并且下载且执行
defer - 解析到标签开始异步下载，继续解析完成后开始执行
async - 解析到标签开始异步下载，下载完成之后立刻执行并且阻塞解析，执行完成后再继续解析

1. 兼容性 => IE9 + 兼容程度不同
2. 问题方向 => 浏览器渲染原理、同步异步原理、模块化加载原理

问题出现：
* 污染全局作用域 => 不利于大型项目开发以及多人团队共建
* 
## 成长期
模块化的雏形 - IIFE（语法侧的优化）
### 作用域的把控
举个栗子：
```js
    let count = 0;

    // 代码块1
    const increase = () => count++;
    // 代码块2
    const rest = () => {count=0};

    increase();
    rest();
```
以上两个方法的count串通了

利用函数块级作用域
```js
    (()=>{
    let count = 0;
    // ...
    })()

```
定义函数 + 立即执行 => 独立的空间
初步实现了一个最最简单的模块

尝试定义一个最简单的模块 - 模块 和 外部的联系与合作
```js
    // 这样的模块称为 iifemodule
    const module = (()=>{
        let count = 0;
        return {
            increase:()=>count++,
            reset:()=>{count = 0}
        }
    })()
    // 然后暴露 module
    module.increase();
    module.reset();
```

* 追问：有额外依赖的时候，如何优化处理IIFE
> 优化1：依赖其他的IIFE
```js
    const iifemodule = ((dependcyModule1,dependcyModule2)=>{
        let count = 0;
        return {
            increase:()=>count++,
            reset:()=>{count = 0}
        }
    })(dependcyModule1,dependcyModule2)
```
> 追问2：了解早起jQuery依赖处理/模块加载的方案么？ / 了解传统IIFE是如何解决多方依赖问题的么
IIFE + 传参调配

实际上，传统框架应用了一种revealing的写法
揭示模式
```js
    const iifemodule = ((dependcyModule1,dependcyModule2)=>{
        let count = 0;
        const increase = ()=>count++;
        const reset = ()=>{count = 0};
        return { 
            increase,
            reset
        }
    })(dependcyModule1,dependcyModule2);
    iifemodule.increase();
    iifemodule.reset();
    // 返回的事能力 = 使用方传参 + 本身逻辑能力 + 依赖能量
    // $("").attr("title","newTitle")
```

* 面试追问：
1. 深入模块化实现
2. 转向框架：jQuery、vue、react的模块的实现细节，以及框架的特征原理
3. 转向设计模式
   
## 成熟期

### CJS - commonjs
> node.js 指定的标准
> 特征：
* 通过module + export 去对外暴露接口
* 通过require去调用其他模块
  
模块组织方式：
dep.js
```js
    const dependcyModule1 = require("..")
    const dependcyModule2 = require("..")
    
    // 核心
    let count = 0;
    const increase = ()=>count++;
    const reset = ()=>{count = 0};

    // 暴露
    export.increase = increase;
    export.reset = reset;

    module.exports = {
        increase,
        reset
    }
```

```js
    const {increase , reset} = require("dep.js")
    increase();
    reset();
```

** 可能会被问到的问题 **
实际执行处理
```js
    (function(export,require,module){
        const dependcyModule1 = require("..")
        const dependcyModule2 = require("..")
    }).call(thisValue,export,require,module)

    // 部分开源项目分别传入全局、指针、框架做参数
    (function(window,$,undefined){
        const _show = function (){}
    })(window,jQuery)

    // window - 1.全局作用域改成了局部作用域，执行的时候不用全局调用，提升效率
    // 2.编译的时候优化压缩(function(c){})(window)

    // jQeury - 1.独立进行改动和挂载，保障稳定
    // 2.防止全局污染

    // undefined - 1.防止undefined被重写
```

> * 优点：
> CJS从服务端角度解决了依赖全局污染的问题
> * 缺憾：
> 针对服务端

### AMD
Asynchronous Module Definition
> 通过一步加载 + 允许定制回调函数
> 经典实现框架： require.js

新增定义方式：
```js
    // 通过define来定义一个模块，然后用require去加载
    define(id,[depends],callback);
    require([module],callback)
```

```js
    define("amdModule",["dependcyModule1","dependcyModule1"],(
        dependcyModule1,dependcyModule1)=>{

        }
    );
```

```js
    require(["amdModule"],amdModule=>{
        amdModule.incease();
    })
```

** 面试题：如何对已有代码做兼容
1. 增加定义阶段
2. 返回作为回调内部的return
```js
define('amdModule', [], require => {
    // 引入部分
    const dependecyModule1 = require("./dependecyModule1");
    const dependecyModule2 = require("./dependecyModule2");
    // 核心逻辑
    let count = 0;
    const increase = () => ++count
    const reset = val => {
        //..
    }
    // 暴露接口部分
    export.increase = increase;
    export.reset = reset;
    return {
        increase,
        reset
    }
})
```

** 面试题：兼容判断AMD & CJS

UMD的出现
Universal Module Definition
- 目标：一次区分CJS和AMD

```js
(function (global, factory) {
    // global是this的形参，factory是function (exports) {console.log("i am iron man")}的形参

    // typeof exports === 'object' && typeof module !== 'undefined' 这里表示CJS
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        // typeof define === 'function' && define.amd 这里表示amd
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            // 首先尝试确定全局对象，如果不是 undefined，那么将它设置为 global，否则使用 global、self 或者当前环境中的全局对象
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.leaflet = { }));
})(this, (function (exports) {
    console.log("i am iron man")
}))
```

> * 优点：解决了浏览器的异步动态依赖
> * 缺点：会有引入成本，没有考虑按需加载

### CMD规范
Common Module Definition
> 按需加载，主要应用框架，sea.js

```js
    // 依赖就近
    define("module",(require,exports,module)=>{
        let $ = require("jQuery");
        // ...
        let depend1 = require("..");
    })
```

> * 优点：按需加载，依赖就近
> * 缺点：1.依赖于打包；2.扩大了模块的体积

区别：按需加载，依赖就近

### ESM
ECMA Script Modules,ECMA是一个机构(欧洲计算机制造商协会),是一家国际性会员制度的信息和电信标准组织。
> 走进新时代
>
新增定义：
引入关键字 - import
到处关键字 - export
```js
    // 引入区域
    import dependencyModule1 from ".."

    // 逻辑处理区域
    // ...

    export default{
        increase,reset
    }
```

** 追问：ESM动态模块**
考察：export promise

ES11原生支持解决方案
```js
    import("./example.js").then(dynamicEsModule =>{
        dynamicEsModule.increase();
    })
```

> * 优点：通过一种最统一的形态整合了所有js的模块化

