---
layout: home

hero:
  name: "鹤鸣的文档项目"  # 标题
  text: "属于我的文档站点" # 描述
  tagline: 努力是为了寻找自己喜欢的生活的时候不被外物干扰。 # 标语
  image:
    src: /background.png
    alt: 背景图片
  actions:
    - theme: brand  #主题
      text: 知识汇总  # 按钮文字
      link: /view/learningNotes/api-examples # 跳转链接

    - theme: alt
      text: 学习笔记
      link: /view/blogs/vue/1.Ref

    - theme: alt
      text: webpack
      link: /view/blogs/webpack/1.搭建最简单的webpack
features:
  - title: <svg class="home-features-title" viewBox="0 0 128 128" width="24" height="24" ><path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" ></path><path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" ></path></svg>Vue3
    details: 易学易用、性能出色、灵活多变
    link: https://cn.vuejs.org/
    # icon: 
    linkText: 过去瞧瞧
  - title: <img class="home-features-title"  src="vite-logo.svg" width="24" height="24" ></img>Vite3
    details: 极速的服务启动、轻量快速的热重载、丰富的功能、优化的构建、通用的插件、完全类型化的API
    link: https://vitejs.cn/vite3-cn/
    linkText: 过去瞅瞅 
  - title: <img class="home-features-title"  src="naive-logo.svg" width="24" height="24" ></img>Navie
    details: Naive UI 是一个 Vue3 的组件库。它比较完整，主题可调，用 TypeScript 写的，快。
    linkText: 过去喵喵
    link: https://www.naiveui.com/zh-CN/os-theme
---

<script setup> 
import { defineClientComponent } from 'vitepress'
const weather = defineClientComponent(async () => {
  return await import('./components/weather.vue')
})
</script>

<weather></weather>