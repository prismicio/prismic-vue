<template>
  <div class="domComposition">
    <ul>
      <li>
        {{ resolvedSimple }}
      </li>
      <li>
        {{ resolvedBlank }}
      </li>
      <li>
        {{ resolvedInternal }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { simple, blank, internal } from "../../mocks/link.json";

export default defineComponent({
  data() {
    return {
      resolvedSimple: "" as string,
      resolvedBlank: "" as string,
      resolvedInternal: "" as string
    };
  },
  created(): void {
    this.resolvedSimple = this.$prismic.asLink(simple);
    this.resolvedBlank = this.$prismic.asLink(blank);
    this.resolvedInternal = this.$prismic.asLink(internal);
  }
});
</script>
