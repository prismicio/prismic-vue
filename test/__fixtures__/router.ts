import { RouteRecordRaw, createMemoryHistory, createRouter } from "vue-router";

import { WrapperComponent } from "./WrapperComponent";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Index",
		component: WrapperComponent,
	},
	{
		path: "/foo",
		name: "Foo",
		component: WrapperComponent,
	},
	{
		path: "/bar",
		name: "Bar",
		component: WrapperComponent,
	},
	{
		path: "/baz",
		name: "Baz",
		component: WrapperComponent,
	},
];

const router = createRouter({
	history: createMemoryHistory(),
	routes,
});

export default router;
