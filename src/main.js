import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

import "./assets/main.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faFont, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

library.add(faClock, faFont, faArrowsRotate, faGithub);

const pinia = createPinia();

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(pinia);

app.mount("#app");
