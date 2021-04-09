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
import { usePrismic } from "../../../../src";
import { simple, blank, internal } from "../../mocks/link.json";

export default defineComponent({
  setup(): {
    resolvedSimple: string;
    resolvedBlank: string;
    resolvedInternal: string;
  } {
    const prismic = usePrismic();

    return {
      resolvedSimple: prismic.asLink(simple),
      resolvedBlank: prismic.asLink(blank),
      resolvedInternal: prismic.asLink(internal)
    };
  }
});
</script>
