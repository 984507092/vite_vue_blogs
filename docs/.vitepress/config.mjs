import { defineConfig } from "vitepress";
import mySidebar from "./plugin/sidebar_blog.js";
import UnoCSS from 'unocss/vite'

export default defineConfig({
  vite: {
    plugins: [
      UnoCSS(),
    ],
  },
  // base: "/vite-personal-blog/",
  // head: [["link", { rel: "icon", href: "/vite-personal-blog/logo.png" }]],
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  title: "鹤鸣的文档项目",
  description: "A VitePress Site",
  outDir: "../dist",
  themeConfig: {
    outlineTitle: "文章目录",
    outline: [2, 6],
    logo: "/logo.png",
    // 导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "问题记录", link: "/view/问题记录.md" },
      {
        text: "学习",
        items: [
          {
            text: "Vue",
            link: "/view/blogs/vue/1.Ref.md"
          },
          {
            text: "React",
            link: "/view/blogs/react/1.React快速上手.md"
          },
          {
            text: "TypeScript",
            link: "/view/blogs/typescript/1.TypeScript.md"
          },
          // {
          //   text: "uniapp",
          //   link: "/view/blogs/vue/1.Ref.md"
          // },
        ]
      },
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
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/984507092",
      },
      {
        icon: {
          svg: '<svg t="1714028126581" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4249" width="32" height="32"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="4250"></path></svg>',
        },
        link: "https://gitee.com/li-shengao",
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © 2023-present He Ming`,
    },
    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
});
