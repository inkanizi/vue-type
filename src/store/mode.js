import { defineStore } from "pinia";

export const useModeStore = defineStore("mode", {
  state: () => {
    return { mode: "words", wordsCount: 10 };
  },

  actions: {
    setTimeMode() {
      this.mode = "time";
      console.log(this.mode);
    },
    setWordsMode() {
      this.mode = "words";
      console.log(this.mode);
    },
  },
});
