import VueRouter from "vue-router";

import { WrapperComponent } from "./WrapperComponent";

const routes = [
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

const router = new VueRouter({
	mode: "abstract",
	routes,
});

export default router;
