import { CardWithNumber } from "./cardWithNumber.js";
import { CardWithImage } from './cardWithImage.js';
import { confetti } from "./confetti.js";

const body = document.querySelector('body');
const gameContainer = document.querySelector('.game-container');
let verticalCount;
let horizontaCount;
let timerID;
let res;

const start = createStartWindow();
function createStartWindow() {
  const startWindow = document.createElement('form');
  const startTitle = document.createElement('h1');
  const selectDescr = document.createElement('p');
  const gameSelect = document.createElement('select');
  const gameOptionNums = document.createElement('option');
  const gameOptionImgs = document.createElement('option');
  const inputVertical = document.createElement('input');
  const inputHorizontal = document.createElement('input');
  const btnStart = document.createElement('button');
  const descrFirst = document.createElement('p');
  const descrSecond = document.createElement('p');

  startWindow.classList.add('start__window');
  startTitle.classList.add('start__title');
  selectDescr.classList.add('select-descr');
  gameSelect.classList.add('form-select', 'form-select-sm');
  inputVertical.classList.add('vertical-count');
  inputHorizontal.classList.add('horizontal-count');
  descrFirst.classList.add('input__descr');
  descrSecond.classList.add('input__descr')
  btnStart.classList.add('start__btn');


  startTitle.textContent = 'Найди пару';
  selectDescr.textContent = 'Выбери режим';
  btnStart.textContent = 'Старт';
  descrFirst.textContent = 'Кол-во ячеек по вертикали';
  descrSecond.textContent = 'Кол-во ячеек по горизонтали';
  gameOptionNums.textContent = 'Цифры';
  gameOptionImgs.textContent = 'Картинки';

  gameSelect.append(gameOptionNums, gameOptionImgs);
  startWindow.append(startTitle, selectDescr, gameSelect, descrFirst, inputVertical, descrSecond, inputHorizontal, btnStart);
  body.append(startWindow);

  startWindow.addEventListener('submit', (e) => {
    e.preventDefault();
    if (inputVertical.value == '' || inputHorizontal.value == '') {
      alert('Заполните оба поля!')
      return
    }

    if ((parseInt(inputVertical.value) % 2 === 1) || (parseInt(inputHorizontal.value) % 2 === 1)) {
      alert('Только четные числа!');
      inputVertical.value = '';
      inputHorizontal.value = '';
      return
    }

    if ((parseInt(inputVertical.value) > 10) || (parseInt(inputHorizontal.value) > 10)) {
      alert('Только числа меньше 10!');
      inputVertical.value = '';
      inputHorizontal.value = '';
      return
    }

    createGameField();
    startWindow.classList.add('hidden');
    inputVertical.value = '';
    inputHorizontal.value = '';
  })

  return {
    startWindow,
    inputVertical,
    inputHorizontal,
  }
}

function createNumbersArr() {
  let numbersArr = [];
  verticalCount = parseInt(start.inputVertical.value);
  horizontaCount = parseInt(start.inputHorizontal.value);
  let arrCount = (verticalCount * horizontaCount) / 2;
  for (let numItem = 1; numItem <= arrCount; ++numItem) {
    numbersArr.push(numItem);
  }
  return numbersArr
}

export function createDblArr(arr) {
  let dblArr = [];
  dblArr = arr.concat(arr);
  return dblArr
}

function createShuffledArr() {
  let shuffledNumbersArr = [];
  const dblNumbers = createDblArr(createNumbersArr())
  for (let i = dblNumbers.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [dblNumbers[i], dblNumbers[j]] = [dblNumbers[j], dblNumbers[i]]
  }
  shuffledNumbersArr = dblNumbers;
  return shuffledNumbersArr
}

