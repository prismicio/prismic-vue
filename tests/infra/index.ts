import type { Locator } from "@playwright/test"

export { expect } from "@playwright/test"
export { test } from "./test"

/** Returns an element's inner HTML without Vue's placeholder comments (e.g. `<!--v-if-->`). */
export async function html(locator: Locator): Promise<string> {
	return await locator.evaluate((element) => {
		const clone = element.cloneNode(true) as Element
		const walker = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT)
		const comments: Comment[] = []
		while (walker.nextNode()) comments.push(walker.currentNode as Comment)
		for (const comment of comments) {
			if (!comment.data.startsWith("prismic-slice-")) comment.remove()
		}

		return clone.innerHTML
	})
}
