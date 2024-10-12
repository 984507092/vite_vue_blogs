# node后台和包管理工具

## nvm

是node版本管理工具

### 安装

点击[地址](https://github.com/coreybutler/nvm-windows/releases)下载nvm

选择"nvm-setup.exe"安装

### 查看和配置

指令`nvm v`检查安装成功没有

```sh
    # 查看版本
    nvm v    

    # 已经安装的所有node.js的版本
    nvm ls

    # 可安装的所有node.js的版本
    nvm list available      

    # 安装node.js 16.15.0  
    nvm install 16.15.0  

    # 卸载node.js 16.15.0  
    nvm uninstall 16.15.0  

    # 使用node.js 16.15.0  
    nvm use 16.15.0
```

### 存在的问题

- 如果你的npm pnpm yarn什么的都很慢，老是重定向，来检查一下

```sh
   npm config get registry  # https://registry.npmjs.org/ 那就恭喜你要修改了

   npm config set registry https://registry.npmmirror.com

   npm install -g pnpm
```

## fnm

相比于nvm的优势：

- 更快的运行速度
- 跨平台支持
- 根据项目目录中的.node-version文件可以自动切换Node.js版本

### 安装

1. 去这个[网站下载](https://github.com/Schniz/fnm/releases),根据你的环境去选择,这里用windows举例选择`fnm-windows.zip
`
2. 放到D盘或者其他你找的到的地方，解压缩。
3. 大家电脑应该都是win11吧，右键`个性化设置`，然后搜索`环境变量`，打开以后有上下两栏，双击上栏中的`Path`，右边点一下`新建`,输入你的文件夹地址`D:\Program Files\fnm`，比如我的`fnm.exe`就放在这里了。
4. 然后继续配置下面栏的系统变量：两组，变量名`FNM_DIR`，值`D:\Program Files\fnm\node`;变量名`FNM_NODE_DIST_MIRRORs`，值`D:\Program Files\fnm\node`;这里配置的目的是为了让nodejs以后下载到D盘中指定的位置

### powerShell使用

到这里还只能在powerShell中使用，打开powerShell，然后输入`notepad $profile`,如果提示文件不存在需要新增则点击“是”，然后在打开的文件中输入下列内容并保存:

```sh
fnm env --use-on-cd | Out-String | Invoke-Expression
```

### 一些指令

```sh
# 版本
fnm --version

# 查看远端node可安装列表
fnm ls-remote

# 安装node
fnm install 16.20.2

# 切换node
fnm use 16.20.2

# 列出本地安装版本
fnm list
```

### cmd中使用fnm

先说原理：就是在cmd启动以后，先输入一些指令，拿到fnm，然后就可以正常使用了，所以可以通过给cmd添加前置自动输入的指令，来实现自动加载fnm。

#### 建立文件

比如我建立了一个`D:\script\bashrc.cmd`的文件，然后在`bashrc.cmd`中输入如下内容：

```sh
@echo off
:: for /F will launch a new instance of cmd so we create a guard to prevent an infnite loop
if not defined FNM_AUTORUN_GUARD (
    set "FNM_AUTORUN_GUARD=AutorunGuard"
    FOR /f "tokens=*" %%z IN ('fnm env --use-on-cd') DO CALL %%z
)
```

路径和文件名都可以自己diy，<span class='emphasis'>但是绝对不能有空格</span>，不然会报错的。

#### regedit添加指令

`win+R`然后输入`regedit`,然后找到这个目录`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Command Processor`。

<!-- <img src='../../img/unknown/fnm.jpg'/> -->

然后就可以在`cmd`中畅游`fnm`了,如果还有其他问题就自行百度。

补充一下，看你成功没有就是打开cmd然后指令一下：

```sh
node -v

npm -v
```

## node后台

在服务器上搭建一个简单的node服务

### 写一个node

略，这太简单了，自行chatgpt

### 打包

node打包有很多种：

- pkg打包，把执行环境一起打包过来，离线部署很有用，就是打包以后太大了
- webpack或者rollup打包，自行百度webpack，这里只说rollup

1. 首先package.js塞点料

```json
{
  "main": "index.js",
  "scripts": {
    "serve": "node index.js",
    "build": "rollup -c"  // 表示读取rollup.config.js
  },
  "devDependencies": {
    "@babel/core": "^7.23.9",
    "@babel/plugin-transform-runtime": "^7.23.9",
    "@babel/preset-env": "^7.23.9",
    "@rollup/plugin-commonjs": "^25.0.7",
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "babel-loader": "^9.1.3",
    "rollup": "^2.79.1",
    "rollup-plugin-babel": "^4.4.0"
  },
  "dependencies": {
    // ...
    // ...
    // ...
  }
}
```

2. 安装依赖
3. 编绘rollup.config.js

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
export default {
    input: 'index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
    },
    plugins: [
        resolve(), // 解析第三方模块
        commonjs(), // 添加 commonjs 插件
        json(),
        // babel({
        //     runtimeHelpers: true,
        //     presets: ["@babel/preset-env"],
        // })
    ],
};
```

### 部署

- pkg部署，很简单直接用指令启动服务就行（一般是.exe等文件）
- webpack或者rollup打包以后，需要在服务器上使用pm2启动

<span class="emphasis">别用node启动，当然不听劝可以试试</span>

### pm2记录

#### 安装pm2

```sh
# 安装pm2
npm install pm2 -g

# 查看pm2安装位置
whereis pm2
```

<img src="../../img/nvmAndNode/findpm2.png" />

因为linux系统默认指令都存在`/usr/local/bin`

#### 创建软连接

```sh
sudo ln -s /home/software/node16/bin/pm2 /usr/local/bin/pm2
```

#### 测试

随便切换到别的文件夹地址然后试试`pm2 -v`

#### 开机启动

```sh
pm2 startup
```

#### node服务启动

```sh
pm2 start /home/node/vitepressBack/index.js
```

<img src="../../img/nvmAndNode/pm2start.png" />

#### 将项目添加到pm2自启管理队列

```sh
pm2 save
```

#### pm2指令

```sh
#查看启动服务
pm2 list

#重启服务
pm2 restart <service_name>

#关闭服务
pm2 stop [app_name_or_id]

#关闭所有服务
pm2 stop all

#删除服务
pm2 delete [app_name_or_id]

#查看日志
pm2 logs
```
