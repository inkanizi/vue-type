<script>
export default {};
</script>

<template>
  <div class="header">
    <h1>vuetype|</h1>
    <font-awesome-icon
      icon="fa-solid fa-gear"
      class="header-icon"
      color="#ec5028"
    />
  </div>
</template>

<style lang="scss" scoped>
.header {
  padding: 30px 0 0 0;
  color: #ec5028;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 90%;

  &-icon {
    font-size: 20px;
  }
}
</style>
