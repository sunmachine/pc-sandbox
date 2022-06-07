import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./frontend/App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

createApp(App).use(vuetify).use(createPinia()).mount("#app");
