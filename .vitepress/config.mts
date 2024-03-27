import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "鹤鸣的文档项目",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config+
    logo: "/logo.png",
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' },
      {
        text: '前端',
        items:[
          { text: 'Vue',link:"https://cn.vuejs.org/"},
          { text: 'React',link:"https://zh-hans.react.dev/"},
        ]
      },
    ],
    // 侧边栏
    sidebar: [
      {
        text: '演示',
        items: [
          { text: 'Markdown 演示', link: '/markdown-examples' },
          { text: 'Runtime API 演示', link: '/api-examples' }
        ]
      }
    ],
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/984507092' }
    ],
    footer:{copyright:`Copyright © 2024-present He Ming`}
    
  }
})
