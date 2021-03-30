import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "index" */ "../views/index.vue")
  },
  {
    path: "/components/image",
    name: "ComponentsImage",
    component: () =>
      import(
        /* webpackChunkName: "components--image" */ "../views/components/image.vue"
      )
  },
  {
    path: "/components/embed",
    name: "ComponentsEmbed",
    component: () =>
      import(
        /* webpackChunkName: "components--embed" */ "../views/components/embed.vue"
      )
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
