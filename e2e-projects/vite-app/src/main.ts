import { createPrismic } from "@prismicio/vue"
import { createApp } from "vue"

import App from "./App.vue"
import { GlobalSlice } from "./components/slices"
import { createClient } from "./prismicio"
import { router } from "./router"

createApp(App)
	.use(router)
	.use(createPrismic({ client: createClient() }))
	.component("GlobalSlice", GlobalSlice)
	.mount("#app")
