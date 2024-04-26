​
## 初始化

### 1.安装node和typescript

#### 1.1node 安装 Node.js (nodejs.org)

<a href="https://blog.csdn.net/WHF__/article/details/129362462">Node.js下载安装及环境配置教程【超详细】_nodejs下载-CSDN博客</a>

#### 1.2typescript 安装

```
npm install typescript -g
```

安装完成后初始化文件，就会有package.json文件

```
npm init 
```

然后再初始化ts tsconfig.json

tsc init


新建一个文件为index.ts文件随便定义一个类型然后进行执行

执行命令 

tsc -w
执行完 tsc -w 后，会有一个index.js的文件，新开一个终端执行 

node index
注：如果报错就是没有执行tsc init命令 

## 基础类型

``` typescript
// 字符串类型
let str:string = "鹤鸣"

// 数字类型
let num:number = 123 //普通数字
let notANumber:number = NaN // NaN
let infinityNumber:number = Infinity //Infinity
let decimal:number = 6 // 十进制
let hex:number = 0xf00d //二进制
let octal:number = 0o744 // 八进制

// 布尔值类型
let b1:Bool = true
let b2:Bool = false

// null
let n:null = null

// undefined
let un:undefined = undefined

//注： 可以进行穿插赋值  如果有红色波浪也是因为严格模式的原因
let nu:null = null
let und:undefined = undefined
nu = und
und = nu

// void
// void定义null如果提示红色波浪需要关闭严格模式 在tsconfig.json 文件中找到  "strict": true,      设置为false
let v1:void  = null
let v2:void  = undefined

// void 一般函数使用的比较多一点
// 定义为void的话不能有返回值
function myFn():void {
    return 
}
```


​