import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import prismic from "./prismic";

createApp(App).use(router).use(prismic).mount("#app");
