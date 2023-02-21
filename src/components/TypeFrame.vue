<script>
import words from "../utils/dictionary";
import Result from "./Result.vue";
import { nextTick } from "vue";
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
    };
  },
  mounted() {
    this.shuffle();
    //Зануление повторяется, можно выделить в отдельную функцию
    this.words.forEach((word) => {
      word.class = "inactiveWord";
      word.letters.forEach((lets) => {
        lets.class = "";
      });
    });
    this.words[0].letters[0].class = " caret_first";
  },
  computed: {
    wpm() {
      return Math.floor(this.countCorrectWords / (this.time / 60));
    },
    time() {
      return Math.floor((this.date2 - this.date1) / 1000);
    },
    isEnd() {
      return this.currentWord === this.words.length;
    },
  },
  watch: {
    //При смене режима остается класс с кареткой,
    // можно повесить ватч и просто сбрасывать его при изменении

    isEnd() {
      if (this.isEnd === true) {
        this.date2 = new Date();
      }
    },
    //каретка
    currentLetter(newVal, oldVal) {
      try {
        let word = this.words[this.currentWord];
        word.letters[this.currentLetter] &&
          (word.letters[this.currentLetter].class += " caret");
        word.letters[oldVal] && (word.letters[oldVal].class += " ");
      } catch {}
    },
  },
  methods: {
    start() {
      this.isStart = true;
      this.date1 = new Date();
      //необходимо чтобы отрабатывало только 1 раз
      this.start = function () {
        return false;
      };
    },
    async restart() {
      this.currentWord = 0;
      this.currentLetter = 0;
      this.countCorrectWords = 0;
      this.accurancy = 0;
      this.text = "";
      this.date1 = null;
      this.date2 = null;
      this.isStart = false;
      this.start = this.start = function () {
        this.isStart = true;
        this.date1 = new Date();
        this.start = function () {
          return false;
        };
      };

      //зануление классов
      this.words.forEach((word) => {
        word.class = "inactiveWord";
        word.letters.forEach((lets) => {
          lets.class = "";
        });
      });

      this.shuffle();
      this.words[0].letters[0].class = " caret_first";

      //Решает проблему с фокусом в инпут
      await nextTick();
      this.$refs.focusRef.focus();
    },
    //Пермешивание массива
    shuffle() {
      const randomWords = this.words.sort(() => 0.5 - Math.random());
      this.words = randomWords;
    },
    nextWord() {
      this.currentWord++;
      this.text = "";
      this.currentLetter = 0;
    },
    checkWord(e) {
      this.keyEvent = e;
      let word = this.words[this.currentWord];

      if (e.code === "Space") {
        if (e.target.value === word.text) {
          word.class = "correctWord";
          this.countCorrectWords++;
          this.nextWord();
        } else if (e.target.value.length === word.text.length) {
          word.class = "incorrectWord";
          this.nextWord();
        }
        e.preventDefault();
      }
    },
    checkLetter(e) {
      this.start();

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
    focusImport() {
      let input = this.$refs.focusRef;
      let isFocused = document.activeElement === input;
      if (!isFocused && this.$refs.wordsRef) {
        this.$refs.wordsRef.classList.add("blur");
      } else if (isFocused) {
        this.$refs.wordsRef.classList.remove("blur");
      }
    },
  },
};
</script>

<template>
  <div class="typeframe">
    <template v-if="!isEnd">
      <div class="typeframe-counter">
        <div v-show="isStart">{{ countCorrectWords }}/{{ words.length }}</div>
      </div>
      <div class="typeframe-words" ref="wordsRef">
        <span
          :class="word.class"
          class="word"
          v-for="(word, index) in words"
          :key="index"
        >
          <span
            v-for="(item, index) in word.letters"
            :key="index"
            :class="item.class"
          >
            {{ item.letter }}
          </span>
        </span>
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
      :wpm="wpm"
      :countCorrectWords="countCorrectWords"
      :time="time"
      :accurancy="accurancy"
      @restart="restart"
    />
  </div>
</template>

<style lang="scss" scoped>
p {
  color: red;
  padding-left: 200px;
}
.word {
  position: relative;
  padding-left: 10px;
  font-size: 24px;
}
//убрать спан, и использовать только классы
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
}
.typeframe {
  margin-top: 150px;
  border-radius: 15px;
  width: 700px;
  height: 200px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-around;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  &-counter {
    color: #ec5028;
    font-size: 20px;
    height: 20px;
  }

  &-words {
    font-size: 18px;
    width: 700px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    word-break: break-all;
    text-align: justify;
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
