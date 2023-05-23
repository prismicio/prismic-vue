import { createApp } from "vue";

import App from "./App.vue";
import prismic from "./prismic";
import router from "./router";

createApp(App).use(router).use(prismic).mount("#app");
