import type { Locator } from "@playwright/test"

export { expect } from "@playwright/test"
export { test } from "./test"

/** Returns an element's inner HTML without Vue's placeholder comments (e.g. `<!--v-if-->`). */
export async function html(locator: Locator): Promise<string> {
	const innerHTML = await locator.innerHTML()

	return innerHTML.replace(/<!--(?!prismic-slice-).*?-->/g, "")
}
