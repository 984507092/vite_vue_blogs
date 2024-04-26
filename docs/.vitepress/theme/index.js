// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'

import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'
import Layout from "./Layout.vue"

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router, siteData }) {
    app.use(naive)
  }
}
