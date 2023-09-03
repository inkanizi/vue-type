<script>
import { mapActions, mapState } from "pinia";
import { useModeStore } from "../store/mode";

export default {
  data() {
    return {
      wordsParam: [10, 20, 50, 100],
      timeParam: [15, 30, 45, 60],
      modesParam: [
        {
          title: "time",
          icon: "fa-regular fa-clock",
        },
        {
          title: "words",
          icon: "fa-solid fa-font",
        },
      ],
    };
  },
  computed: {
    ...mapState(useModeStore, ["mode", "wordsCount", "timeCount"]),
    ...mapState(useModeStore, {
      modeStore: "mode",
    }),
  },
  methods: {
    ...mapActions(useModeStore, [
      "setTimeMode",
      "setWordsMode",
      "setWordsCount",
      "setTimeCount",
    ]),
    setMode(mode) {
      if (mode === "words") {
        this.setWordsMode();
      } else if (mode === "time") {
        this.setTimeMode();
      }
    },
  },
};
</script>

<template>
  <div class="menu">
    <div class="menu-mode">
      <div
        class="menu-mode_item"
        v-for="(param, index) in modesParam"
        :key="index"
        :class="{ active: param.title === this.mode }"
        @click="setMode(param.title)"
      >
        <font-awesome-icon v-bind:icon="param.icon" class="menu_mode-icons" />
        <span>{{ param.title }}</span>
      </div>
    </div>
    <div class="menu-settings">
      <template v-if="this.mode === 'words'">
        <span
          class="menu-settings_item"
          v-for="(param, index) in wordsParam"
          :key="index"
          @click="setWordsCount(param)"
          :class="{ active: param === wordsCount }"
          >{{ param }}</span
        >
      </template>
      <template v-if="this.mode === 'time'">
        <span
          class="menu-settings_item"
          v-for="(param, index) in timeParam"
          :key="index"
          @click="setTimeCount(param)"
          :class="{ active: param === timeCount }"
          >{{ param }}</span
        >
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/variables.scss";
.active {
  background: $alt-secong-bg-color;
  border-radius: 5px;
}
.menu {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin: 100px 0 0 0;
  height: 40px;
  color: $base-light-color;
  background: $secong-bg-color;
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
    &-icons {
      color: $base-light-color;
    }

    &_item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;

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
    &_item {
      padding: 5px;
      text-align: center;
    }
  }
}
</style>
