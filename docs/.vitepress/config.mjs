import { defineConfig } from "vitepress";
import mySidebar from "./plugin/sidebar_blog.js";
import UnoCSS from 'unocss/vite'
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  vite: {
    plugins: [
      UnoCSS(),
      viteCompression({
        ext: '.gz',
        threshold: 10240, // 单位b
        algorithm: 'gzip', // 压缩算法
        deleteOriginFile: false, // 删除源文件
        filter: (source) => {
          // 排除特定文件 
          return !(/\.(jpg|jpeg|png|gif|webp|svg)$/i).test(source);
        },
      })
    ],
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: true,
          drop_debugger: true
        }
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://u8cxua.natappfree.cc',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
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
      { text: "皮辟博客", link: "https://ppblogs.cn/" },
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
      {
        icon: {
          svg: '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="180.000000pt" height="180.000000pt" viewBox="0 0 180.000000 180.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,180.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M0 900 l0 -900 900 0 900 0 0 900 0 900 -900 0 -900 0 0 -900z m1055 585 c108 -29 184 -73 271 -160 88 -87 140 -177 169 -290 33 -128 9 -302 -57 -428 -39 -73 -152 -192 -222 -232 -89 -52 -173 -77 -281 -82 -183 -10 -327 47 -460 181 -133 134 -181 259 -172 451 6 135 30 209 101 314 81 119 208 209 346 245 74 20 231 20 305 1z"/><path d="M688 1209 c-117 -77 -219 -148 -225 -157 -14 -17 -19 -288 -5 -308 14 -21 432 -294 449 -293 10 0 112 64 228 142 l210 142 3 161 2 160 -202 136 c-112 74 -213 140 -225 146 -20 11 -43 -2 -235 -129z m180 -66 l-3 -88 -84 -57 -83 -57 -64 42 c-35 23 -64 45 -64 49 0 9 280 198 293 198 4 0 6 -39 5 -87z m220 -4 c75 -50 141 -95 145 -99 9 -8 -103 -90 -123 -90 -5 0 -46 24 -90 53 l-80 52 0 88 c0 48 2 87 5 87 3 0 67 -41 143 -91z m-113 -286 c-35 -23 -68 -43 -71 -43 -9 0 -134 81 -134 86 0 2 30 24 66 48 l67 44 68 -45 69 -46 -65 -44z m-377 66 c12 -8 22 -17 22 -21 0 -4 -20 -21 -45 -38 l-45 -31 0 67 0 66 23 -14 c12 -8 32 -21 45 -29z m682 -19 c0 -33 -3 -60 -7 -60 -5 0 -27 13 -50 28 l-43 28 43 31 c23 17 45 32 50 32 4 1 7 -26 7 -59z m-495 -107 l85 -56 0 -89 c0 -48 -2 -88 -5 -88 -10 0 -295 193 -295 200 0 6 119 90 128 90 1 0 40 -25 87 -57z m393 12 c34 -22 62 -42 62 -45 0 -4 -152 -106 -271 -183 l-29 -19 0 90 0 89 83 56 c45 31 85 55 88 54 3 -1 33 -20 67 -42z"/></g></svg>',
        },
        link: 'https://codepen.io/heming-yanxing'
      }
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
    // lastUpdated: true,
    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
});
