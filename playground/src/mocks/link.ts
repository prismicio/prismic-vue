export const empty = {
	link_type: "Any",
} as const

export const simple = {
	link_type: "Web",
	url: "https://en.wikipedia.org/wiki/Atlantic_puffin#Behaviour",
} as const

export const blank = {
	link_type: "Web",
	url: "https://en.wikipedia.org/wiki/Atlantic_puffin#Behaviour",
	target: "_blank",
} as const

export const internal = {
	id: "XvoFFREAAM0WGBng",
	type: "page",
	tags: [] as string[],
	slug: "slug",
	lang: "en-us",
	uid: "test",
	link_type: "Document",
	isBroken: false,
} as const
