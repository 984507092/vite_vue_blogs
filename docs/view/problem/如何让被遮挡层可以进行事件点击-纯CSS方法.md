---
date: 2024-05-06
---

# 如何让被遮挡层可以进行事件点击？（纯CSS方法）

css 属性添加

```css
外层（被遮挡的层）{
  pointer-events: none;
}
内层（要发生事件的层）{
  pointer-events: auto;
}
```

pointer-events属性本身有很多取值，但只有none和auto可以用在浏览器上，其他都只能应用在SVG上

- 取值 none元素永远不会成为鼠标事件的target
- 取值auto：与pointer-events属性未指定时的表现效果相同（即将元素恢复成为鼠标事件的target）
  
这里不要忘了给内层添加auto属性，否则被外层包裹的所有内层无法成为鼠标事件的target了
