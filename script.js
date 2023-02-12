(() => {
  const body = document.querySelector('body');
  const gameContainer = document.querySelector('.game-container');
  let verticalCount;
  let horizontaCount;
  let timerID;

  const start = createStartWindow();
  function createStartWindow() {
    const startWindow = document.createElement('form');
    const startTitle = document.createElement('h1');
    const inputVertical = document.createElement('input');
    const inputHorizontal = document.createElement('input');
    const btnStart = document.createElement('button');
    const descrFirst = document.createElement('p');
    const descrSecond = document.createElement('p');

    startWindow.classList.add('start__window');
    startTitle.classList.add('start__title');
    inputVertical.classList.add('vertical-count');
    inputHorizontal.classList.add('horizontal-count');
    descrFirst.classList.add('input__descr');
    descrSecond.classList.add('input__descr')
    btnStart.classList.add('start__btn');

    startTitle.textContent = 'Привет! Сыграем?'
    btnStart.textContent = 'Старт';
    descrFirst.textContent = 'Кол-во ячеек по вертикали';
    descrSecond.textContent = 'Кол-во ячеек по горизонтали'

    startWindow.append(startTitle);
    startWindow.append(descrFirst);
    startWindow.append(inputVertical);
    startWindow.append(descrSecond);
    startWindow.append(inputHorizontal);
    startWindow.append(btnStart);
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
    verticalCount = parseInt(start.inputVertical.value);
    horizontaCount = parseInt(start.inputHorizontal.value);
    let numbersArr = [];
    let arrCount = (verticalCount * horizontaCount) / 2;
    for (let numItem = 1; numItem <= arrCount; ++numItem) {
      numbersArr.push(numItem);
    }
    return numbersArr
  }

  function createDblArr() {
    let dblArr = [];
    const numbersArr = createNumbersArr();
    dblArr = numbersArr.concat(numbersArr);
    return dblArr
  }

  function createShuffledArr() {
    let shuffledNumbersArr = [];
    const dblNumbers = createDblArr()
    for (let i = dblNumbers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [dblNumbers[i], dblNumbers[j]] = [dblNumbers[j], dblNumbers[i]]
    }
    shuffledNumbersArr = dblNumbers;
    return shuffledNumbersArr
  }

  function createGameCard() {
    const gameCard = document.createElement('div'),
          gameCardBack = document.createElement('div');
    let gameCardFront = document.createElement('div');

    gameCard.classList.add('card');
    gameCardFront.classList.add('card__front');
    gameCardBack.classList.add('card__back');

    gameCard.append(gameCardFront);
    gameCard.append(gameCardBack);

      return {
        gameCard,
        gameCardFront,
        gameCardBack,
      }
    }

  function createGameLines() {
    let gameLine = document.createElement('div');

    gameLine.classList.add('card__line');
    gameContainer.append(gameLine);

    let card;
        cardCount = 0;
    verticalCount = parseInt(start.inputVertical.value);
    horizontaCount = parseInt(start.inputHorizontal.value);
    while (cardCount < horizontaCount) {
      card = createGameCard();
      gameLine.append(card.gameCard);
      ++cardCount
    }

    return {
      gameLine,
      card
    }
  }

  function createGameField() {
    gameContainer.classList.add('active');

    let linesCount = 0;
    verticalCount = parseInt(start.inputVertical.value);
    horizontaCount = parseInt(start.inputHorizontal.value);
    do {
      createGameLines();
      ++linesCount;
    } while (linesCount < verticalCount);

    const shuffle = createShuffledArr();
    let frontCards = Array.from(document.querySelectorAll('.card__front'));
    for (let j = 0; j < frontCards.length; j++) {
      let front = frontCards[j];
      for (let i = 0; i < shuffle.length; i++) {
        let num = shuffle[i];
        if (j === i) {
          front.innerHTML = num
        }
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

    const cards = document.querySelectorAll('.card');
    let firstCard,
        secondCard,
        hasOpenedCard = false,
        openedCards = [];

    function openCard() {
      this.classList.add('flip');
      if (!hasOpenedCard) {
        hasOpenedCard = true;
        firstCard = this;
        return
      }

      secondCard = this;
      hasOpenedCard = false;

      if (firstCard.firstChild.innerHTML !== secondCard.firstChild.innerHTML) {
        setTimeout(() => {
          firstCard.classList.remove('flip');
          secondCard.classList.remove('flip');
        }, 500)
      } else openedCards.push(firstCard, secondCard);


      if (openedCards.length === cards.length) {
        setTimeout(() => {
          while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
            gameContainer.classList.remove('active');
          }
        }, 700)

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
    }

    cards.forEach(card => card.addEventListener('click', openCard));
  }

  function createEndWindow() {
    const endWindow = document.querySelector('.end__window');
    const btnRestart = document.querySelector('.restart__btn');
    endWindow.classList.add('active');

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
}) ();
