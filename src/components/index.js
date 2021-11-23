import Embed from "./Embed";
import Image from "./Image";
import Link from "./Link";
import RichText from "./RichText";
import Text from "./Text";
import { SliceZone } from "./SliceZone";

const NuxtLink = Link({ component: "nuxt-link" });
const VueRouterLink = Link({ component: "router-link" });

const exp = {
	common: {
		Embed,
		Image,
		RichText,
		Text,
		SliceZone,
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
