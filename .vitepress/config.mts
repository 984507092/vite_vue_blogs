import { defineConfig } from 'vitepress'
import {mySidebar} from "./utils/sidebar_blog"

export default defineConfig({
  title: "鹤鸣的文档项目",
  description: "A VitePress Site",
  themeConfig: {
    outlineTitle: "文章目录",
    outline: [2, 6],
    logo: "/logo.png",
    // 导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "学习", link: "/src/view/learningNotes/markdown-examples" },
      {
        text: "前端",
        items: [
          { text: "Vue", link: "https://cn.vuejs.org/" },
          { text: "React", link: "https://zh-hans.react.dev/" },
          { text: "TypeScript", link: "https://ts.nodejs.cn/" },
          { text: "uniapp", link: "https://uniapp.dcloud.net.cn/" },
          {
            text: "微信小程序",
            link: "https://developers.weixin.qq.com/miniprogram/dev/framework/",
          },
          {
            text: "支付宝小程序",
            link: "https://opendocs.alipay.com/mini",
          },
        ],
      },
    ],
    // 侧边栏
    sidebar: mySidebar,
    // sidebar: false, // 关闭侧边栏
    // aside: "left", // 设置右侧侧边栏在左侧显示
    // sidebar: [
    //   {
    //     text: '演示',
    //     items: [
    //       { text: 'Markdown 演示', link: '/src/view/markdown-examples' },
    //       { text: 'Runtime API 演示', link: '/src/view/api-examples' }
    //     ]
    //   }
    // ],
    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/984507092" }],
    footer: { copyright: `Copyright © 2024-present He Ming` },
  },
});
