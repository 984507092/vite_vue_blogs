---
title: Vue3运行时处理逻辑
author: 皮明宇
date: 2024.04.19
---

# Vue3运行时处理逻辑

## runtime-core

## Vue2/3 diff

### vue2 Diff 缺点
vue2的diff是全量Diff,数据发生变化会产生新的DOM，与之前的DOM比较找到不同，如果层级太深，很消耗内存。

### vue3 Diff 最长递增子序列
1. 静态标记 + 非全量Diff
2. 使用最长递增子序列进行优化

#### 前置和后置的预处理 
