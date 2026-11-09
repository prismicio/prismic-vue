import { createPrismic } from "@prismicio/vue"
import { createApp } from "vue"

import App from "./App.vue"
import { createClient } from "./prismicio"
import { router } from "./router"
import ImageSlice from "./slices/Image.vue"

createApp(App)
	.use(router)
	.use(createPrismic({ client: createClient() }))
	.component("GlobalSlice", ImageSlice)
	.mount("#app")
