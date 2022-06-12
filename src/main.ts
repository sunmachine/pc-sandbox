import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./frontend/App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { Viewer } from "./app/Viewer";

loadFonts();

createApp(App)
  .use(vuetify)
  .use(createPinia())
  .provide<Viewer>("viewer", new Viewer())
  .mount("#app");
