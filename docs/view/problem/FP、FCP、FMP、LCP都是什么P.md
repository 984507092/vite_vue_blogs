---
date: 2024-04-28
---

# FP、FCP、FMP、LCP都是什么P？

## 1. 简介

面试中经常问到前端性能监控相关指标，你知道FP、FCP、FMP、LCP​代表什么事件吗？​它们的先后顺序如何呢？如何计算？​前端性能监控中常用哪些指标？

本文将介绍前端项目中常用到的性能指标和它们的计算方法以及实际应用场景。

最初，评价前端页面加载性能有两个指标：DOMContentLoaded和load事件，分别代表DOM构造完成和首屏资源加载完成。

对于之前的页面和现代的服务端渲染的页面，这两个指标都可以很好地衡量首屏内容展示时间。但对于现代复杂的单页应用，都是通过JS操作DOM向页面添加主要内容，对于这种场景，DOMContentLoaded和load事件就不能很好地衡量首屏显示时间了。

于是有FP、FCP、FMP被提出来，它们关注的不是“加载”，而是“渲染”，因此能更好地表现用户看到的情况。

FP、FCP这两个指标虽然表达了渲染的事件，但对“用户关注的内容”没有体现，比如首屏渲染出来一个背景，或者一个loading，可能对于用户来说和白屏区别不大。FMP虽然体现了“关键内容”的要素，但它是复杂的、模糊的，甚至是错误的，并不能准确识别页面主要内容的加载时机。

后来LCP指标被提出来，表示“用于度量视口中最大的内容元素何时可见”，它用来代替FMP，表征页面的关键元素何时可以被用户看到。


除了加载性能，还有可交互时间、稳定性指标、流畅性指标，在不同的业务场景都可以被监控用来作为提升用户体验的依据。


谷歌一直十分重视网站的用户体验，移动友好性，页面加载速度和HTTPS是Google已经使用的页面排名因素，而2020年，谷歌将Core Web Vitals新纳入的用户体验指标。其中核心的3个就是LCP、FID、CLS。后面会详细说明。

## 2. 加载性能指标

我们知道我们使用浏览器访问页面时候，浏览器将页面从网络下载到本地后，主要做几个事情：解析HTML，创建DOM，同时加载依赖的资源：CSS、图片等（加载资源的过程不会阻塞DOM解析），然后调用渲染进程渲染到界面上。

这里需要注意一点，在现在浏览器中，为了减缓渲染被阻塞的情况，现代的浏览器都使用了猜测预加载。当解析被阻塞的时候，浏览器会有一个轻量级的HTML（或CSS）扫描器（scanner）继续在文档中扫描，查找那些将来可能能够用到的资源文件的url，在渲染器使用它们之前将其下载下来。

在整个加载和渲染过程中会触发多个事件

## <span class="c-red">关键事件</span>

- load（Onload Event），它代表页面中依赖的所有资源加载完的事件。
- DCL（DOMContentLoaded），DOM解析完毕。
- FP（First Paint），表示渲染出第一个像素点。FP一般在HTML解析完成或者解析一部分时候触发。
- FCP（First Contentful Paint），表示渲染出第一个内容，这里的“内容”可以是文本、图片、canvas。
- FMP（First Meaningful Paint），首次渲染有意义的内容的时间，“有意义”没有一个标准的定义，FMP的计算方法也很复杂。
- LCP（largest contentful Paint），最大内容渲染时间。

下面对各个事件和特点详细说明

## 白屏和首屏

白屏时间 = 地址栏输入网址后回车 - 浏览器出现第一个元素

首屏时间 = 地址栏输入网址后回车 - 浏览器第一屏渲染完成


根据白屏和首屏的定义，我们可以用FP和FCP来计算白屏和首屏。

#### 白屏结束时间 = FP事件触发时间

#### 首屏结束时间 = FCP事件触发时间

当然FCP代表第一个内容被渲染出来，有些业务中希望用更关键的内容的渲染来表示首屏，这时候可以用FMP或者LCP来作为首屏的计算指标。

### load事件

Onload Event代表页面中依赖的所有资源：DOM、图片、CSS、Flash等都加载完，window.onload注册的回调就会在load事件触发时候被调用。

有时候FCP比Onload Event先触发，因为渲染第一个内容时候可能不包括图片的展示，只有文本内容。

所有依赖的资源包括异步加载的资源，但不包括延时加载的资源。

