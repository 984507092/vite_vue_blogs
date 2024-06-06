---
title: TypeScript详解
author: 鹤鸣
date: 2024.05.07
---

# TypeScript 详解
## 一、TS基础概念
### 1.什么是TS
a. 对比原理
* TS是JS的超集，在js原有语法之上，添加了可选静态类型和基于类的面向对象编程
> 面向项目
TS - 面向解决大型复杂项目，多人协同假够以及代码维护复杂的场景
JS - 脚本化语言，用于面向简单页面场景

> 自主检测：
TS - 编译期间，主动发现并纠正提示错误 => 编译时
JS - 运行时报错

> 类型检测：
TS - 弱类型，编译时支持动态和静态类型检测
JS - 弱类型，无静态类型选项

> 运行流程：
TS - 依赖编译，打包实现并且转义成浏览器可以运行的代码
JS - 可直接被浏览器运行

> 复杂特性：
TS - 模块化、泛型、接口

b.安装运行
```js
    npm i -g typescript
    tsc -v

    tsc ./test.ts

    // 面试题：所有的类型检测和纠错 - 都是在编译时
```

### 2.TS基础类型与写法
* boolean、string、number、array、null、undefined

```js
    // es
    let isEnabled = true;
    let class = "zhaowa";
    let classNum = 2;
    let u = undefined;
    let n = null;
    let classArr = ["basic","execute"];

    // ts
    let isEnabled:boolean = true;
    let class:string = "zhaowa";
    let classNum:number = 2;
    let u:undefined = undefined;
    let n:null = null;
    let classArr:string[] = ["basic","execute"];
    let classArr:Array<string> = ["basic","execute"];
```

* tuple - 元组
```ts
    let tupleType:[string,boolean];
    tupleType = [true,"zhaowa"];
```

* enum - 枚举 
```ts
    // 数字类枚举 - 默认从零开始，依次递增
    enum Score {
        BAD,NG,GOOD,PERFECT
    }
    let score: Score = Score.BAD;

    // 字符串类型枚举
    enum Score {
        BAD = "bad",
        NG = "ng",
        GOOD = "good",
        PERFECT = "perfect"
    }

    // 值
    enum Score {
        BAD, // 0
        NG,
        GOOD,
        PERFECT
    }

    // 反向映射
    enum Score {
        BAD, 
        NG,
        GOOD,
        PERFECT
    }
    let scoreName = Score[0]; // BAD
    let scoreVal = Score["BAD"]; // 0

    // 异构状态
    enum Score {
        A, // 0
        B, // 1
        C = "C",
        D = "D",
        E = 6,
        F // 7
    }
    // 面试：指出没中具体指
    // 1. 第一个未明确赋值的项目为0 => 所有未赋值的依次往下排直到被数组打断
    // 2. 从数组打断处继续进行依次排序
    // 3. 有明确赋值的保留明确值
    // => js本质实现（手写异构枚举）
    let Enum;
    (function(Enum){
        // 正向
        Enum["A"] = 0;
        Enum["B"] = 1;
        Enum["C"] = "C";
        Enum["D"] = "D";
        Enum["E"] = 6;
        Enum["F"] = 7;

        // 逆向
        Enum[0] = "A";
        Enum[1] = "B";
        Enum[6] = "E";
        Enum[7] = "F";
    })()
```
* any、unknown、void
```ts
    //any - 绕过所有类型检查 => 类型检测和编译筛查会全部失效
    let anyVal: any = 123;

    anyVal = "anyVal";
    anyVal = false;

    let Val1: boolean = anyVal;

    //unknown - 绕过赋值检查 => 禁止更改传递
    let unknowVal: unknown;

    unknowVal = true;
    unknowVal = 123;
    unknowVal = "unknowVal";

    let Val2: unknown = unknowVal;
    let Val3: any = unknowVal;
    // let Val4: boolean = unknowVal; // error:不能将类型“unknown”分配给类型“boolean”

    // void（与any相反） - 声明返回值
    function voidFunction(): void {
        console.log("void function")
    }

    // never - 永不返回 or 永远error
    function error(msg: string): never {
        throw new Error(msg)
    }

    function longlongloop(): never {
        while (true) {
            //...
        }
    }
```
* object / Object / {} - 对象
```ts
// object - 非原始类型
// TS 将JS Object 分成了两个接口来定义
    interface ObjectConstructor {
        create(o: object | null): any;
    }

    const proto = {};

    Object.create(proto);
    Object.create(null);
    // Object.create(undefined); //error:没有与此调用匹配的重载

    // Object
    // Object.prototype 上的属性
    interface Object {
        constructor: Function;
        toString(): string;
        valueOf(): string;
        hasOwnProperty(v: PropertyKey): boolean;
        isPrototypeOf(v: object): boolean;
    }

    // 定义了Object类属性
    interface ObjectConsturctor {
        new(value: any): object;
        readonly prototype: Object;
    }

    // {} - 定义空属性
    const obj = {};
    // obj.class = "zhaowa"; //Error 类型“{}”上不存在属性“class”

    const obj2 = {};
    obj2.toString();
```

