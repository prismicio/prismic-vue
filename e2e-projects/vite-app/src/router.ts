import { h } from "vue"
import { createRouter, createWebHistory } from "vue-router"

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: "/PrismicImage", component: () => import("./pages/PrismicImage.vue") },
		{ path: "/PrismicLink", component: () => import("./pages/PrismicLink.vue") },
		{ path: "/PrismicRichText", component: () => import("./pages/PrismicRichText.vue") },
		{ path: "/PrismicTable", component: () => import("./pages/PrismicTable.vue") },
		{ path: "/PrismicText", component: () => import("./pages/PrismicText.vue") },
		{ path: "/SliceZone", component: () => import("./pages/SliceZone.vue") },
		// Links in the tests point to pages that don't exist.
		{ path: "/:path(.*)*", component: { render: () => h("p", "Not found") } },
	],
})