```html
<html>
<head>
    <title>demo</title>
</head>
<body>
    <script>
        // 该资源算在Onload Event加载的资源中
        const img = document.createElement('img');
        img.src = 'https://domain/path/image.png';
        document.appendChild(img);

        // 该资源算在Onload Event加载的资源中
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = 'https://domain/path/image.png';
            document.appendChild(img);
        }, 0);

        // 该资源不会算在Onload Event加载的资源中
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = 'https://domain/path/image.png';
            document.appendChild(img);
        }, 5000);
    </script>
</body>
</html>
```

## DCL

DOMContentLoaded事件，当 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，无需等待样式表、图像和子框架的完成加载。

可以通过注册回调监听该事件

```javascript
 document.addeventListener('DOMContentLoaded', function() {}, false);
```

`document.onload`和`document.body.onload`也是这个事件的回调。

## DCL和load的先后顺序

如果需要渲染的内容不多，DCL在load之前，如果需要渲染的内容很多，那么DCL会在load之后。

## FP和FCP的关系

浏览器渲染的界面可能是“内容”，例如文本，也可能不是“内容”，比如一个背景为红色的div标签。FCP事件指渲染出第一个内容的事件，而FP指渲染出第一个像素点，渲染出的东西可能是内容，也可能不是。

有节点不一定有渲染，如果没有任何样式，是没有界面的，也不需要渲染。下面代码就没有FP事件

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>no FP</title>
  </head>
  <body>
    <div></div>
  </body>
</html>
```

下面代码，会渲染界面，因此会触发FP事件，但是不会触发FCP，因为没有内容

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>has FP, no FCP</title>
    <style>
        div {
            width: 1px;
            height: 1px;
            background-color: red;
        }
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```

注意：渲染的操作一定是发生在视口内的，对于视口外不可见的内容，不会触发“Paint”操作，比如下面代码，不会触发FP事件。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>no FP</title>
    <style>
        div {
            position: absolute;
            left: -99999px;
            width: 1px;
            height: 1px;
            background-color: red;
            float: left;
        }
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```

通过上面对FP和FCP的介绍，可以知道，如果html本身有内容（文本、图片）或者js脚本很快能创建内容，那么FP和FCP会一起触发。否则FP比FCP提前触发。FP肯定不会在FCP后面出现，因为渲染出内容，一定也渲染出了像素。

## FP和DCL的先后顺序

浏览器不一定等到所有的DOM都解析完再开始渲染，如果DOM节点少，浏览器会加载完再渲染，但是如果节点很多，浏览器解析一部分节点后就会开始渲染（这时候就会触发FP）。也就是说，当需要渲染的节点数少的时候，DCL会在FP前面；当需要渲染的节点数很多时候，DCL会在FP后面。

例如下面的代码，只有一个div，会先触发DCL然后再触发FP。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FP after DCL</title>
    <style>
        div {
            width: 1px;
            height: 1px;
            background-color: red;
            float: left;
        }
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```
而下面的代码，有10000个div，FP会在DCL前面。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FP before DCL</title>
    <style>
        div {
            width: 1px;
            height: 1px;
            background-color: red;
            float: left;
        }
    </style>
</head>
<body>
    <!-- 10000个div... -->
</body>
</html>
```

## 各指标的计算

FP、FCP和L时间都可以通过performance API计算

```javascript
// load
// loadEventStart是load事件发送给文档，也即load回调函数开始执行的时间
// loadEventEnd是load回调函数执行完成的时间
const loadTime = performance.timing.loadEventStart - performance.timing.fetchStart

// DCL
const dcl = performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart

// FP
const fp = performance.getEntries('paint').filter(entry => entry.name == 'first-paint')[0].startTime;

// FCP
const fcp = performance.getEntries('paint').filter(entry => entry.name == 'first-contentful-paint')[0].startTime;

// Onload Event
const l = performance.timing.loadEventEnd - performance.timing.navigationStart;

// LCP
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});

// LCP也可以通过web-vitals计算
import {getLCP, getFID, getCLS} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

FMP计算比较复杂，lighthouse的计算的大体思路是，将页面中最大布局变化后的第一次渲染事件作为FMP事件，并且计算中考虑到了可视区的因素。

FMP计算过于复杂，没有现成的performance API，如果希望在监控中上报这个指标，可以自己使用MutationObserver计算

## 3. 可交互时间

## 首次可交互时间

