---
date: 2024-06-05
---

# vue-router 4.0 动态路由会跳转到 404 页面的问题

## 引子

开发过前端单页面应用的小伙伴们，应该对前端路由都不陌生吧。

无论是用 vue 或者 react，都有官方提供的 router 方案。

但是有些场景下，处于安全性和友好性考虑，我们需要用到动态路由。

如果你不知道什么叫动态路由，可以想一想下面的场景。

比如现在我们的项目中有一些页面，只有 vip 用户能看到，普通用户不能看到，那么我们怎么做呢？

我们首先的做法肯定是，将该页面的入口隐藏掉。但是如果仅仅只是这样做，还不够，那只是假隐藏，因为用户仍然可以通过直接输入链接的方式来访问到该页面。

正确的做法应该是：首先隐藏掉入口；其次根据用户的权限，动态的生成对应的路由。

这篇文章主要是想分享下，最近使用 vue-router 4.0 版本过程中，由于用到了动态路由引起的一些问题，以及个人研究出来的解决方案。

为了清楚的描述我们的问题，现在假设我们有两个这样的页面：

<img src="/public/2024-06-05-1.png"  />

那么我们就会对应着两个不同的路由：

```js
[
 { path: '/home', name: 'home', component: Home },
 { path: '/vip', name: 'vip', component: Vip }
]
```

当然为了简化业务模型，这里，我们只用了两个路由。分别对应着两个页面，一个是所有用户都能看到的主页 home；一个是登录了的用户才能看到的 vip 页面。

当然在实际的业务逻辑中，肯定是需要登录、注册等页面，这里假设这些操作我们都能在 home 页面内完成。

如果不需要根据用户来区分的话，我们直接像下面这样生成对应的路由即可：

```js
const router = createRouter({
 history: createWebHistory(import.meta.env.BASE_URL),
 scrollBehavior: () => ({ y: 0 }),
 routes: [
  // 重定向到 /home 路径
  { path: '/', redirect: "/home", },
  { path: '/home', name: 'home', component: Home },
  { path: '/vip', name: 'vip', component: Vip },
  // 404 页面
  {
      path: "/404",
      name: "NotFound",
      component: () => import("@views/404.vue"),
      hidden: true,
      meta: { title: "404" },
  },
  // 当什么都没有匹配到的时候，重定向页面到 404 页面
  { path: "/:pathMatch(.*)", redirect: "/404", name: "notMatch", hidden: true },
 ],
})

```

但是如果现在的需求是需要我们来动态的区分，我们应该怎么做呢？

## 动态路由

我们先来了解下，如何实现动态路由。

如果你没有用过 vue-router 的动态路由，可以先参考下 vue-router 的官方文档：

<a class="cursor-pointer" target="_blank" href="https://router.vuejs.org/guide/advanced/dynamic-routing.html">Dynamic Routing | Vue Router</a>

根据文档里所写，想要动态的添加、删除路由，直接通过下面的方式即可：

```js
// 增加 route
router.addRoute({ path: '/home', name: 'home', component: Home })

// 删除 route
router.removeRoute('home')

```

## 初窥门径

所以，我们可以稍微改造下我们之前的代码：

```js
// router.js
const router = createRouter({
 history: createWebHistory(import.meta.env.BASE_URL),
 scrollBehavior: () => ({ y: 0 }),
 routes: [
  // 重定向到 /home 路径
  { path: '/', redirect: "/home", },
  { path: '/home', name: 'home', component: Home },
  // 404 页面
  {
      path: "/404",
      name: "NotFound",
      component: () => import("@views/404.vue"),
      hidden: true,
      meta: { title: "404" },
  },
  // 当什么都没有匹配到的时候，重定向页面到 404 页面
  { path: "/:pathMatch(.*)", redirect: "/404", name: "notMatch", hidden: true },
 ],
})

export default router;

// api.js
export const login = async () => {
 // 执行登录操作
 let res = await dologin();

 if (res.sucess) {
  await storeUserInfo(res);
  // 登录成功，动态的添加 vip 路由
  router.addRoute({ path: '/vip', name: 'vip', component: Vip });
 }
}

// permission.js
router.beforeEach(async (to, from, next) => {
 // 如果存在用户信息
 if (await getUserInfo()) {
  // 如果 vip 这个 router 没有初始化，那么动态的增加 vip 路由
  if (!router.hasRoute("vip")) {
   router.addRoute({ path: '/vip', name: 'vip', component: Vip });
  }
    }
 next();
});

router.afterEach((to) => {
  // 在导航被确认后，调用 afterEach 钩子，执行一些操作
  doSomething();
});

```

经过改造之后，我们在初始化的时候，没有加入 vip 路由，那么你即使直接通过 `https://example.com/vip` 链接也无法访问到该页面，会被最后的 notMatch 路由匹配到，最后被重定向到 404 页面。

