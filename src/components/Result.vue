<script>
export default {
  props: {
    countCorrectWords: Number,
    time: Number,
    accurancy: Number,
    arrCorrectWords: Array,
  },
  emits: ["restart"],
  data() {
    return {
      stats: [
        {
          title: "words",
          value: this.countCorrectWords,
        },
        {
          title: "time",
          value: this.time,
        },
        {
          title: "acc",
          value: this.accurancy,
        },
      ],
      sum: 0,
    };
  },
  mounted() {},
  computed: {
    calcWpm() {
      //сумма кешируется мне это не надо
      this.arrCorrectWords.forEach((item) => {
        item.letters.forEach((i) => {
          this.sum++;
          console.log(this.sum);
        });
      });
      let symbvol = this.sum / 5;
      this.sum = 0;
      return Math.round(symbvol / (this.time / 60));
    },
  },
};
</script>

<template>
  <div class="result">
    <div class="result-stats">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="result-stats_item"
      >
        <h2>{{ stat.value }}</h2>
        <span>{{ stat.title }}</span>
      </div>
      <div class="result-stats_item">
        <h2>{{ calcWpm }}</h2>
        <span>wpm</span>
      </div>
    </div>
    <button @click="$emit('restart')" class="result-btn_restart">
      <font-awesome-icon
        icon="fa-solid fa-arrows-rotate"
        color="#313641"
        size="2x"
      />
    </button>
    <div class="result-shortcut">
      <kbd>Tab + Enter</kbd>
      <span>restart</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result {
  color: #ec4528;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  &-stats {
    display: flex;
    width: 600px;
    align-items: center;
    justify-content: space-between;

    &_item {
      display: flex;
      flex-direction: column;
    }
  }
  &-btn {
    &_restart {
      margin-top: 70px;
      outline: none;
      border: none;
      background: transparent;
      padding: 5px 15px;
      border-radius: 5px;
      font-size: 20px;
    }
  }
  &-shortcut {
    margin: 20px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      font-size: 16px;
    }
    kbd {
      background-color: #23272e;
      padding: 5px;
      border-radius: 5px;
      font-size: 14px;
    }
  }
}
</style>
