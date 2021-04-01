<template>
  <div class="componentsRichText">
    <prismic-rich-text :field="single" />
    <prismic-rich-text :field="multi" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { single, multi } from "../../mocks/richtext.json";

export default defineComponent({
  name: "ComponentsRichText",
  data() {
    return {
      single,
      multi
    };
  }
});
</script>