## 二、接口 - interface

* 对行为的抽象，具体行为实现由类来完成
```ts
    // 描述了对象的内容
    interface Class {
        name: string;
        time: number;
    }

    let zhaowa: Class = {
        name: "typeScript",
        time: 2
    }

    // 只读 & 任意
    interface Class2 {
        readonly name: string;
        time: number;
    }

    // 面试题 - 和es的引用不同 => const
    let arr: number[] = [1, 2, 3, 4];
    let ro: ReadonlyArray<number> = arr;

    // ro[0] = 12; //error - 类型“readonly number[]”中的索引签名仅允许读取
    // ro.push(5); //error - 类型“readonly number[]”上不存在属性“push”
    // ro.length = 100; //error - 无法为“length”赋值，因为它是只读属性
    // arr = ro; //error - 类型 "readonly number[]" 为 "readonly"，不能分配给可变类型 "number[]"

    // 任意可添加属性
    interface Class3 {
        readonly name: string;
        time: number;
        [propName: string]: any;
    }

    const c1: Class3 = { name: "JS", time: 1, level: 1 };
```

## 三、交叉类型 - &
```ts
    interface A { x: D; }
    interface B { x: E; }
    interface C { x: F; }

    interface D { d: boolean; }
    interface E { e: string; }
    interface F { f: number; }

    type ABC = A & B & C;

    let abc: ABC = {
        x: {
            d: false,
            e: "class",
            f: 55
        }
    }

    // 合并冲突问题
    interface A1 {
        c: string;
        d: string;
    }

    interface B1 {
        c: number;
        d: string;
    }

    type AB = A1 & B1;
    // let ab: AB = {
    //     c: 1, //error - 不能将类型“number”分配给类型“never”
    //     d: "ab",
    // }
```

## 四、断言 - 类型声明、转换（和编译器的告知交流）
* 编译时作用
```ts
    // 尖括号形式声明
    let anyValue: any = "zhaowa";
    let anyValue2: number = (<string>anyValue).length;

    // AS声明
    let anyValue3: any = "zhaowa";
    let anyValue4: number = (anyValue3 as string).length;

    // 非空判断 - 只确定不是空
    type ClassTime = () => number;

    const start = (clssTime: ClassTime | undefined) => {
        let num = clssTime!(); //具体类型待定，但确定非空
    }

    // 面试题：- 核心：编译时功能
    const tsClass: number | undefined = undefined;
    const zhaowa: number = tsClass!;
    console.log(zhaowa); // 编译时通过

    "use strict"
    const tsClass2 = undefined;
    const zhaowa2 = tsClass;
    console.log(zhaowa2) // undefined

    // 那么存在的意义？
    // 肯定断言 - 肯定保证赋值
    let score: number;
    startClass();
    console.log(2 * score!);

    function startClass() {
        score = 5;
    }

    // let score!:number - 告知编译器，运行时下，会被赋值；
```

