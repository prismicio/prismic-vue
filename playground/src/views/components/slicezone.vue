<template>
	<div class="componentsRichText">
		<slice-zone :slices="slices" :components="{}" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "ComponentsSliceZone",
	data() {
		return {
			slices: [
				{ __mapped: true, id: "1", slice_type: "foo", abc: "123" },
				{ __mapped: true, id: "2", slice_type: "bar", def: "456" },
				{ id: "3", slice_type: "baz", primary: { ghi: "789" } },
			],
		}
	},
})
</script>
