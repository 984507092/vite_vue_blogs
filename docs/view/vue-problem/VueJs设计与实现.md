---
date: 2024-06-18
title: VueJs设计与实现
name: 鹤鸣
---

# Vue.js设计与实现

### 1.1 命令式和声明式

1. 命令式：jQuery 和 原生的 JavaScript 都是命令式，通过调用函数来完成一些操作。

2. 声明式：Vue 是声明式的，通过声明数据来完成一些操作。

### 1.2  性能和可维护性

命令式和声明式各有优缺点，<span class="c-red">**声明式代码的性能不优于命令式代码的性能**</span>，反过来说就是命令式代码的性能比声明式的代码好

```js
let div = document.querySelector('div')
div.textContent = 'Hello World'

<div @click="()=>alert('ok')">Hello World</div>
```

如果我们把直接修改的性能消耗定义为 A ，把找出差异的性能消耗为B，那么有：

- 命令式代码的更新性能消耗 = A
- 声明式代码的更新性能消耗 = B + A

由此我们可以看到声明式代码比命令式代码多出找出差异的性能消耗，**毕竟框架本身就是封装了命令式代码才实现了面向用户的声明式**，所以性能结论：<span class="c-red">**声明式代码的性能不优于命令式代码的性能**</span>

### 1.3  虚拟dom的性能

前面有提到，**声明式代码的更新性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗**,因此我们能够找到最小化 **找出差异的性能消耗** 就能让声明式无限接近命令式

相信你也清楚了采用虚拟 **DOM** 的理论，为什么是理论呢，因为 <span>**我们很难写出绝对优化的命令式代码**</span> ，尤其是在应用程序的规模很大的时候，即使写出来了，也浪费了很大的精力，这时的投入和产出并不高

那么，有没有什么办法能够让我们不用付出太多的努力（写声明式代码），还能保证性能和接近命令式代码，这就是虚拟 DOM 要解决的问题

前文中说的原生 JavaScript 指的是 `document.createElement` 之类的 DOM 操作方法，但不包含 `innerHTML` ,因为它比较特殊。

根据书中的 **图 1-1 跑分结果** 显示 JavaScript 层面的操作比 DOM 快 ，因此我们可以用一个公式表达：innerHTML 创建页面的性能 ： **HTML 字符串拼接的计算量 + innerHTML 的 DOM 计算量**

虚拟dom创建页面的性能分为两步：第一步创建JavaScript对象，第二步 遍历虚拟 DOM 并创建真实 DOM，我们用公式表达： **创建 JavaScript 对象的计算量 + 遍历虚拟 DOM 的计算量 + 创建真实 DOM 的计算量**
