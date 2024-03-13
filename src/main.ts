import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// router
import router from "./router";
//pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
// ElementPlus
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

//全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);
app.use(pinia)
app.mount("#app");
