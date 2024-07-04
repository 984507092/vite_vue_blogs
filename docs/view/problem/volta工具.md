---
date: 2024-07-04
---


# 使用volta改善前端开发环境的管理

## 起因

做为 NVM 的忠实用户，无意中在网上看到了更方便的管理node版本的工具volta。本来弃之以鼻，NVM是yyds有木有。我已经可以随意切换我的node了，为什么还要换个工具去管理我的开发环境，怪麻烦的算了(来自保守派的执念)。
我做的项目有的是比较旧的，比如用node@14.5.0可以跑的项目，使用node@17.0.0就跑不起来，会报错。比如我正在学习使用vue3开发项目(node@18)，突然公司里来了需求需要做，我就要把公司项目跑起来(node@14)，着急忙慌的没有切换node版本直接跑项目。

<img src="/public/volta/2024-07-04-01.png">

纳尼，报的啥错，我现在node用的18，我忘了切换回旧版本node了，头疼的我需要  <span class="c-green">使用 **nvm use xxx** 切换一下 node 版本才能把项目跑起来</span>，经常遇到这个样的问题，突然想起来 volta ,觉得尝试一下.

## 为什么使用volta?

关于这个问题，我们主要来看一下volta可以帮我们解决什么问题，官方上是这样说的: 使用 Volta，一旦您选择了 Node 引擎，您就不必担心它。切换项目不需要您手动切换版本。什么？不用手动切换版本，这么看起来好像比NVM要香啊！volta有以下功能和优点：

- 跨平台支持，包括 Windows 和所有 Unix shell
- 快速设置和切换node引擎
- 逐个项目的无缝版本切换
- 支持多个包管理器(目前支持npm、yarn)
- 为协作者提供可复制的环境

接下来我会根据这些功能来进行介绍、安装，并且和nvm进对比

## 安装 volta

volta和nvm都是跨平台支持的，这里我介绍下volta在mac和win上的安装方法。

:::info
注意：安装volta时，需要把其他node管理器(nvm)卸载掉，同时node环境卸载干净
:::

### mac安装

mac安装nvm和volta都很简单，这里直接使用官方的安装方法。

```js
curl https://get.volta.sh | bash
```

使用以上命令就可以安装好volta了，使用命令验证volta安装是否成功。

```js
volta -v  // 可以输出当前版本
```

### win安装volta

在Windows上安装需要下载:   <a target="_blank" href="https://github.com/volta-cli/volta/releases/download/v1.0.6/volta-1.0.6-windows-x86_64.msi">volta安装包</a> ，按照提示一直next安装即可。

<img src="/public/volta/2024-07-04-02.png">

安装完成之后，也可以执行命令验证一下。

:::info
这里就要说一下nvm了，对于安装nvm，可能还需要配置一下其他的东西，比如权限问题，可以用gsudo解决。
:::

### 快速安装设置node版本

我们可以在根目录打开终端，安装我们需要的node版本，这个时候安装的node版本是全局的默认版本(后面会介绍到)。

- 安装最新版本

```js
volta install node@latest
```

- 安装指定版本，比如14.5.0

```js
volta install node@14.5.0
```

:::info
注意：使用install安装时，由于下载的是远端node进行安装，可能会安装过慢或者是安装失败，需要多试几次。
:::

### 下载node包，放到安装目录进行安装

- 如果总是安装失败，可以到node官方下载node安装包，进行本地安装。node下载地址：<a target="_blank" href="https://registry.npmmirror.com/binary.html?path=node/">https://registry.npmmirror.com/binary.html?path=node/</a>

- 比如我们安装node16.0.0，我们可以找到对应的文件夹点进去，

<img src="/public/volta/2024-07-04-03.png">

- win下载win的包，mac-intel找darwin的包，mac-arm找arm的就可以了

<img src="/public/volta/2024-07-04-04.png">

找到以后把包放到我们的安装目录，

- mac：/Users/用户名/.volta/tools/inventory/node
- win: C:\Users\admin\AppData\Local\Volta\tools\image\node
