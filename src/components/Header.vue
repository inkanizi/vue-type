<script>
export default {};
</script>

<template>
  <div class="header">
    <h1>vuetype|</h1>
    <div>
      <font-awesome-icon icon="fa-brands fa-github" />
      <a href="https://github.com/inkanizi/vue-type">GitHub</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/variables.scss";
.header {
  padding: 30px 0 0 0;
  color: $base-light-color;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 90%;

  &-icon {
    font-size: 20px;
    color: $base-light-color;
  }
  a {
    padding-left: 5px;
    text-decoration: none;
    color: $base-light-color;
  }
}
</style>
