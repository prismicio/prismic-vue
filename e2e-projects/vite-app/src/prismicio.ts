import * as prismic from "@prismicio/client"

export function createClient(): prismic.Client {
	const repositoryName = document.cookie.match(/(?:^|; )repository-name=([^;]*)/)?.[1]
	if (!repositoryName) throw new Error("A repository-name cookie is required.")

	return prismic.createClient(repositoryName, {
		routes: [{ type: "page", path: "/page" }],
	})
}
