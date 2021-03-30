<template>
  <div class="componentsLink">
    <ul>
      <li>
        <prismic-link :field="simple">foo</prismic-link>
      </li>
      <li>
        <prismic-link :field="blank">bar</prismic-link>
      </li>
      <li>
        <prismic-link :field="internal">baz</prismic-link>
      </li>
      <li>
        <prismic-link v-slot="href" :field="internal">{{ href }}</prismic-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { simple, blank, internal } from "../../mocks/link.json";

export default defineComponent({
  name: "ComponentsLink",
  data() {
    return {
      simple,
      blank,
      internal
    };
  }
});
</script>
