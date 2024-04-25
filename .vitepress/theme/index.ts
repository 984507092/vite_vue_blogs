// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

import naive from "naive-ui";
// 通用字体
import "vfonts/Lato.css";
import Layout from "./Layout.vue";

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router, siteData }) {

   app.use(naive);
  }
} satisfies Theme
