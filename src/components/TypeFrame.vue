<script>
import words from "../utils/dictionary";
import Result from "./Result.vue";
import { nextTick } from "vue";
import { take } from "../utils/dictionary";
import { mapState } from "pinia";
import { useModeStore } from "../store/mode";
export default {
  components: {
    Result,
  },
  data() {
    return {
      words: words,
      text: "",
      currentWord: 0,
      currentLetter: 0,
      accurancy: 0,
      countCorrectWords: 0,
      isStart: false,
      date1: null,
      date2: null,
      keyEvent: {}, //для передачи event с клавиатуры в событие инпута
      showCounter: true, // чтобы высоты не скакала
      rowHeight: 0,
      caretPostionY: null, //более универсально если оно будет вычесляться в маунте
      capsWarning: false,
      arrCorrectWords: [],
    };
  },
  mounted() {
    this.shuffle();
    this.words = take(words, this.wordsCount);
    this.clearClasses();
  },
  computed: {
    wpm() {
      return Math.floor(this.countCorrectWords / (this.time / 60));
    },
    time() {
      return Math.floor((this.date2 - this.date1) / 1000);
    },
    isEnd() {
      // return this.currentWord === this.words.length;
      // очень сильно похоже на здоровый такой костыль, из говна и палок
      let lastWord = this.words.lastIndexOf(this.words.at(-1));
      let lastLetters = this.words[lastWord].letters;
      let lasLetter = lastLetters.lastIndexOf(lastLetters.at(-1));
      if (
        this.currentWord === lastWord &&
        this.currentLetter === lasLetter + 1
      ) {
        this.countCorrectWords++;
        this.arrCorrectWords.push(this.words.at(-1));
        return true;
      }
    },
    ...mapState(useModeStore, ["wordsCount"]),
    ...mapState(useModeStore, {
      modeStore: "mode",
    }),
    lastLetter() {
      return this.words.at(-1).letters.at(-1);
    },
  },
  watch: {
    wordsCount() {
      this.words = take(words, this.wordsCount);
      this.clearClasses();
    },
    isEnd() {
      if (this.isEnd === true) {
        this.date2 = new Date();
      }
    },
    //каретка
    currentLetter(oldVal) {
      try {
        let word = this.words[this.currentWord];
        word.letters[this.currentLetter] &&
          (word.letters[this.currentLetter].class += " caret");
        word.letters[oldVal] && (word.letters[oldVal].class += " ");
      } catch {}
    },
    caretPostionY() {
      if (this.caretPostionY) {
        if (this.caretPostionY > 440) {
          this.rowHeight += 32;
        }
      }
    },
  },
  methods: {
    //старт теста, срабатывает единожды, при рестарте обновляется
    start() {
      this.isStart = true;
      this.date1 = new Date();
      //необходимо чтобы отрабатывало только 1 раз
      this.start = function () {
        return false;
      };
    },
    //рестарт теста
    async restart() {
      this.currentWord = 0;
      this.currentLetter = 0;
      this.countCorrectWords = 0;
      this.accurancy = 0;
      this.text = "";
      this.date1 = null;
      this.date2 = null;
      this.isStart = false;
      this.rowHeight = 0;
      this.caretPostionY = null;
      this.start = this.start = function () {
        this.isStart = true;
        this.date1 = new Date();
        this.start = function () {
          return false;
        };
      };
      this.words = take(words, this.wordsCount);
      this.shuffle();
      this.clearClasses();

      //Решает проблему с фокусом в инпут
      await nextTick();
      this.$refs.focusRef.focus();
    },
    //Пермешивание массива
    shuffle() {
      const randomWords = this.words.sort(() => 0.5 - Math.random());
      this.words = randomWords;
    },
    //переключает слово вперед
    nextWord() {
      this.currentWord++;
      this.text = "";
      this.currentLetter = 0;
    },
    //отработка с нажатия клавиш
    checkWord(e) {
      this.keyEvent = e;
      e.getModifierState("CapsLock")
        ? (this.capsWarning = true)
        : (this.capsWarning = false);

      let word = this.words[this.currentWord];

      if (e.code === "Space") {
        if (e.target.value === word.text) {
          word.class = "correctWord";
          this.countCorrectWords++;
          this.arrCorrectWords.push(word);
          this.nextWord();
        } else if (e.target.value.length === word.text.length) {
          word.class = "incorrectWord";
          this.nextWord();
        }
        e.preventDefault();
      }
    },
    //отработка изменений в инпуте
    checkLetter(e) {
      this.start();
      //получаем позицию каретки
      let caret = document.querySelector(".caret");
      this.caretPostionY = caret
        ? Math.round(caret.getBoundingClientRect().y)
        : 440;

      let input = e.target.value.split("");
      let word = this.words[this.currentWord].letters[this.currentLetter];
      if (this.keyEvent.code === "Backspace") {
        this.words[this.currentWord].letters[this.currentLetter - 1].class = "";
        word ? (word.class = "") : null;
        this.currentLetter--;
      } else if (input.length > this.words[this.currentWord].text.length) {
        //если буква больше чем есть в слове то надо это прерывать
        this.nextWord(); //не надежно
      } else {
        if (input[this.currentLetter] === word.letter) {
          word.class = "correctLetter";
          this.currentLetter++;
        } else {
          word.class = "incorrectLetter";
          this.currentLetter++;
        }
      }
    },
    //при фокусе и блюре, показывает окно расфокуса
    focusImport() {
      //желательно чтобы и при клике то работало
      let input = this.$refs.focusRef;
      let isFocused = document.activeElement === input;
      if (!isFocused && this.$refs.wordsRef) {
        this.$refs.wordsRef.classList.add("blur");
        this.$refs.wrapRef.classList.add("blur-text");
      } else if (isFocused) {
        this.$refs.wordsRef.classList.remove("blur");
        this.$refs.wrapRef.classList.remove("blur-text");
      }
    },
    //зануление классов
    clearClasses() {
      this.words.forEach((word) => {
        word.class = "inactiveWord";
        word.letters.forEach((lets) => {
          lets.class = "";
        });
      });
      this.words[0].letters[0].class = " caret_first";
    },
  },
};
</script>

