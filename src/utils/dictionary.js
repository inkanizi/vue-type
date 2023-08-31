const dictonary = [
  "о",
  "у",
  "и",
  "я",
  "к",
  "в",
  "а",
  "со",
  "да",
  "не",
  "уж",
  "же",
  "по",
  "об",
  "во",
  "ну",
  "за",
  "на",
  "он",
  "вы",
  "ни",
  "но",
  "бы",
  "ли",
  "мы",
  "из",
  "ты",
  "до",
  "от",
  "они",
  "раз",
  "мир",
  "кто",
  "для",
  "уже",
  "нет",
  "еще",
  "она",
  "над",
  "так",
  "вот",
  "тот",
  "что",
  "ваш",
  "про",
  "дом",
  "час",
  "это",
  "там",
  "наш",
  "чем",
  "сам",
  "где",
  "при",
  "как",
  "ряд",
  "мой",
  "без",
  "вид",
  "под",
  "тут",
  "год",
  "или",
  "отец",
  "друг",
  "сила",
  "дело",
  "если",
  "жить",
  "день",
  "тоже",
  "свет",
  "свой",
  "твой",
  "мочь",
  "весь",
  "есть",
  "надо",
  "свое",
  "идти",
  "ночь",
  "стол",
  "пока",
  "нога",
  "рука",
  "вода",
  "дать",
  "быть",
  "хотя",
  "лицо",
  "лишь",
  "себя",
  "жена",
  "даже",
  "этот",
  "ведь",
  "куда",
  "много",
  "иметь",
  "никто",
  "тогда",
  "пойти",
  "время",
  "земля",
  "новый",
  "когда",
  "какой",
  "здесь",
  "после",
  "хочет",
  "сразу",
  "такой",
  "выйти",
  "стать",
  "знать",
  "почти",
  "опять",
  "более",
  "самый",
  "белый",
  "очень",
  "перед",
  "слово",
  "город",
  "ничто",
  "потом",
  "место",
  "чтобы",
  "жизнь",
  "между",
  "конец",
  "вдруг",
  "дверь",
  "снова",
  "через",
  "взять",
  "можно",
  "начало",
  "давать",
  "работа",
  "другой",
  "хотеть",
  "каждый",
  "сидеть",
  "страна",
  "деньги",
  "видеть",
  "минута",
  "старый",
  "потому",
  "делать",
  "голова",
  "правда",
  "бывать",
  "вопрос",
  "понять",
  "стоять",
  "теперь",
  "просто",
  "только",
  "почему",
  "всегда",
  "думать",
  "машина",
  "значить",
  "кровать",
  "сторона",
  "человек",
  "молчать",
  "ребенок",
  "главный",
  "должный",
  "женщина",
  "увидеть",
  "сказать",
  "сделать",
  "который",
  "ответить",
  "казаться",
  "подумать",
  "понимать",
  "работать",
  "спросить",
  "смотреть",
  "оказаться",
  "показаться",
  "радоваться",
  "посмотреть",
  "отказываться",
];

const words = [];

//Берет обпред кол-во случайных слов
export const take = (arr, n) => {
  return arr.sort(() => 0.5 - Math.random()).slice(0, n);
};

//Случайное пермешивание массива
export const shuffle = (words) => {
  return words.sort(() => 0.5 - Math.random());
}

const fill = () => {
  dictonary.forEach((item) => {
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
        class: "",
      });
    });
  });
};

fill();

export default words;
