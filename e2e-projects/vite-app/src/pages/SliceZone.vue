<script setup lang="ts">
import { isFilled, mapSliceZone } from "@prismicio/client"
import { SliceZone, defineSliceZoneComponents, usePrismic } from "@prismicio/vue"
import { defineAsyncComponent, h, ref } from "vue"

import DefaultSlice from "../slices/Default.vue"
import ImageSlice from "../slices/Image.vue"
import MappedImageSlice from "../slices/mapped/Image.vue"
import MappedTextSlice from "../slices/mapped/Text.vue"
import TextSlice from "../slices/Text.vue"

const { client } = usePrismic()
const { data: tests } = await client.getSingle("page")

if (!isFilled.sliceZone(tests.filled)) throw new Error("Expected a filled slice zone.")
if (isFilled.sliceZone(tests.empty)) throw new Error("Expected an empty slice zone.")

const graphQLURL = new URL("/graphql", client.documentAPIEndpoint)
graphQLURL.searchParams.set("query", graphQLQuery())
const graphQLRes = await client.graphQLFetch(graphQLURL.toString())
const graphQL = await graphQLRes.json()

const mapped = await mapSliceZone(tests.filled, {
	text: () => ({ foo: "bar" }),
	image: () => ({ bar: "baz" }),
})

const components = defineSliceZoneComponents({
	text: TextSlice,
	image: ImageSlice,
})

const asyncComponents = defineSliceZoneComponents({
	text: defineAsyncComponent(() => import("../slices/Text.vue")),
	image: "GlobalSlice",
})

const mappedComponents = defineSliceZoneComponents({
	text: MappedTextSlice,
	image: MappedImageSlice,
})

// Local slices whose components render an element, a fragment, or nothing.
const markerComponents = defineSliceZoneComponents({
	element: (props: { slice: { id: string } }) => h("div", props.slice.id),
	fragment: (props: { slice: { id: string } }) => [
		h("span", `${props.slice.id}-first`),
		h("span", `${props.slice.id}-second`),
	],
	empty: () => null,
})
const markerSlices = ref([
	{ id: "element-id", slice_type: "element" },
	{ id: "fragment-id", slice_type: "fragment" },
	{ id: "empty-id", slice_type: "empty" },
])

function graphQLQuery() {
	return /* GraphQL */ `
		query Foo {
			allPages {
				edges {
					node {
						filled {
							...Slices
						}
					}
				}
			}
		}

		fragment Slices on PageFilled {
			... on PageFilledText {
				type
				variation {
					... on PageFilledTextDefault {
						primary {
							content
						}
					}
				}
			}
			... on PageFilledImage {
				type
				variation {
					... on PageFilledImageDefault {
						primary {
							content
						}
					}
				}
			}
		}
	`
}
</script>

<template>
	<div data-testid="filled">
		<SliceZone :slices="tests.filled" :components="components" />
	</div>

	<div data-testid="empty">
		<SliceZone :slices="tests.empty" :components="components" />
	</div>

	<div data-testid="invalid">
		<SliceZone :slices="null as never" :components="components" />
	</div>

	<div data-testid="context">
		<SliceZone :slices="tests.filled" :components="components" :context="{ foo: 'bar' }" />
	</div>

	<div data-testid="async">
		<SliceZone :slices="tests.filled" :components="asyncComponents" />
	</div>

	<div data-testid="todo">
		<SliceZone :slices="tests.filled" :components="{ text: components.text }" />
	</div>

	<div data-testid="todo-graphql">
		<SliceZone
			:slices="graphQL.data.allPages.edges[0].node.filled"
			:components="{ text: components.text }"
		/>
	</div>

	<div data-testid="todo-mapped">
		<SliceZone :slices="mapped" :components="{ text: mappedComponents.text }" />
	</div>

	<div data-testid="default-component">
		<SliceZone
			:slices="tests.filled"
			:components="{ text: components.text }"
			:default-component="DefaultSlice"
		/>
	</div>

	<div data-testid="graphql">
		<SliceZone :slices="graphQL.data.allPages.edges[0].node.filled" :components="components" />
	</div>

	<div data-testid="mapped">
		<SliceZone :slices="mapped" :components="mappedComponents" />
	</div>

	<div data-testid="markers">
		<button @click="markerSlices = markerSlices.toReversed()">Reverse</button>
		<button @click="markerSlices = markerSlices.slice(1)">Remove first</button>
		<button
			@click="markerSlices = markerSlices.map((slice) => ({ ...slice, id: `${slice.id}-updated` }))"
		>
			Replace IDs
		</button>
		<div data-testid="markers-output">
			<SliceZone :slices="markerSlices" :components="markerComponents" />
		</div>
	</div>
</template>
