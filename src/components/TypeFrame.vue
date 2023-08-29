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
      text: "", //Текст самого инпута (изменяемый)
      currentWord: 0,
      currentLetter: 0,
      accurancy: 0, //Аккуратность
      countCorrectWords: 0,
      isStart: false,
      date1: null,
      date2: null,
      keyEvent: {}, //для передачи event с клавиатуры в событие инпута
      row: 0, //Кол-во строк в отображаемом тексте
      capsWarning: false, //Предупреждение о капсе
      arrCorrectWords: [],
      toDeleteWords: [], //Массив слов, которые будут убраны после изменения строки
      lastRowWords: [], //Последние слова в каждой из строк
      isLetterLimit: false, //Лимит букв в слове
    };
  },
  //Перед монтированием
  beforeMount() {
    this.shuffle();
    this.words = take(words, this.wordsCount);
    this.clearClasses();
  },
  //Во время монтирования
  mounted() {
    this.takeLastWordsInRow();
  },
  computed: {
    // wpm() {
    //   return Math.floor(this.countCorrectWords / (this.time / 60));
    // },
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
    //Последняя буква во всём тексте
    lastLetter() {
      return this.words.at(-1).letters.at(-1);
    },
  },
  watch: {
    //При изменении кол-ва слов, нужно еще что-то изменять
    wordsCount() {
      this.words = take(words, this.wordsCount);
      this.clearClasses();
      this.takeLastWordsInRow();
    },
    //Определение когда закончился тест
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
        document.getElementById("caret").animate(next);
        word.letters[oldVal] && (word.letters[oldVal].class += " ");
      } catch {}
    },
    //Если лимит пропадает, то его класс тоже
    isLetterLimit() {
      if (this.words[this.currentWord].class.indexOf("limit") !== -1) {
        this.words[this.currentWord].class = this.words[
          this.currentWord
        ].class.slice(0, this.words[this.currentWord].class.indexOf("limit"));
      }
    },
  },
  methods: {
    //Берет последние слова в каждой строке
    takeLastWordsInRow() {
      const takedWords = document.querySelectorAll(".typeframe-words_word");
      let yPosDefault = takedWords[0].getBoundingClientRect().y;
      takedWords.forEach((element, index) => {
        const yPosElement = element.getBoundingClientRect().y;

        if (yPosElement > yPosDefault) {
          this.lastRowWords.push(this.words[index - 1]);
          yPosDefault = yPosElement;
        }
      });
    },
    //Обрезание строки, первой в отображении
    trimRow() {
      this.toDeleteWords.pop();
      const newWords = new Set(this.toDeleteWords);
      this.words = this.words.filter((e) => !newWords.has(e));
      this.currentWord = 0;
    },
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
      this.arrCorrectWords = [];
      this.toDeleteWords = [];
      this.accurancy = 0;
      this.text = "";
      this.date1 = null;
      this.date2 = null;
      this.row = 0;
      this.isStart = false;
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
      this.isLetterLimit = false;
    },
    //отработка с нажатия клавиш
    checkWord(e) {
      this.keyEvent = e;
      this.capsWarning = e.getModifierState("CapsLock");

      const word = this.words[this.currentWord];

      this.toDeleteWords.push(word);

      if (e.code === "Space") {
        const isCorrect = e.target.value === word.text;
        const isIncorrect =
          e.target.value.length === word.text.length && !isCorrect;

        if (isCorrect) {
          word.class = "correctWord";
          this.countCorrectWords++;
          this.arrCorrectWords.push(word);

          this.nextWord();

          //Проверка последного слова в строке
          if (word == this.lastRowWords[this.row]) {
            this.trimRow();
            this.row++;
          }
        } else if (isIncorrect) {
          word.class = "incorrectWord";
          this.nextWord();

          //Проверка последного слова в строке
          if (word == this.lastRowWords[this.row]) {
            this.trimRow();
            this.row++;
          }
        }

        e.preventDefault();
      }
    },
    //отработка изменений в инпуте
    checkLetter(e) {
      this.start();

      let input = e.target.value;
      const word = this.words[this.currentWord].letters[this.currentLetter];

      // Отбработка в случае лимита букв
      if (this.isLetterLimit) {
        let slicedText = "";

        slicedText = this.text.slice(
          0,
          this.words[this.currentWord].text.length
        );
        this.text = slicedText;

        if (this.words[this.currentWord].class.indexOf("limit") === -1) {
          this.words[this.currentWord].class += " limit";
        }
      }
      //Нажатие на backspace
      if (this.keyEvent.code === "Backspace") {
        if (this.currentLetter > 0) {
          this.words[this.currentWord].letters[this.currentLetter - 1].class =
            "";
          if (word) word.class = "";
          this.currentLetter--;
          this.isLetterLimit = false;
        }
        //Когда есть лимит, он дается, только с задержкой в 1 симбвол
      } else if (
        input.length > this.words[this.currentWord].text.length &&
        !this.isLetterLimit
      ) {
        this.isLetterLimit = true;

        //Определение верного симбвола (буквы)
      } else {
        if (!this.isLetterLimit) {
          if (input[this.currentLetter] === word.letter) {
            word.class = "correctLetter";
            this.currentLetter++;
          } else {
            word.class = "incorrectLetter";
            this.currentLetter++;
          }
        }
      }
    },
    //при фокусе и блюре, показывает окно расфокуса
    focusImport() {
      const input = this.$refs.focusRef;

      const isFocused = document.activeElement === input;

      const wordsRef = this.$refs.wordsRef;
      const wrapRef = this.$refs.wrapRef;

      wordsRef?.classList.toggle("blur", !isFocused);
      wrapRef?.classList.toggle("blur-text", !isFocused);
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
        <div v-show="isStart">{{ countCorrectWords }}/{{ wordsCount }}</div>
      </div>
      <div class="typeframe-wrapper" ref="wrapRef">
        <div class="typeframe-words" ref="wordsRef">
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
      <!-- Для отладки -->
      <!-- <div>
        <ul>
          <li><strong>Текущая буква - </strong>{{ currentLetter }}</li>
          <li><strong>Текущее слово - </strong>{{ currentWord }}</li>
          <li><strong>Лимит - </strong>{{ isLetterLimit }}</li>
          <li><strong>Строка - </strong>{{ row }}</li>
        </ul>
      </div> -->
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
ul {
  color: #ec5028;
}
.word {
  position: relative;
  padding-left: 10px;
  font-size: 24px;
}

.limit {
  animation: shake 0.5s infinite;

  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
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
      animation: loop 1s infinite;
      animation-direction: alternate;
    }

    @keyframes loop {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
  @keyframes next {
    0% {
      transform: translate(-10px, 0px);
    }
    100% {
    }
  }

  &::before {
    content: "";
    width: 2px;
    top: 6px;
    height: 26px;
    background-color: #ec5028;
    position: absolute;
    animation: next 0.1s ease-out forwards;
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
  text-decoration: underline red 1px;
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
    right: 40%;
    bottom: 0;
    z-index: 21;
    font-weight: 500;
    color: #ec5028;
    font-size: 30px;
    width: 600px;
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
