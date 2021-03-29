<template>
  <nav>
    <ul>
      <li>
        <router-link to="/">index</router-link>
      </li>
      <li>
        components
        <ul>
          <li>
            <router-link to="/components/image">image</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App"
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
</style>
