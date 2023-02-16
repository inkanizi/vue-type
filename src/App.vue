<template>
  <div>
    <Menu />
    <TypeFrame />
  </div>
</template>

<script>
import TypeFrame from "./components/TypeFrame.vue";
import Menu from "./components/Menu.vue";
export default {
  components: {
    TypeFrame,
    Menu,
  },
};
</script>

<style lang="scss" scoped></style>
