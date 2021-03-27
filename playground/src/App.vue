<template>
  {{ previewCookie }}
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  computed: {
    previewCookie() {
      return this.$prismic.previewCookie;
    }
  }
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
</style>
