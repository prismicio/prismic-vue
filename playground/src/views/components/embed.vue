<template>
  <div class="componentsEmbed">
    <prismic-embed :field="youtube" />
    <prismic-embed :field="twitter" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { youtube, twitter } from "./embed.json";

export default defineComponent({
  name: "ComponentsEmbed",
  data() {
    return {
      youtube,
      twitter
    };
  }
});
</script>