## 五、类型守卫 - 保障在语法规定的范围内，额外的确认
* 多态 - 多种类型（多种类型）
```ts
    // in - 定义属性场景下的内容确认
    interface Teacher {
    name: string;
    course: string[];
    }

    interface Student {
        name: string
        startTime: Date
    }

    type ClassPerson = Teacher | Student;

    function startCourse(cp: ClassPerson) {
        if ("course" in cp) {
            console.log("teacher")
        }
        if ("startTime" in cp) {
            console.log("student")
        }
    }

    // typeof / instanceof - 类型分类场景下的身份确认
    function recognize(name: string, score: number | string) {
        if (typeof score === "string") {
            console.log("teacher")
        }
        if (typeof score === "number") {
            console.log("student")
        }
    }

    class Teacher2 {
        name: string;
        course: string[];
    }

    class Student2 {
        name: string
        startTime: Date
    }

    type ClassPerson2 = Teacher2 | Student2;


    const getName3 = (cp: ClassPerson2) => {
        if (cp instanceof Teacher2) { //使用interface调用这个方法会报错
            return cp.course
        }
        if (cp instanceof Student2) {
            return cp.startTime
        }
    }

    // 自定义类型
    const isTeacher = function (cp: Teacher | Student): cp is Teacher {
        return "course" in cp;
    }

    const getName2 = (cp: Teacher | Student) => {
        if (isTeacher(cp)) {
            return cp.course
        }
    }
```

## 六、ts进阶
### 1.函数重载
```ts
    function getTriangleArea(side: number): number;
    function getTriangleArea(base: number, height: number): number;
    function getTriangleArea(arg1: number, arg2?: number): number {
        if (arg2 === undefined) {
            // 单参数情况下的逻辑
            return Math.sqrt(3) / 4 * arg1 ** 2;
        } else {
            // 双参数情况下的逻辑
            return 0.5 * arg1 * arg2;
        }
    }
    // 调用函数
    const area1 = getTriangleArea(5); // 计算等边三角形的面积
    const area2 = getTriangleArea(4, 6); // 计算普通三角形的面积
```

### 2.泛型 - 重用
```ts
    function startClass<T, U>(name: T, score: U): String {
        return `${name}${score}`;
    }

    // function startClass<T, U>(name: T, score: U): T {
    //     return (name + String(score)) as any as T;
    // }

    startClass<String, Number>('yy', 5)
```


### 3.装饰器 - decorator

