<template>
	<nav>
		<ul>
			<li>
				<router-link to="/">index</router-link>
			</li>
			<li>
				helpers
				<ul>
					<li>
						<router-link to="/helpers/options">options</router-link>
					</li>
					<li>
						<router-link to="/helpers/composition">composition</router-link>
					</li>
				</ul>
			</li>
			<li>
				components
				<ul>
					<li>
						<router-link to="/components/image">image</router-link>
					</li>
					<li>
						<router-link to="/components/embed">embed</router-link>
					</li>
					<li>
						<router-link to="/components/link">link</router-link>
					</li>
					<li>
						<router-link to="/components/text">text</router-link>
					</li>
					<li>
						<router-link to="/components/richtext">richtext</router-link>
					</li>
					<li>
						<router-link to="/components/slicezone">slicezone</router-link>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
	<hr />
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "App",
})
</script>

<style>
body {
	margin: 0;
	padding: 0;
	font-family: sans-serif;
}
</style>
