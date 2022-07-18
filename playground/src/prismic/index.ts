import { createPrismic } from "../../../src";

const prismic = createPrismic({
	endpoint: "200629-sms-hoy",
	linkResolver: (doc) => `/${doc.uid}`,
});

export default prismic;