```ts
    /**
 * 类装饰器  ClassDecorator
 * @param target  形参  target 是形参，可以是任何名字
 * @param  result  返回结果：构造函数
 * @param name
 * */
// const Base:ClassDecorator = (target)=>{
// 	target.prototype.heming  = "鹤鸣"
// 	target.prototype.fn = () =>{
// 		console.log('装饰器')
// 	}
// }
 
// 如果用户要传参数可以使用（闭包 或者 函数柯里化 或者 工厂函数）
const Base = (name:string) => {
	const fn: ClassDecorator = (target) => {
		target.prototype.heming = name
		target.prototype.fn = () => {
			console.log('装饰器')
		}
	}
	return fn
}
 
@Base('鹤鸣')
class Http {
 
}
 
const http = new Http() as any
console.log(http.heming)
 
// 或者怕不兼容可以
class Http{
 
}
 
const http = new Http() as any
Base(Http)
http.fn()

/**
 * 方法装饰器 MethodDecorator 接受三个参数
 * @param target 原型对象 不再是构造函数
 * @param key 方法的名字
 * @param descriptor PropertyDescriptor 描述符
 * */
const Get = (url:string) => {
	const fn:MethodDecorator = (target:any, key , descriptor:PropertyDescriptor) => {
		axios.get(url).then((res) => {
			descriptor.value(res.data)
		})
	}
	return fn
}
 
const Post = (url:string) => {
	const fn:MethodDecorator = (target:any,key, descriptor:PropertyDescriptor) => {
		axios.post(url).then((res)=>{
			descriptor.value(res.data)
		})
	}
}
 
@Base('鹤鸣')
class Http {
	@Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
	getList(@Result() data: any) {
		console.log(data.result.list, 'data')
	}
	
	@Post('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
	create() {
	
	}
}

 
/**
 * 参数装饰器 ParameterDecorator
 * @param  target 原型对象
 * @param  key 方法名
 * @param index 数据所在的位置
 * @param  reflect-metadata  数据的反射
 * */
 
const Result = () => {
	const fn: ParameterDecorator = (target, key, index) => {
		Reflect.defineMetadata('key', 'result', target)
	}
	return fn
}
 
 
@Base('鹤鸣')
class Http {
	@Name
	heming: string
	
	constructor() {
		this.heming = '鹤鸣'
	}
	
	@Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
	getList(@Result() data: any) {
		console.log(data, 'data')
	}
	
	// @Post('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
	create() {
	
	}
}
 
const http = new Http() as any

// 综合
// 1.类装饰器 ClassDecorator  target 返回的是一个构造函数
//2.属性装饰器 PropertyDecorator
//3.参数装饰器 ParameterDecorator
// 4.方法装饰器 MethodDecorator PropertyDescriptor
// 5.装饰器工长
// 6. import 'reflect-metadata'
// 7.axios
import axios from 'axios';
import 'reflect-metadata'
 
/**
 * 类装饰器  ClassDecorator
 * @param target  形参  target 是形参，可以是任何名字
 * @param  result  返回结果：构造函数
 * @param name
 * */
// const Base:ClassDecorator = (target)=>{
// 	target.prototype.heming  = "鹤鸣"
// 	target.prototype.fn = () =>{
// 		console.log('装饰器')
// 	}
// }
 
// 如果用户要传参数可以使用（闭包 或者 函数柯里化 或者 工厂函数）
const Base = (name: string) => {
	const fn: ClassDecorator = (target) => {
		target.prototype.heming = name
		target.prototype.fn = () => {
			// console.log('装饰器')
		}
	}
	return fn
}
 
/**
 * 方法装饰器 MethodDecorator 接受三个参数
 * @param target 原型对象 不再是构造函数
 * @param key 方法的名字
 * @param descriptor PropertyDescriptor 描述符
 * */
const Get = (url: string) => {
	const fn: MethodDecorator = (target: any, _key: any, descriptor: PropertyDescriptor) => {
		let key = Reflect.getMetadata('key', target)
		axios.get(url).then((res) => {
			descriptor.value(key ? res.data[key] : res.data)
		})
	}
	return fn
}
 
// const Post = (url:string) => {
// 	const fn:MethodDecorator = (target:any,key, descriptor:PropertyDescriptor) => {
// 		axios.post(url).then((res)=>{
// 			descriptor.value(res.data)
// 		})
// 	}
// }
 
/**
 * 参数装饰器 ParameterDecorator
 * @param  target 原型对象
 * @param  key 方法名
 * @param index 数据所在的位置
 * @param  reflect-metadata  数据的反射
 * */
 
const Result = () => {
	const fn: ParameterDecorator = (target, key, index) => {
		Reflect.defineMetadata('key', 'result', target)
	}
	return fn
}
 
/**
 * 属性装饰器 PropertyDecorator
 * @param target 原型对象
 * @param key 属性
 * */
const Name: PropertyDecorator = (target, key) => {
	console.log(target, key)
}
 
@Base('鹤鸣')
class Http {
	@Name
	heming: string
	
	constructor() {
		this.heming = '鹤鸣'
	}
	
	@Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
	getList(@Result() data: any) {
		console.log(data, 'data')
	}
	
	// @Post('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
	create() {
	
	}
}
 
const http = new Http() as any
// console.log(http.heming)
 
// 或者怕不兼容可以
// class Http{
//
// }
//
// const http = new Http() as any
// Base(Http)
// http.fn()
 
 
```

# 项目中使用TS

## 1.引用和使用

### webpack打包配置 => vue-cli - vue init/creat ${myProject} ${template} => 配置 => 编译时项目
a. entry - 入口
b. extensions加入ts的范畴 - extensions:[".js",".vue",".json",".ts"] => alias:@/src/
c. loaders - ts-loader,增加对于ts的处理 => 工程化

### ts配置
tsconfig.json - ts处理逻辑

