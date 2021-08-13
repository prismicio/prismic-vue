import { createClient } from "@prismicio/client";
import { createPrismic } from "../../../src";

const prismic = createPrismic({
	client: createClient(""),
	// endpoint: "https://200629-sms-hoy.cdn.prismic.io/api/v2",
	linkResolver: (doc) => `/${doc.uid}`,
});

export default prismic;
