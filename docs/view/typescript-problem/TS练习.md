---
title: TypeScript详解
author: 鹤鸣
date: 2024.05.06
---

# 练习

## keyof 及 in 的概念及用法

此题考验的是 keof 和 in 的用法

``` ts
// 1. 实现 Pick
interface Todo {
  title: string;
  description?: string;
  completed: boolean;
}

type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
};

type TodoPreview = MyPick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

## keyof: 取interface的键后保存为联合类型

```ts
interface userInfo {
  name: string
  age: number
}
type keyofValue = keyof userInfo
// keyofValue = "name" | "age"
```

## in: 取联合类型的值，主要用于数组和对象的构建

切记不要用于interface, 否则会报错

```ts
type name = 'firstname' | 'lastname'
type TName = {
  [key in name]: string
}
// TName = { firstname: string, lastname: string }
```

用于实际开发，举个例子：

```ts
function getValue(o:object, key: string){
  return o[key]
}
const obj1 = { name: '张三', age: 18 }
const values = getValue(obj1, 'name')
```

这样写丧失了ts的优势：

- 无法确定返回值类型

- 无法对key进行约束

```ts
function getValue<T extends Object,K extends keyof T>(o: T,key: K): T[K] {
  return o[key]
}
const obj1 = { name: '张三', age: 18}
const values = getValue(obj1, 'name')
// 如果第二个参数不是obj1中的参数就会报错
```

## 对象属性只读 

```ts
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key];
};

interface Todo {
  title: string;
  description: string;
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar",
};
```