关于 noMatch 路由的用法，不了解的小伙伴，可以参考下 vue-router 官方文档：<a class="cursor-pointer" target="_blank" href="https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route">Dynamic Route Matching with Params | Vue Router。</a>他的作用是，确保当路由没有匹配到的时候，永远能正确的将页面导航到 404 页面。

当用户在我们 home 页面执行登录操作，登录成功后，保存用户信息，并且动态的添加 vip 路由。

当然，仅仅只是在登录的时候动态新增路由，还不够。

为了用户体验的友好性，我们不可能让用户每次用我们的页面的时候，都先执行一遍登录。

所以，我们就会借用，router 提供的一些列的生命周期函数，来帮助我们确保，当用户信息存在的时候，能自动添加我们的动态路由。

如果你不了解 router 的生命周期的话，可以参考下这个页面：<a class="cursor-pointer" target="_blank" href="https://router.vuejs.org/guide/advanced/navigation-guards.html#the-full-navigation-resolution-flow">Navigation Guards | Vue Router</a>

在 beforeEach 方法内，我们每次通过 getUserInfo 方法拿用户的信息。当我们识别到存在用户信息后，就需要判断路由 vip 是否存在，当不存在的时候，动态的创建该路由。

可以说，整个流程下来，是很清晰明了的，逻辑也很通畅。

## 棘手的问题

如果没有经验的小伙伴，也许看不出来，上面的代码会出现什么问题。

设想下，用户在实际使用我们的系统的时候，可能会通过几种场景进入我们的 vip 页面。

一种场景是，当用户未登录，这时候，也没有 vip 这个路由的存在，那么路由匹配不到，会直接被 noMatch 捕获，然后再进一步重定向到 404 页面。

也就是说，这种未登录的场景下，会被跳转到 404 页面。当然为了用户让用户体验更友好，这时候，其实我们应该先提醒用户登录，登录成功后再激活路由跳转。如果这时候，用户不想登录，那么我们可以直接拒绝用户的跳转需求。

另外一种场景是，当用户已经登陆过了，这时候他点击 vip 路由，想要跳转。这时候，借助我们上面改造过的代码，直接跳转到 vip 页面，不存在任何的问题。

但是还有第三种使用场景是，用户不通过我们的 home 页面进入 vip 页面，他直接在浏览器上输入链接 `https://example.com/vip` 想一步到位，直接进入我们的 vip 页面。

这第三种使用场景下面，也会分为两种子情景。当用户未登录，自然是拿不到用户信息，也没有 vip 路由，自然会被 noMatch 捕获到，最后重定向到 404 页面；当用户已经登录，系统也存在用户信息，我们通过 getUserInfo 方法也能拿到用户的信息，然后也会进一步成功的动态创建 vip 路由，这时候，你在实际使用的时候，还是会发现，我们仍旧被重定向到了 404 页面了。

这第三种情况下的第二种子情景，就是我们这篇文章想要解决的问题。

我们理想中使用过程中的流程是下面这样的：

<img src="/public/2024-06-05-2.png"  />

但是却走不通，是为什么呢？

原来真实的流程是下面这样的：

<img src="/public/2024-06-05-3.png"  />

## 解决方案

了解了实际的流程走向后，我们就知道该怎么解决这个问题了。

我们可以在动态增加了 vip 路由后，再直接把用户重定向到 vip 页面就行了。

整个流程就会变成下面这样：

<img src="/public/2024-06-05-4.png"  />

理清了思路以后，我们就可以着手来改造我们的代码了。

```js
// permission.js
router.beforeEach(async (to, from, next) => {
 // 如果存在用户信息
 if (await getUserInfo()) {
  // 如果 vip 这个 router 没有初始化，那么动态的增加 vip 路由
  if (!router.hasRoute("vip")) {
   router.addRoute({ path: '/vip', name: 'vip', component: Vip });
  }

  // 如果当前路由目标是 /404，且来自 /vip
  if (to.name === "NotFound" && to.redirectedFrom?.path === "/vip") {
   // 重定向到 /vip 路由
   next({
    path: to.redirectedFrom.path,
    query: to.redirectedFrom.query,
    replace: true,
   });
   return;
  }
    }
    
 next();
});

```

我们在添加完 vip 路由以后，可以判断，当前想要加载的路由是否为 404，如果是，并且是由 /vip 跳转而来，则再重定向回去即可。

当然以上的代码只适用于我们文章一开始假设的场景，真实的业务场景中，应该会有更多更复杂的情况，但是万变不离其宗，只要理清了思路，掌握了原理，找到了应对方案，再复杂的场景也能一步步抽丝剥茧，应付起来将会游刃有余。
