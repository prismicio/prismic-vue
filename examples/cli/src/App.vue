<template>
	<nav>
		<ul>
			<li>
				<router-link to="/">home</router-link>
			</li>
			<li>
				<router-link to="/about">about</router-link>
			</li>
		</ul>
	</nav>
	{{ previewCookie }}
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	computed: {
		previewCookie() {
			return this.$prismic.previewCookie;
		},
	},
});
</script>

<style>
body {
	margin: 0;
	padding: 0;
	font-family: sans-serif;
}
</style>
