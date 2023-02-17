const dictonary = [
  "свой",
  "жить",
  "страна",
  "сделать",
  "даже",
  "почти",
  "чтобы",
  "дверь",
  "осел",
  "взять",
  "более",
  "над",
  "она",
  "какой",
  "куда",
  "старый",
  "сразу",
  "начало",
  "ряд",
  "работа",
  "через",
  "сторона",
  "земля",
  "вода",
  "ответить",
  "хотеть",
  "лицо",
  "случай",
  "да",
];

const words = [];

const take = (array, count) => {
  let newArray = [];
  for (let i = 0; i < count; i++) {
    newArray.push(array.splice(Math.floor(Math.random() * array.length), 1)[0]);
  }
  return newArray;
};

take(dictonary, 10).forEach((item, index) => {
  words.push({
    text: item,
    class: "inactiveWord",
    letters: [],
  });
});

words.forEach((word, index) => {
  let splitLetter = word.text.split("");
  splitLetter.forEach((letter) => {
    words[index].letters.push({
      letter: letter,
      class: "", // можно поставить сюда inactive
    });
  });
});

export default words;
