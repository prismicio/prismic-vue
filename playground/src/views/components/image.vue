<template>
  <div class="componentsImage">
    <prismic-image :field="simple" />
    <prismic-image :field="simple.twitter_variant" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { simple } from "../../mocks/image.json";

export default defineComponent({
  name: "ComponentsImage",
  data() {
    return {
      simple
    };
  }
});
</script>
