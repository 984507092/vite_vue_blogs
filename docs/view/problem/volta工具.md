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

### Unix 安装

在大多数 Unix 系统(包括 macOS)上，您可以使用一个命令安装 Volta:

```js
curl https://get.volta.sh | bash
```

对于 bash, zsh 和 fish，这个安装程序将自动更新控制台启动脚本。如果您希望防止修改控制台启动脚本，请参阅跳过 Volta 设置。要手动配置你的 shell 使用 Volta，编辑你的控制台启动脚本如下:

- 将 VOLTA_HOME 变量设置为$HOME/.volta
- 将$VOLTA_HOME/bin 添加到 PATH 变量的开头

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

Volta 的功能依赖于创建符号链接，所以你必须:

- 启用<a target="_blank" href="https://learn.microsoft.com/zh-cn/windows/apps/get-started/enable-your-device-for-development#accessing-settings-for-developers">开发者模式(推荐)</a>
- 以提升的权限运行 Volta(不推荐)

:::

### Windows 下的 linux 子系统

如果您在 Linux 的 Windows 子系统中使用 Volta，请遵循上面的 Unix 安装指南。

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

### 选择默认的 Node 版本

这是 Volta 将在有固定版本的项目之外的其它地方使用的版本。

要选择特定版本的Node，可以运行：

```js
volta install node@20.11.0
```

或者使用最新的LTS版本，可以运行：

```js
volta install node
```

### 下载node包，放到安装目录进行安装

- 如果总是安装失败，可以到node官方下载node安装包，进行本地安装。node下载地址：<a target="_blank" href="https://registry.npmmirror.com/binary.html?path=node/">https://registry.npmmirror.com/binary.html?path=node/</a>

- 比如我们安装node16.0.0，我们可以找到对应的文件夹点进去，

<img src="/public/volta/2024-07-04-03.png">

- win下载win的包，mac-intel找darwin的包，mac-arm找arm的就可以了

<img src="/public/volta/2024-07-04-04.png">

找到以后把包放到我们的安装目录，

- mac：/Users/用户名/.volta/tools/inventory/node
 <img src="/public/volta/2024-07-04-05.png">
- win: C:\Users\admin\AppData\Local\Volta\tools\image\node
<img src="/public/volta/2024-07-04-06.png">

- 不需要管npm，本地安装之后就有了
- 直接在终端执行安装命令即可

### 查看所有安装环境

- 此时，我们已经安装了两个版本，可以使用命令查看我们安装的版本列表

```js
volta list // 查看当前环境依赖
volta list all // 查看所有环境依赖
```

- 我们可以使用 `volta install` 来切换我们默认的node版本(如果安装了会直接切换，没有安装的会先下载安装)

### 逐个项目的无缝版本切换

- 我们有了多个版本的node，就可以到项目中进行对应的设置了。
- 比如我们vue2的项目需要14版本的node，前往项目目录执行命令

```js
volta pin node@14
```

- 如果我们使用`node@14`，volta会帮助我们找14中最合适的版本，可能不是我们安装过的版本，如果想使用我们安装的版本，必须把版本号写全

```js
volta pin node@14.5.0
```

- 此时我们的项目 `package.json` 中会多一个配置
  
```js
"volta": {
  "node": "14.5.0"
}
```

### 支持多个包管理器(目前支持npm、yarn)

- 此配置用来指明我们当前项目设置的volta的环境，包含node、npm、yarn。等等你这里只有设置node呀，npm、yarn在哪，别着急，我们一步一步来。
- 虽说node自带npm，但如果我们想限制我们项目npm版本也是可以的，比如限制为8.0.0

```js
volta pin npm@8.0.0
```

执行完成之后，`package.json` 中会多一个配置

```js
"volta": {
  "node": "14.5.0",
  "npm": "8.0.0"
}
```

- 如果想设置 yarn 也是同样的道理。

当我们给多个项目设置好volta的配置之后，我们后面就不需要在做版本切换了，你运行哪个项目，volta就会帮助你无缝切换到对应的版本(嘿，是真香呀)，nvm瞬间不香了。

:::info
目前对于pnpm没有支持版本管理，希望后面能得到支持吧。 所以，全局默认版本，最好是node16以上，不然的话，pnpm就无法执行了。
:::

### 为协作者提供可复制的环境

不知道大家有没有遇到过这样的情景：

- 同事A：vue2这个项目我怎么跑不起来？
- 同事B：你node版本太高了，需要切换低版本node。
- 同事A：哦，那运行这个项目的node版本是多少？
- 同事B：node14就行。
- 同事A：。。。。纳尼？居然不告诉我具体版本，万一出问题咋办?

以上情景说起来简单，但是每次都要给参与这个项目同事说一下运行环境也是很麻烦的。我们自己的电脑上各个项目都配置好了对应的node环境，那同事怎么能感知到呢？

- 首先，package.json中我们通过votal设置了环境，这个时候如果同事没有用volta，可以直接查看对应项目的node版本，然后手动切换(使用nvm或者其他的管理方式)
- 其次，如果同事安装了volta，那就简单了，直接运行项目，如果同事的电脑没有对应的运行环境，volta会自动帮助我们安装，简单至极！

### 常用命令

接下来介绍下我们可能常用的命令

```js
volta list //查看当前环境的版本
volta list all //查看存在的所有版本
volta install node //安装最新版的nodejs
volta install node@12.2.0 //安装指定版本
volta install node@12 //volta将选择合适的版本安装
volta pin node@10.15 //将更新项目的package.json文件以使用工具的选定版本
volta pin yarn@1.14 //将更新项目的package.json文件以使用工具的选定版本
```

### 总结

以上就是对于 volta 的介绍了，我自己也就折腾了1个小时就上手使用了，并且给我的mac和win电脑都做好了配置。推荐那些使用nvm的老玩家，可以玩玩这个新工具，上手是真的香。
