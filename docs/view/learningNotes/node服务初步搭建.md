# 初始化

新建一个文件夹，进入文件夹，然后打开终端输入 `npm init -y` 或者 `npm init` 一直回车

1. 安装 express `npm install express` 或者 `npm install koa`
2. 安装 nodemon `npm install nodemon`
3. 安装 nodemon `npm install koa2-cors` 或者 `npm install koa-cors`
4. 安装 nodemon `npm install koa-bodyparser` 或者 `npm install body-parser`
5. 安装 nodemon `npm install koa-router` 或者 `npm install router`
6. 配置 package.json `"start":"node app.js", "dev":"nodemon app.js"`
   
新建一个 src 的文件夹 用来存放 app.js 
把上面的基本配置下载完完成后 在 app.js 里面写一些代码 

``` js
const Koa = require('koa');
const router = require('../router/index')
const config = require('../config/index')
const app = new Koa()
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');//用作解析

// 配置跨域
app.use(cors(
  {
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    maxAge: 86400,
  }
))

// 使用 koa-bodyparser 中间件
app.use(bodyParser());

// 路由
app.use(router.routes())
app.use(router.allowedMethods())

// 监听
app.listen(config.PORT, () => {
  console.log(`server running.... at http://${config.hostName}:${config.PORT}`);
})
```

新建一个文件夹 config 用来存放配置文件的信息，比如端口号和域名，或者一些 key 等信息

然后新建一个 router 文件夹 用来存放路由信息 index.js 实现接口的请求的路由

以 koa 为例 代码如下

```js
const Router = require('koa-router')
const router = new Router()
const getIPv4Address = require("../utils/getIpAddress")
const { getWeather, getIpCode } = require('../api/index')
const config = require('../config/index')
const readFile = require('../utils/readFile')


router.get('/user', async (ctx, next) => {
  try {
    // 如果有请求ip 直接取 否则请求ip
    const ip = ctx.request.ip;
    // 或者获取经过代理的IP地址
    const forwardedFor = ctx.request.get('X-Forwarded-For');
    const realIp = ctx.request.get('X-Real-IP');

    // 优先使用X-Forwarded-For头部的IP地址，如果没有则使用X-Real-IP，最后才是request.ip
    const clientIP = forwardedFor
      ? forwardedFor.split(',').reverse()[0] // 获取X-Forwarded-For中的第一个IP地址
      : realIp ? realIp : ip

    let clientIp = getIPv4Address(clientIP)

    // 城市定位 code2
    let infoCode = await getIpCode({
      key: config.KEY,
      ip: clientIp.includes('127.0.0.1') ? '' : clientIp,
    })

    // 天气数据
    let data = await getWeather({
      key: config.KEY,
      city: JSON.parse(infoCode).adcode,
      extensions: "base",
      output: "JSON"
    })

    let logFile = {
      ...JSON.parse(data),
      ip: clientIp,
    }

    if (JSON.parse(data).status == 1) {
      ctx.body = {
        message: "操作成功",
        code: 200,
        data: logFile
      }

      readFile(logFile)
    } else {
      ctx.body = {
        message: "参数错误",
        code: 200,
        data: null
      }
    }

  } catch (err) {
    ctx.body = {
      message: "操作失败",
      code: 500,
      data: null
    }
  }

  await next()
})


module.exports = router
```

在这段代码种 使用了 get 的请求方法 有两个参数，第一个是路由，第二个参数是回调信息，在回调中接受两个参数，第一个是 ctx 接口请求的请求和响应的信息，第二是 next

最后引入到 app.js 种添加中间件就可以了，一个基本的node服务就搭建完成了。

## 打包

node打包有很多种：

- pkg打包，把执行环境一起打包过来，离线部署很有用，就是打包以后太大了
- webpack或者rollup打包，自行百度