function createGameField() {
  gameContainer.classList.add('active');

  const shuffle = createShuffledArr();
  let firstCard = null,
      secondCard = null,
      openedCards = [];

  for (let i = 0; i < shuffle.length; i++) {
    const select = document.querySelector('.form-select');
    if (select.value === 'Цифры') {
      new CardWithNumber(gameContainer, shuffle[i], function(card) {
        if (firstCard === null && this.open) {
          firstCard = {class: this, card: card};
          this.open = false;
          return
        }

        if (firstCard !== null && this.open) {
          secondCard = {class: this, card: card};
          this.open = false;
        }

        if (firstCard.class.cardNumber !== secondCard.class.cardNumber) {
          setTimeout(() => {
            firstCard.card.classList.remove('flip');
            secondCard.card.classList.remove('flip');
            firstCard = null;
            secondCard = null;
          }, 500)
        } else {
          openedCards.push(firstCard, secondCard);
          firstCard = null;
          secondCard = null;
        }

        if (openedCards.length === shuffle.length) {
          setTimeout(() => {
            while (gameContainer.firstChild) {
              gameContainer.removeChild(gameContainer.firstChild);
              gameContainer.classList.remove('active');
            }
          }, 700)

          const cards = document.querySelectorAll('.card');
          cards.forEach((elem) => {
            setTimeout(() => {
              elem.classList.remove('flip');
            }, 700)
          });

          createEndWindow();

          openedCards = [];
          clearInterval(timerID);
          timerID = null;
        }
      });
    }

    if (select.value === 'Картинки') {
      new CardWithImage(gameContainer, shuffle[i], function(card) {
        if (firstCard === null && this.open) {
          firstCard = {class: this, card: card};
          this.open = false;
          return
        }

        if (firstCard !== null && this.open) {
          secondCard = {class: this, card: card};
          this.open = false;
        }

        if (firstCard.class.cardNumber.textContent !== secondCard.class.cardNumber.textContent) {
          setTimeout(() => {
            firstCard.card.classList.remove('flip');
            secondCard.card.classList.remove('flip');
            firstCard = null;
            secondCard = null;
          }, 500)
        } else {
          openedCards.push(firstCard, secondCard);
          firstCard = null;
          secondCard = null;
        }

        if (openedCards.length === shuffle.length) {
          setTimeout(() => {
            while (gameContainer.firstChild) {
              gameContainer.removeChild(gameContainer.firstChild);
              gameContainer.classList.remove('active');
            }
          }, 700)

          const cards = document.querySelectorAll('.card');
          cards.forEach((elem) => {
            setTimeout(() => {
              elem.classList.remove('flip');
            }, 700)
          });

          createEndWindow();

          openedCards = [];
          clearInterval(timerID);
          timerID = null;
        }
      });
    }
  }

  if (horizontaCount > 6) {
    gameContainer.classList.add('game-container--big');
  }

  let timer = document.createElement('div');
  timer.textContent = 60;
  timer.classList.add('game-container__timer')
  gameContainer.append(timer);

  function createTimer() {
    let timerNum = parseInt(timer.textContent);
    if (timerNum > 0) {
      timer.textContent = timerNum - 1;
    } else {
      createGameOver();
      setTimeout(() => {
        while (gameContainer.firstChild) {
          gameContainer.removeChild(gameContainer.firstChild);
          gameContainer.classList.remove('active');
        }
      }, 700)
      clearInterval(timerID);
      timerID = null;
    }
  }
  timerID = setInterval(createTimer, 1000);
}

function createEndWindow() {
  const endWindow = document.querySelector('.end__window');
  const btnRestart = document.querySelector('.restart__btn');
  endWindow.classList.add('active');
  document.querySelector('.confetti').innerHTML = confetti;

  btnRestart.addEventListener('click', () => {
      endWindow.classList.remove('active');
      start.startWindow.classList.remove('hidden');
    })
}

function createGameOver() {
  const gameOver = document.querySelector('.game-over');
  const btnRestartGameOver = document.querySelector('.game-over__btn');
  gameOver.classList.add('active');

  btnRestartGameOver.addEventListener('click', () => {
      gameOver.classList.remove('active');
      start.startWindow.classList.remove('hidden');
    })
}



