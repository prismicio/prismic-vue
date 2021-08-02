import { createPrismic } from "@prismicio/vue";

const prismic = createPrismic({
	endpoint: "https://200629-sms-hoy.cdn.prismic.io/api/v2",
});

export default prismic;