## 2. vue / vuex + ts
```ts
    <template>
        <div>
            <vueComponent />
        </div>
    </template>
    <script lang="ts">
        // 1.定义组件的方式上： 形式上 - extends
        // sont Component = {}
        // Vue.prototype.xxx

        // 申明当前模块 Vue.component or Vue.extend
        import Vue from "vue"
        const Component = Vue.extend({

        })

        // 2. 全面拥抱面向对象 -  官方 vue-class-component
        import Component from "vue-class-component"

        // @component 本质 - 类装饰器 => 利用了装饰器，统一了vue实例类的概念
        @Component({
            template:"<vueComponent />"
        })
        export default class myComponent extends Vue {
            message: string = "hello"
            onClick():void{
                console.log("")
            }
        }

        // 3. 申明 - 利用ts的补充模块declare
        declare module "*.vue"{
            import Vue from "vue"
            export default Vue
        }

        // 补充模块 - 通常使用.d.ts来做申明描述
        declare module "/typings/vuePlugin.d.ts"{
            interface Vue{
                myProps: string
            }
        }

        let vm = new Vue()
        // vm.myProps

        // 4. props - propType原地申明复合变量
        import { propType } from "vue"

        interface customPayload{
            str:string,
            number:number,
            name:string
        }

        const Component = Vue.extend({
            props:{
                name:string,
                success:{ type: String },
                callback:{
                    type: Function as PropType<()=>void>
                }
                payload:{
                     type: Object as PropType<customPayload>
                }
            }
        })

        // 5. computed 以及 method如何改造
        computed: {
            getMsg(): string{
                return this.click()
            }
        },
        method:{
            click(): string{
                return this.msg + "ok"
            }
        }

        // 6.vuex的接入ts - 声明
        import { ComponentCustomProperties } from "vue"
        declare module "@vue/runtime-core" {
            interface State{
                count:number

            }

            interface ComponentCustomProperties {
                $store: Store<state>
            }
        }

        // 7. api形式实现
        // store.ts
        import { InjectionKey } from "vue"
        import { createStore,Store } from "vuex"

        export interface State {
            count: number
        }

        export const key:InjectionKey<store<state>> = Symbol()

        export const store = createStore<State>({
            state:{
                count:0
            }
        })

        // main.ts - 主入口
        import { createApp } from "vue"
        import { store , key } from "./store"

        const app = createApp({}) //创建实例

        app.sue(store, key) // => 传入injectionKey => vue api "vue.use"
        app.mount("#app")

        // 消费方
        import { useStore } from "vuex";
        import { key } form"./store";
        export default {
            const store = useStore(key);
        }

        // 8. 利用vuex - class完成引用使用
        import { State, Action, Getter } from "vuex-class"
        
        export default class App extends Vue{
            // 属性装饰器整合store的状态变量
            @State login: boolean;

            get isLogin: boolean;

            // 事件装饰器整合store的犯法
            @Action setInit: () => void;

            mounted(){
                this.setInit();
            }
        }
    </script>
```

# 实操
1. 基建
2. 关联vue => 业务切换
3. mock数据 => 网络请求管理
4. store体系切换 => 关联vuex
5. 页面做切换梳理 => vue-class-component

## 一些实践
```js
// 1
function add(arg1: string, arg2: string): string
function add(arg1: number, arg2: number): number
// 实现
function add(arg1, arg2) {
    // 在实现上我们要注意严格判断两个参数的类型是否相等，而不能简单的写一个 arg1 + arg2
    if (typeof arg1 === 'string' && typeof arg2 === 'string') {
        return arg1 + arg2
    } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
        return arg1 + arg2
    }
}
add(1, 2) // 3
add('1', '2') //'12'

function mySet<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue: T[K]
) {
    object[key] = defaultValue
}

// 2
enum Score {
    A, // 0
    B, // 1
    C = "C",
    D = "D",
    E = 6,
    F // 7
}

// 3
type readonlyObj<T> = {
    readonly [key in keyof T]: T[key]
}
interface car {
    name: string,
    id: string
}
const aa: readonlyObj<car> = {
    name: "",
    id: ""
}


// 4
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(`Length of ${arg} is ${arg.length}`);
    return arg;
}
// 必须有length属性
loggingIdentity({ length: 5, value: 'hello' });


// 5
// type MyPick<T, K extends keyof T> = {
//     [key in K]: T[key]
// }

// 使用

function getValue<T extends Object, K extends keyof T>(o: T, key: K): T[K] {
    return o[key]
}
const obj1 = { name: '张三', age: 18 }
const values = getValue(obj1, 'name')

```