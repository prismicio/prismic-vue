export const empty = {} as const

export const youtube = {
	provider_name: "YouTube",
	provider_url: "https://www.youtube.com/",
	title: 'OFFICIAL Somewhere over the Rainbow - Israel "IZ" Kamakawiwoʻole',
	author_name: "Mountain Apple Company Inc",
	author_url: "https://www.youtube.com/c/MountainapplecompanyHAWAII",
	type: "video",
	height: 150,
	width: 200,
	version: "1.0",
	thumbnail_height: 360,
	thumbnail_width: 480,
	thumbnail_url: "https://i.ytimg.com/vi/V1bFr2SWP1I/hqdefault.jpg",
	html: '<iframe width="200" height="150" src="https://www.youtube.com/embed/V1bFr2SWP1I?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
	embed_url: "https://www.youtube.com/watch?v=V1bFr2SWP1I",
} as const

export const twitter = {
	provider_name: "Twitter",
	provider_url: "https://twitter.com",
	url: "https://twitter.com/jack/status/20",
	author_name: "jack",
	author_url: "https://twitter.com/jack",
	html: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">just setting up my twttr</p>&mdash; jack (@jack) <a href="https://twitter.com/jack/status/20?ref_src=twsrc%5Etfw">March 21, 2006</a></blockquote>\n<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n',
	width: 550,
	height: null,
	type: "rich",
	cache_age: "3153600000",
	version: "1.0",
	embed_url: "https://twitter.com/jack/status/20",
	title: null,
} as const
