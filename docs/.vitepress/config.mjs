import { defineConfig } from "vitepress";
import mySidebar from "./plugin/sidebar_blog.js";
import UnoCSS from 'unocss/vite'

export default defineConfig({
  vite: {
    plugins: [
      UnoCSS(),
    ],
  },
  base: "/vite_vue_blogs/",
  head: [["link", { rel: "icon", href: "/vite_vue_blogs/logo.png" }]],
  // head: [["link", { rel: "icon", href: "/logo.png" }]],
  title: "鹤鸣的文档项目",
  description: "A VitePress Site",
  // outDir: "./dist",
  markdown: {
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true
    }
  },
  assetsDir: 'static',
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
          {
            text: "webpack",
            link: "/view/blogs/webpack/1.搭建最简单的webpack"
          },
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
      {
        icon: {
          svg: '<svg t="1715001671340" class="icon" viewBox="0 0 1079 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4279" width="200" height="200"><path d="M793.38012 84.961567a193.065981 193.065981 0 0 0-268.129553-51.814089L263.789989 210.251377a193.065981 193.065981 0 0 0-51.646947 268.129553c56.176501 83.05297 165.320372 107.188307 251.599187 60.1712a42.136554 42.136554 0 0 0 5.315123-3.225845 34.16387 34.16387 0 0 0-0.986139-59.168347c-10.680388-5.933549-24.269051-6.468404-34.732154-0.20057l0.43457 0.768854-0.43457-0.768854c-56.828356 34.214013-127.328945 23.884624-164.952659-31.757023a126.225806 126.225806 0 0 1 33.8463-175.348905L558.311298 95.474813a126.225806 126.225806 0 0 1 175.332191 33.762729c39.094566 57.764352 26.542185 126.175664-31.222167 165.270229l-39.077851 27.227468a35.099867 35.099867 0 1 0 39.261708 58.015066c0.31757-0.183856 0.451284-0.568284 0.768854-0.75214l38.325712-25.907045a193.065981 193.065981 0 0 0 51.680375-268.129553z m0 0" fill="#D42825" p-id="4280"></path><path d="M340.491554 343.213015a32.910304 32.910304 0 0 0-5.26498 3.342844 34.130442 34.130442 0 0 0 2.507134 59.084776c10.797388 5.649407 24.38605 5.849978 34.682011-0.685283l-0.518141-0.635141 0.518141 0.635141c55.858931-35.601293 143.391312-26.993469 182.419021 27.745609a126.209092 126.209092 0 0 1-29.467174 176.101045L273.450809 788.446466a126.309377 126.309377 0 0 1-176.084331-29.450459c-40.481846-56.828356-29.65103-125.473666 27.177325-165.955513l38.442711-28.247035a35.099867 35.099867 0 1 0-40.665702-57.012212c-0.31757 0.183856-0.43457 0.568284-0.75214 0.75214L83.878101 535.393142a193.082695 193.082695 0 1 0 224.171148 314.377806L565.097273 666.399216a193.082695 193.082695 0 0 0 45.028114-269.349691c-58.215636-81.582119-184.575156-102.92618-269.700689-53.83651z m0 0" fill="#D42825" p-id="4281"></path></svg>',
        },
        link: "https://gitee.com/pimingyu/vitepress",
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
