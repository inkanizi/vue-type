<script>
export default {
  props: {
    wpm: Number,
    countCorrectWords: Number,
    time: Date,
    accurancy: Number,
  },
  emits: ["restart"],
};
</script>

<template>
  <div class="result">
    <div class="result-stats">
      <div class="result-stats_item">
        <h2>{{ wpm }}</h2>
        <span>wpm</span>
      </div>
      <div class="result-stats_item">
        <h2>{{ countCorrectWords }}</h2>
        <span>words</span>
      </div>
      <div class="result-stats_item">
        <h2>{{ time }}</h2>
        <span>time</span>
      </div>
      <div class="result-stats_item">
        <h2>{{ accurancy }}</h2>
        <span>acc</span>
      </div>
    </div>
    <button @click="$emit('restart')" class="result-btn_restart">
      <font-awesome-icon
        icon="fa-solid fa-arrows-rotate"
        color="#313641"
        size="2x"
      />
    </button>
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
}
</style>
