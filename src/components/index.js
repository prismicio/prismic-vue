import Embed from "./Embed";
import Image from "./Image";
import Link from "./Link";
import RichText from "./RichText";
import Text from "./Text";

const NuxtLink = Link({ component: "nuxt-link" });
const VueRouterLink = Link({ component: "router-link" });

const exp = {
	common: {
		Embed,
		Image,
		RichText,
		Text,
	},
	nuxt: {
		Link: NuxtLink,
	},
	vueRouter: {
		Link: VueRouterLink,
	},
};

export const common = exp.common;
export const nuxt = exp.nuxt;
export const vueRouter = exp.vueRouter;

export default exp;
