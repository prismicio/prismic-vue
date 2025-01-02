import { version } from "../../package.json"

/**
 * Returns a `prismic.dev/msg` URL for a given message slug.
 *
 * @example
 *
 * ```ts
 * devMsg("missing-param")
 * // => "https://prismic.dev/msg/svelte/v1.2.3/missing-param.md"
 * ```
 *
 * @param slug - Slug for the message. This corresponds to a Markdown file in
 *   the Git repository's `/messages` directory.
 *
 * @returns The `prismic.dev/msg` URL for the given slug.
 */
export const devMsg = (slug: string): string => {
	return `https://prismic.dev/msg/vue/v${version}/${slug}`
}
