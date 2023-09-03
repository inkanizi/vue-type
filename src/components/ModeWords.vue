<script>
import words from "../utils/dictionary";
import Result from "./Result.vue";
import { nextTick } from "vue";
import { take, shuffle } from "../utils/dictionary";
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
      countCorrectWords: 0,
      isStart: false,
      keyEvent: {}, //для передачи event с клавиатуры в событие инпута
      row: 0, //Кол-во строк в отображаемом тексте
      capsWarning: false, //Предупреждение о капсе
      arrCorrectWords: [],
      toDeleteWords: [], //Массив слов, которые будут убраны после изменения строки
      lastRowWords: [], //Последние слова в каждой из строк
      isLetterLimit: false, //Лимит букв в слове

      date1: null,
      date2: null,
    };
  },
  //Перед монтированием
  beforeMount() {
    this.words = take(words, this.wordsCount);
    this.words = shuffle(this.words);
    this.clearClasses();
  },
  //Во время монтирования
  mounted() {},
  computed: {
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
    words() {
      this.takeLastWordsInRow();
    },
    //При изменении кол-ва слов, нужно еще что-то изменять
    wordsCount() {
      this.restart();
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
      let word = this.words[this.currentWord];

      word.letters[this.currentLetter] &&
        (word.letters[this.currentLetter].class += " caret");

      word.letters[oldVal] && (word.letters[oldVal].class += " ");

      if (
        word.letters[word.letters.length] === word.letters[this.currentLetter]
      ) {
        word.letters[word.letters.length - 1].class += " lastCaret";
      }
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
    async takeLastWordsInRow() {
      await nextTick();
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
      this.lastRowWords = [];
      this.text = "";
      this.row = 0;
      this.isLetterLimit = false;
      this.isStart = false;

      this.date1 = null;
      this.date2 = null;

      this.start = this.start = function () {
        this.isStart = true;
        this.date1 = new Date();
        this.start = function () {
          return false;
        };
      };
      this.words = take(words, this.wordsCount);
      this.words = shuffle(this.words);
      this.clearClasses();

      //Решает проблему с фокусом в инпут
      await nextTick();
      this.$refs.focusRef.focus();
    },

    //переключает слово вперед
    nextWord() {
      const lastLetter =
        this.words[this.currentWord].letters[
          this.words[this.currentWord].letters.length - 1
        ];

      if (lastLetter.class.indexOf("lastCaret") !== -1) {
        lastLetter.class = lastLetter.class.slice(
          0,
          lastLetter.class.indexOf("lastCaret")
        );
      }
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
        const isLastWord = word == this.lastRowWords[this.row];

        if (isCorrect) {
          word.class = "correctWord";
          this.countCorrectWords++;
          this.arrCorrectWords.push(word);

          this.nextWord();

          //Проверка последного слова в строке
          if (isLastWord) {
            this.trimRow();
            this.row++;
          }
        } else if (isIncorrect) {
          word.class = "incorrectWord";
          this.nextWord();

          //Проверка последного слова в строке
          if (isLastWord) {
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
      //Когда есть лимит, он дается
      if (
        input.length + 1 > this.words[this.currentWord].text.length &&
        !this.isLetterLimit
      ) {
        this.isLetterLimit = true;
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
      <button @click="restart" class="typeframe-btn_restart">
        <font-awesome-icon
          icon="fa-solid fa-arrows-rotate"
          class="typeframe-btn_icon"
          size="2x"
        />
      </button>
    </template>

    <Result
      v-if="isEnd"
      :countCorrectWords="countCorrectWords"
      :time="time"
      :arrCorrectWords="arrCorrectWords"
      @restart="restart"
    />
  </div>
</template>

<style lang="scss"></style>
