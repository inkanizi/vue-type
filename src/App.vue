<script>
import Menu from "./components/Menu.vue";
import Header from "./components/Header.vue";
import ModeTime from "./components/ModeTime.vue";
import { mapState } from "pinia";
import { useModeStore } from "./store/mode";
import ModeWords from "./components/ModeWords.vue";
export default {
  components: {
    Menu,
    Header,
    ModeTime,
    ModeWords,
  },
  computed: {
    ...mapState(useModeStore, ["mode"]),
  },
};
</script>

<template>
  <div class="app">
    <Header />
    <div class="app_main">
      <Menu />
      <ModeWords v-if="this.mode === 'words'" />
      <ModeTime v-if="this.mode === 'time'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  &_main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
