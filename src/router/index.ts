import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import Layout from '../components/HelloWorld.vue'

const routes: Array<RouteRecordRaw> = [
  {
    //路由初始指向
    path: "/",
    name: "HelloWorld",
    component: () => import("../components/HelloWorld.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
