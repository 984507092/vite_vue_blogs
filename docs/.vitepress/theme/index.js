// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import '../style/index.scss'

import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'
import Layout from "./Layout.vue"

// 自动注册全局组件
import autoRegister from '../../components/formatStyle/autoRegister'


// vite如下配置
import 'virtual:uno.css'


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router, siteData }) {
    app.use(naive)
    app.use(autoRegister)
  }
}
