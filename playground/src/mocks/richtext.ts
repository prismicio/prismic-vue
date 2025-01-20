export const empty = [] as const

export const single = [
	{
		type: "paragraph",
		text: "The Atlantic puffin, also known as the common puffin, is a species of seabird in the auk family. It is the only puffin native to the Atlantic Ocean; two related species, the tufted puffin and the horned puffin, are found in the northeastern Pacific.",
		spans: [
			{
				start: 39,
				end: 52,
				type: "em",
			},
			{
				start: 228,
				end: 248,
				type: "strong",
			},
		],
	},
] as const

export const multi = [
	{
		type: "paragraph",
		text: "More about nesting?",
		spans: [],
	},
	{
		type: "paragraph",
		text: "Usually first breeds at about 5 years. Breeds in colonies. Birds often have same mates each year. In courtship, male repeatedly flicks head up and back so that bill points up; may continue for minutes. Members of pair swing bills sideways, clashing them together repeatedly. Nest site is in burrow 3-7' long, or in natural crevice or under rocks. Sometimes one entrance leads to side branches and multiple nests. Both sexes help excavate. Nest in chamber in burrow usually has sparse lining of grass, feathers.",
		spans: [
			{
				start: 30,
				end: 37,
				type: "strong",
			},
			{
				start: 76,
				end: 86,
				type: "em",
			},
			{
				start: 202,
				end: 209,
				type: "hyperlink",
				data: {
					link_type: "Web",
					url: "https://sms-hoy-storybook.netlify.app",
					target: "_blank",
				},
			},
			{
				start: 224,
				end: 238,
				type: "hyperlink",
				data: {
					id: "XvoFFREAAM0WGBng",
					type: "page",
					tags: [],
					slug: "slug",
					lang: "en-us",
					uid: "test",
					url: "/components/image",
					link_type: "Document",
					isBroken: false,
				},
			},
		],
	},
	{
		type: "paragraph",
		text: "Both parents feed nestlings, carrying fish in bill; may feed fish directly to young at first, later drop them on floor of nest. Young leave nest usually 38-44 days after hatching; usually leave at night, flying directly out to sea.",
		spans: [],
	},
	{
		type: "paragraph",
		text: "You find them cute? We do too don't worry, even if this website's content if just for presentation purpose.",
		spans: [],
	},
	{
		type: "image",
		url: "https://images.prismic.io/200629-sms-hoy/a028b41b-9aaa-44d1-9699-f81291c3f42b_signature5f3cfe4379b08.png?auto=compress,format",
		alt: null,
		copyright: null,
		dimensions: {
			width: 139,
			height: 89,
		},
	},
] as const
