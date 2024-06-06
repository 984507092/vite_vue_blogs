---
date: 2024-06-04
---

# nodejs新版本引起的：digital envelope routines::unsupported

## 一、起因

由于电脑重装系统，重新下载nodejs,自然更新到最新版本18，之前的版本才16。更新到最新nodejs版本后，运行vue文件，报错：

this[kHandle] = new _Hash(algorithm, xofLen);
^

Error: error:0308010C:digital envelope routines::unsupported

<img src="/public/problem/2024-06-04-1.png"  />

## 二、探索

常规操作，上网查原因：

node.js 的版本问题

因为 node.js V17版本中最近发布的OpenSSL3.0, 而OpenSSL3.0对允许算法和密钥大小增加了严格的限制，可能会对生态系统造成一些影响。故此以前的项目在升级 nodejs 版本后会报错。

## 三、解决

1.推荐：修改package.json，在相关构建命令之前加入SET NODE_OPTIONS=--openssl-legacy-provider

```js
"scripts": {
   "serve": "SET NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service serve",
   "build": "SET NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service build"
},
```

这种可以一劳永逸，以后直接通过npm执行scripts里面的命令即可。不管是项目迭代，还是团队开发，这种都比较有效。

2.当次运行的命令窗口有效：在你当前文件的cmd命令窗口输入：SET NODE_OPTIONS=--openssl-legacy-provider， 回车后输入 npm运行命令

<img src="/public/problem/2024-06-04-2.png"  />

这种做法，就是每次运行都要输入SET NODE_OPTIONS=--openssl-legacy-provider，来告诉nodejs,别使用最新的SSL3.0,还是使用以前旧版本的。

3.就是nodejs版本回退到16版本，这样就可以直接运行了。

网上一些答主的做法：

<img src="/public/problem/2024-06-04-3.png"  />

 分析下他做法错误之处：首先，他打开cmd之后，直接回车

 <img src="/public/problem/2024-06-04-4.png"  />

 这种做法很傻，因为你起码要进入到对应文件的位置，不然的话，不出意外的话，就出意外了。

<span class="c-red"> 最后补充一点：</span>

关于：SET NODE_OPTIONS=--openssl-legacy-provider，其实这种方法不能一劳永逸，它的legacy的中文意思翻译过来是经典的，传统的，对于目前2022年12月4号来说，openssl3.0是最新的，之前的版本属于legacy版本，但是随着时间的推移，

未来可能在2024年，openssl3.0可能也变成了legacy版本，此时再设置SET NODE_OPTIONS=--openssl-legacy-provider，来通知nodejs使用传统的openSSL来执行，那么可能就会运行错误。那么对于产品的迭代维护来说，最好的话，还是使用旧版本的nodejs,比如16版本的，这个才可能是解决问题的关键。

四、最后#
记录下闲话，最近在部署vue程序在老旧的windows服务器上，老旧的服务器是至强cpu，iis6.0的，使用起来真操蛋，关键该服务器还是在内网中的，部署起来要远程连接到另一台电脑，另一台电脑再连接到这台服务器上，需要上传部署文件都要先通过微信发给医院内部的人，医院内部的人帮我们传到这台服务器上，是的，远程连接不支持传文件，真操蛋，医院又不给我们权限，自己上传，部署起来真心累，周六日这两天都用来搞这玩意了，最后因为iis没办法安装url重写和APR路由映射，果断放弃使用iis,使用了nginx,浪费老子这么多时间！！！！


参考文章：<a class="cursor-pointer" target="_blank" href="https://www.cnblogs.com/hmy-666/p/16949982.html">digital envelope routines::unsupported</a>