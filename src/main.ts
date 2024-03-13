import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
//pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});

app.use(router);
app.use(pinia)
app.mount("#app");