文档首次可交互时间可以用来衡量页面可交互的性能。

首次可交互，即DOM加载并解析完成后，界面上的元素可以交互（如输入框可以输入、按钮可以点击、超长元素可以滚动）。其时间用`performance.timing.domInteractive`计算。

`performance.timing.domInteractive`：当前网页DOM结构结束解析、开始加载内嵌资源的时间，`document.readyState` 变成`interactive`，并将抛出`"readyStateChange"`事件（注意只是DOM树解析完成，这时候并没有开始加载网页内的资源）

```javascript
const timeToInteractive = performance.timing.domInteractive - performance.timing.fetchStart, //首次可交互时间
```

## TTI

用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点

TTI的计算方法参考文章：深入浅出前端监控



这里定义一下什么是完全可交互状态的页面：

页面已经显示有用内容。
页面上的可见元素关联的事件响应函数已经完成注册。
事件响应函数可以在事件发生后的 50ms 内开始执行（主线程无 Long Task）。


计算方法描述如下：

1. 从 FCP 时间开始，向前搜索一个不小于 5s 的静默窗口期。（静默窗口期定义：窗口所对应的时间内没有 Long Task，且进行中的网络请求数不超过 2 个）
2. 找到静默窗口期后，从静默窗口期向后搜索到最近的一个 Long Task，Long Task 的结束时间即为 TTI。
3. 如果一直找到 FCP 时刻仍然没有找到 Long Task，以 FCP 时间作为 TTI。

其实现需要支持 Long Tasks API 和 Resource Timing API。

### **longTask**

`Long Task`：阻塞主线程达 50 毫秒或以上的任务，可以通过`PerformanceObserver`获取。

```js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('longtask candidate: ', entry.startTime);
  }
});

observer.observe({entryTypes: ['longtask']});
```

## FID

FID（First Input Delay） 用于度量用户第一次与页面交互的延迟时间，是用户第一次与页面交互到浏览器真正能够开始处理事件处理程序以响应该交互的时间。

相对于TTI，FID表示实际的用户操作的延时，更能从用户角度反映网页的交互性能。

其计算使用简洁的 PerformanceEventTiming API 即可，回调的触发时机是用户首次与页面发生交互并得到浏览器响应（点击链接、输入文字等）。

```js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('fid', entry.processingStart - entry.startTime);
  }
});

observer.observe({type: 'first-input', buffer: true});
```

## 4. 稳定性指标 CLS

CLS（Cumulative Layout Shift）是对在页面的整个生命周期中发生的每一次意外布局变化的最大布局变化得分的度量，布局变化得分越小证明你的页面越稳定。

听起来有点复杂，这里做一个简单的解释：

不稳定元素：一个非用户操作但发生较大偏移的可见元素称为不稳定元素。
布局变化得分：元素从原始位置偏移到当前位置影响的页面比例 * 元素偏移距离比例。

网站应努力使 CLS 分数小于 0.1 。

可以通过web-vitals获取CLS。

```js
import {getCLS} from 'web-vitals';

getCLS(console.log);
```

减少CLS的方法，参考文章：页面视觉稳定性之CLS

## 5. 流畅性指标
FPS
Chrome DevTool 中有一栏 Rendering 中包含 FPS 指标，但目前浏览器标准中暂时没有提供相应 API ，只能手动实现。这里需要借助 requestAnimationFrame 方法模拟实现，浏览器会在下一次重绘之前执行 rAF 的回调，因此可以通过计算每秒内 rAF 的执行次数来计算当前页面的 FPS。

FPS过低会让用户感觉卡顿，因此这个计算可以用来监控页面卡顿情况。

longTask
长任务监听，PerformanceObserver 监听，参考上面TTI一节中长任务的监听。

## 6. Core Web Vitals
Core Web Vitals是谷歌提出的，衡量用户体验的新指标，指标将被纳入谷歌搜索引擎的网页排名。

Core Web Vitals是用户体验和SEO的重要指标。

关键的指标包括

1. LCP，用来衡量页面加载性能，为了提供良好的用户体验，LCP应该在页面首次开始加载后的2.5秒内发生

2. FID，衡量交互性能，为了提供良好的用户体验，页面的FID应该小于100毫秒。
3. CLS，测量视觉稳定性。为了提供良好的用户体验，页面应该保持CLS小于0.1。

Chrome提供了web-vitals库获取3个关键指标的数值。

```js
import {getLCP, getFID, getCLS} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

