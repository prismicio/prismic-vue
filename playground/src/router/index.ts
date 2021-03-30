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
  },
  {
    path: "/components/link",
    name: "ComponentsLink",
    component: () =>
      import(
        /* webpackChunkName: "components--link" */ "../views/components/link.vue"
      )
  },
  {
    path: "/components/richtext",
    name: "ComponentsRichText",
    component: () =>
      import(
        /* webpackChunkName: "components--richtext" */ "../views/components/richtext.vue"
      )
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
