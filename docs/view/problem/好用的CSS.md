# CSS 合集篇

## pointer-events '穿透'点击并保证上层的元素也可点击

`<span color="red">pointer-events</span>` '穿透'点击并保证上层的元素也可点击

<img src="/public/2024-08-16-01.png">

想要点击 btn1 但是 btn1 被上层 box 挡住，设置 `box {pointer-events: none;}` 后点击 box 穿透到下层即可捕捉 btn1 的点击事件，同时点击 box 上的 btn2 也会穿透，无法捕捉到 btn2 的点击事件，想要捕捉btn2的点击事件给他加`{pointer-events: all}`就可以了

```html
 <div class="content">
     <button class="btn1" @click="click1">1111</button>
      <div class="box">
          <button class="btn2"  @click="click2">2222</button>
      </div>
  </div>
  .content{
  position: relative;
  width: 100vw;
  height: 100vh;
}
.box{
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;//值none表示鼠标事件“穿透”该元素并且指定该元素“下面”的任何东西。
}
.btn2{
  pointer-events: all;//使元素成为鼠标事件的目标
}
```

## 深入探讨 filter 与 backdrop-filter 的异同

本文将深入探讨在 CSS 中两个非常类似的属性 -- filter 和 backdrop-filter。它们都能完成某些滤镜功能，但是它们肯定也存在差异。那么，为什么在 CSS 中有了 filter 还诞生了 backdrop-filter ？

带着这个疑问，开始今天的正文。

filter VS backdrop-filter
在 CSS 中，有两个和滤镜相关的属性 --  filter 和 backdrop-filter。

> backdrop-filter 是更为新的规范推出的新属性，可以点击查看 Filter Effects Module Level 2。

- filter：该属性将模糊或颜色偏移等图形效果应用于元素。

- backdrop-filter：该属性可以让你为一个元素后面区域添加图形效果（如模糊或颜色偏移）。它适用于元素背后的所有元素，为了看到效果，必须使元素或其背景至少部分透明。

注意两者之间的差异，filter 是作用于元素本身，而 backdrop-filter 是作用于元素背后的区域所覆盖的所有元素。

它们所支持的滤镜种类：

| 属性  | filter | backdrop-filter | 备注 |
|  :----:  |   :----:   |   :----:   |   :----:   |
| url | √ | √  | 获取指向SVG过滤器的URI |
| blur | √ | √  | 高斯模糊滤镜 |
| brightness | √ | √  | 图像明亮度的滤镜 |
| contrast | √ | √  | 图像的对比度滤镜 |
| drop-shadow | √ | √  | 图像的阴影滤镜 |
| grayscale | √ | √  | 图像灰度滤镜 |
| hue-rotate | √ | √  | 图像色相滤镜 |
| invert | √ | √  | 反转滤镜 |
| opacity | √ | √  | 透明度滤镜 |
| sepia | √ | √  | 深褐色滤镜 |
| saturate | √ | √  | 图像饱和度滤镜 |

可以看到，两者所支持的滤镜种类是一模一样的。

也就是说，它们必然存在诸多差异，下面就让我们逐一探讨。

### 作用对象的差异

backdrop-filter 最常用的功能，就是用于实现毛玻璃效果。

我们通过实现毛玻璃效果来理解 filter 和 backdrop-filter 使用上的一些差异。

在 backdrop-filter 没有诞生前，我们想实现这样一个毛玻璃效果，是比较困难的：

<img src="/public/2024-08-16-02.png">

有了它，实现毛玻璃效果就非常 Easy 了，看这样一段代码：

```html
<div class="bg">
    <div>Normal</div>
    <div class="g-filter">filter</div>
    <div class="g-backdrop-filter">backdrop-filter</div>
</div>

.bg {
    background: url(image.png);
    
    & > div {
        width: 300px;
        height: 200px;
        background: rgba(255, 255, 255, .7);
    }
    .g-filter {
        filter: blur(6px);
    }
    .g-backdrop-filter {
        backdrop-filter: blur(6px);
    }
}
```

<img src="/public/2024-08-16-03.png">

CodePen Demo -- filter 与 backdrop-filter 对比[2]

filter 和 backdrop-filter 使用上最明显的差异在于：

filter 作用于当前元素，并且它的后代元素也会继承这个属性

backdrop-filter 作用于元素背后的所有元素

仔细区分理解，一个是当前元素和它的后代元素，一个是元素背后的所有元素。

理解了这个，就能够明白为什么有了 filter，还会有 backdrop-filter。

参考文章
<https://blog.csdn.net/qiwoo_weekly/article/details/122335081>
