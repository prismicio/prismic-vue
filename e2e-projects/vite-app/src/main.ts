import { createPrismic } from "@prismicio/vue"
import { createApp } from "vue"

import App from "./App.vue"
import { createClient } from "./prismicio"
import { router } from "./router"
import GlobalSlice from "./slices/Global.vue"

createApp(App)
	.use(router)
	.use(createPrismic({ client: createClient() }))
	.component("GlobalSlice", GlobalSlice)
	.mount("#app")