<template>
  <div class="typeframe">
    <template v-if="!isEnd">
      <div class="typeframe-capswarning">
        <p v-if="capsWarning">Caps Lock!</p>
      </div>
      <div class="typeframe-counter">
        <div v-show="isStart">{{ countCorrectWords }}/{{ words.length }}</div>
      </div>
      <div class="typeframe-wrapper" ref="wrapRef">
        <div
          class="typeframe-words"
          ref="wordsRef"
          :style="{
            bottom: `${this.rowHeight}px`,
          }"
        >
          <p
            :class="word.class"
            class="typeframe-words_word"
            v-for="(word, index) in words"
            :key="index"
          >
            <span
              ref="caret"
              v-for="(item, index) in word.letters"
              :key="index"
              :class="item.class"
            >
              {{ item.letter }}
            </span>
          </p>
        </div>
      </div>
      <input
        autofocus
        ref="focusRef"
        @keydown="checkWord($event)"
        @input="checkLetter($event)"
        @focus="focusImport"
        @blur="focusImport"
        v-model.trim="text"
        class="typeframe-input"
      />
    </template>

    <Result
      v-if="isEnd"
      :countCorrectWords="countCorrectWords"
      :time="time"
      :accurancy="accurancy"
      :arrCorrectWords="arrCorrectWords"
      @restart="restart"
    />
  </div>
</template>

<style lang="scss" scoped>
.word {
  position: relative;
  padding-left: 10px;
  font-size: 24px;
}
.caret {
  &_first {
    &::before {
      content: "";
      width: 2px;
      top: 6px;
      height: 26px;
      background-color: #ec5028;
      position: absolute;
      animation: next 1s infinite;
      animation-direction: alternate;
    }

    @keyframes next {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }

  &::before {
    content: "";
    width: 2px;
    top: 6px;
    height: 26px;
    background-color: #ec5028;
    position: absolute;
  }
}
.correctWord {
  color: white !important ;
}
.inactiveWord {
  color: gray;
}
.incorrectWord {
  color: rgb(183, 241, 8) !important;
}
.correctLetter {
  color: #ec5028;
}
.incorrectLetter {
  color: rgb(234, 255, 0);
}
.blur {
  filter: blur(2px);
  position: relative;
  z-index: 1;
}
.blur-text {
  &::after {
    content: "press Tab to focus";
    position: relative;
    right: 200px;
    bottom: 0;
    z-index: 21;
    font-weight: 500;
    color: #ec5028;
    font-size: 30px;
    width: 600px;
    height: 90px;
  }
}
.typeframe {
  margin-top: 100px;
  border-radius: 15px;
  width: 700px;
  height: 300px;
  display: flex;
  align-items: flex-start;
  text-align: end;
  flex-direction: column;
  justify-content: space-around;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  &-capswarning {
    color: black;
    width: 100%;
    display: flex;
    height: 41px;
    align-items: center;
    justify-content: center;
    p {
      background: #ec5028;
      padding: 10px;
      font-weight: 500;
      border-radius: 10px;
    }
  }
  &-counter {
    color: #ec5028;
    font-size: 20px;
    height: 20px;
  }
  &-wrapper {
    height: 96px;
    overflow: hidden;
  }

  &-words {
    font-size: 18px;
    width: 650px;
    display: flex;
    z-index: 1;
    position: relative;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: center;
    user-select: none;
    overflow: hidden;

    &_word {
      display: block;
      position: relative;
      font-size: 24px;
      margin-left: 10px;
    }
  }
  &-input {
    opacity: 0;
    background: transparent;
    outline: none;
    border: 1px solid #ec5028;
    padding: 10px;
    border-radius: 15px;
    color: white;
  }
}
</style>
