---
date: 2024-08-20
---
# vue的异步更新原理和nextTick的实现

首先答案：是异步的

为什么是异步的呢，因为每次改变值都会触发一次 render 这样就会导致性能降低，vue 为了解决这种问题就采用异步实现的，所以 vue 会把数据变化放到微任务中，然后异步执行，这样就不会造成性能降低。

如果说怎么实现异步更新快速拿到值呢 ，答案是肯定的 使用 nextTick()

那 vue 为什么是异步的呢？看下面代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <button id="btn">count++</button>
    <div id="el"></div>

    <script>
      const el = document.querySelector('#el')
      const btn = document.querySelector('#btn')

      function effect(fn){
        // 保存当前的 effect
        activeEffect = fn
        fn()

        // 执行完之后清空
        activeEffect = null
      }

      // 当前正在执行的 effect
      let activeEffect = null
      // 保存依赖
      const set = new Set()

      const count = {
        _value:0,
        get value(){
          // 收集依赖
          activeEffect && set.add(activeEffect)
          return this._value
        },
        set value(val){
          this._value = val
          // 触发更新
          set.forEach(cb => cb())
        }
      }

      effect(()=>{
        // 因为是同步的所以这个地方执行了两次 但页面上直接就是显示最新的，我们都没有显示1但是 effect 执行了两次
        console.log('effect')
        el.innerText = count.value
      })

      btn.addEventListener('click',()=>{
        // 为什么要异步更新，假如说这个地方有很多个变量更新
        count.value++
        count.value++
      })
    </script>
  </div>
</body>
</html>
```

处理后的代码实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <button id="btn">count++</button>
    <div id="el"></div>

    <script>
      const el = document.querySelector('#el')
      const btn = document.querySelector('#btn')

      function effect(fn){
        // 保存当前的 effect
        activeEffect = fn
        fn()

        // 执行完之后清空
        activeEffect = null
      }

      // 当前正在执行的 effect
      let activeEffect = null
      // 保存依赖
      const set = new Set()

      const tasks = new Set()
      function runTasks(){
        Promise.resolve().then(()=>{
          tasks.forEach(task => task())
          // 执行完后清空
          tasks.clear()
        })
      }

      function nextTick(cb){
        Promise.resolve().then(cb())
      }

      const count = {
        _value:0,
        get value(){
          // 收集依赖
          activeEffect && set.add(activeEffect)
          return this._value
        },
        set value(val){
          this._value = val
          // 触发更新,我们先不去吊用这个函数，先放到 tasks 中,然后在调用 runTasks 
          set.forEach(cb => task.add(cb))
          runTasks()
        }
      }

      effect(()=>{
        // 这个时候他就执行了一次
        console.log('effect')
        el.innerText = count.value
      })

      btn.addEventListener('click',()=>{
        // 为什么要异步更新，假如说这个地方有很多个变量更新
        count.value++
        count.value++

        // console.log(el.innerText) // 拿不到最新的值，所以就用到了 nextTick

        nextTick(()=>{
          console.log(el.innerText)
        })
      })
    </script>
  </div>
</body>
</html>
```
