<script>
import Menu from "./components/Menu.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import ModeTime from "./components/ModeTime.vue";
import { mapState } from "pinia";
import { useModeStore } from "./store/mode";
import ModeWords from "./components/ModeWords.vue";
export default {
  components: {
    Menu,
    Header,
    Footer,
    ModeTime,
    ModeWords
},
  computed: {
    ...mapState(useModeStore, ["mode"]),
  },
};
</script>

<template>
  <div class="app">
    <Header />
    <div>
      <Menu />
      <ModeWords v-if="this.mode === 'words'" />
      <ModeTime v-if="this.mode === 'time'" />
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}
</style>
