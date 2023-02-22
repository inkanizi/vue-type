<script>
import { mapActions, mapState } from "pinia";
import { useModeStore } from "../store/mode";

export default {
  data() {
    return {
      wordsParam: [10, 20, 50, 100],
      timeParam: [15, 30, 45, 60],
    };
  },
  computed: {
    ...mapState(useModeStore, ["mode"]),
    ...mapState(useModeStore, {
      modeStore: "mode",
    }),
  },
  methods: {
    ...mapActions(useModeStore, [
      "setTimeMode",
      "setWordsMode",
      "setWordsCount",
    ]),
  },
};
</script>

<template>
  <div class="menu">
    <div class="menu-mode">
      <div class="menu-mode_item" @click="setTimeMode">
        <font-awesome-icon icon="fa-regular fa-clock" color="#ec4528" />
        <span>time</span>
      </div>
      <div class="menu-mode_item" @click="setWordsMode">
        <font-awesome-icon icon="fa-solid fa-font" color="#ec4528" />
        <span>words</span>
      </div>
    </div>
    <div class="menu-settings">
      <template v-if="this.mode == 'words'">
        <span
          v-for="(param, index) in wordsParam"
          :key="index"
          @click="setWordsCount(param)"
          >{{ param }}</span
        >
      </template>
      <template v-if="this.mode == 'time'">
        <span v-for="(param, index) in timeParam" :key="index">{{
          param
        }}</span>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  // Позиционирование

  // Блочная модель
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin: 100px 0 0 0;
  height: 40px;
  // Типографика
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  // Оформление
  color: #ec4528;
  background: #313641;
  border-radius: 5px;

  &-mode {
    display: flex;
    width: 250px;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    &::after {
      content: "";
      position: relative;
      left: 25%;
      width: 5px;
      height: 25px;
      background: #3f4553;
      border-radius: 20px;
    }

    &_item {
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        padding-left: 5px;
        cursor: pointer;
      }
    }
  }
  &-settings {
    width: 250px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
  }
}
</style>
