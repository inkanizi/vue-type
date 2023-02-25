import { defineStore } from "pinia";

export const useModeStore = defineStore("mode", {
  state: () => {
    return { mode: "words", wordsCount: 10, timeCount: 15 };
  },

  actions: {
    setTimeMode() {
      this.mode = "time";
    },
    setWordsMode() {
      this.mode = "words";
    },
    setWordsCount(num) {
      this.wordsCount = num;
    },
    setTimeCount(num) {
      this.timeCount = num;
    },
  },
});
