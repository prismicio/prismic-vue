<template>
  <div class="componentsRichText">richtext</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { simple, blank, internal } from "../../mocks/link.json";

export default defineComponent({
  name: "ComponentsRichText",
  data() {
    return {
      simple,
      blank,
      internal
    };
  }
});
</script>
