<script>
import TypeFrame from "./components/TypeFrame.vue";
import Menu from "./components/Menu.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
export default {
  components: {
    TypeFrame,
    Menu,
    Header,
    Footer,
  },
};
</script>

<template>
  <div class="app">
    <Header />
    <div>
      <Menu />
      <TypeFrame />
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
