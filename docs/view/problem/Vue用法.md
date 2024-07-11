
# Vue 用法

## Vue2 + Vue2源码

## Vue3 + Vue3源码

- vue
- MVC 和 MVVM
MVC：

1. view视图发生事件，触发controller更新
2. controller触发model事件的执行，然后触发view视图的更新
   view -> controller -> model -> view

MVVM:
   用户操作 -> view的变化 -> 改变view model -> model -> 告诉view model数据变化
   -> 改变视图 -> 改变用户界面

vue：ref，直接操作DOM
react：单向数据流

## Vue指令

```js
    export default {
        mounted(el, { value: { fn, time } }) {
            el.addEventListener("click", () => {
                if (el._time) {
                    clearTimeout(el._time);
                    el._time = null
                }
                el._time = setTimeout(() => {
                    fn();
                }, time)
            })
        }
    }
```

## Flow

1. 类型推断
2. 类型注释

## Vue 进阶

### 1.特点：模板化

#### 1.插槽 slot

1. 默认、匿名插槽
2. 具名插槽
3. 作用域插槽

```vue
    <!-- 匿名插槽 -->
    <solt></solt>

    <!-- 具名插槽 -->
    <solt name="header"></solt>

    <!-- 作用域插槽,只是让父组件可以通过data来选择渲染 -->
    <solt name="header" :slotProps="slotProps"></solt>
```

#### 数据的加工处理

1. watch computed => 整个用法会相对复杂
2. 函数
3. v-html
4. filter

#### JSX

1. 模板化{{}}
2. 2.JSX TSX compiler

### 2.组件化

1. 全局引用组件
2. 函数式组件

#### mixin （本质就是mixin先执行，component后执行）

1. 支持递归合并
2. data冲突的时候，组件data会覆盖
3. 涉及生命周期不会覆盖，但是mixin的优先级会高于component
4. 可以有多个

#### extends（本质就是extends先执行，component后执行）

1. 只可以有一个

如果一起用，extends -> mixin -> 组件  按顺序执行

#### 整体扩展的 extends，用于全局

### Vue.use 插件

1. 注册外部插件
2. Vue.use(),默认调用install函数

#### 组件的高级应用

1. 递归组件：vue-tree
2. 动态组件：<component :is="name"></component>
3. 异步组件：

```js
    var routes = [
        {
            path:"/",
            component:async () =>{
                const cusComp = await import(XXXX);
                return cusComp;
            }
        }
    ]
```
