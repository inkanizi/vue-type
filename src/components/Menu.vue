<script>
export default {
  data() {
    return {
      mode: {
        time: false,
        words: true,
      },
    };
  },
  methods: {
    //для переключеня режимов скорее всего нужен глобальный стейт
    setModeTime() {
      this.mode = {
        time: true,
        words: false,
      };
    },
    setModeWords() {
      this.mode = {
        time: false,
        words: true,
      };
    },
  },
};
</script>

<template>
  <div class="menu">
    <div class="menu-mode">
      <div class="menu-mode_item" @click="setModeTime">
        <font-awesome-icon icon="fa-regular fa-clock" color="#ec4528" />
        <span>time</span>
      </div>
      <div class="menu-mode_item" @click="setModeWords">
        <font-awesome-icon icon="fa-solid fa-font" color="#ec4528" />
        <span>words</span>
      </div>
    </div>
    <div class="menu-separator"></div>
    <div class="menu-settings">
      <template v-if="mode.words">
        <span>10</span>
        <span>20</span>
        <span>50</span>
        <span>100</span>
      </template>
      <template v-if="mode.time">
        <span>15</span>
        <span>30</span>
        <span>45</span>
        <span>60</span>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #ec4528;
  width: 100%;
  margin-top: 100px;
  height: 40px;
  background: #313641;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  &-separator {
    width: 5px;
    height: 25px;
    background: #3f4553;
    border-radius: 20px;
  }
  &-mode {
    display: flex;
    width: 250px;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    
    &_item {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        padding-left: 5px;
      }
    }
  }
  &-settings {
    width: 250px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
