import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "./assets/main.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faFont,
  faArrowsRotate,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

library.add(faClock, faFont, faArrowsRotate, faGear, faGithub);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

// createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
// app.use(pinia);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.mount("#app");