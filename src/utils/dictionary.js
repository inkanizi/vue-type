//можно сократить запись до просто объекта с текстом
// и потом сувать в него всё остальное
const words = [
  { text: "забыть", class: "inactiveWord", letters: [] },
  { text: "сказать", class: "inactiveWord", letters: [] },
  { text: "мыло", class: "inactiveWord", letters: [] },
  { text: "тест", class: "inactiveWord", letters: [] },
  { text: "на", class: "inactiveWord", letters: [] },
  { text: "гречка", class: "inactiveWord", letters: [] },
  { text: "коньки", class: "inactiveWord", letters: [] },
  { text: "быть", class: "inactiveWord", letters: [] },
  { text: "здесь", class: "inactiveWord", letters: [] },
  { text: "там", class: "inactiveWord", letters: [] },
];

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
