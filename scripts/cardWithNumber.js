export class CardWithNumber {
  constructor(container, cardNumber, flip) {
    this.container = container;
    this.cardNumber = cardNumber;
    this.flip = flip;
    this.open = false;
    this.gameCard = this.createCard();
  }

  set cardNumber(number) {
    const numberSpan = document.createElement('span');
    numberSpan.textContent = number;
    this._cardNumber = numberSpan;
  }

  get cardNumber() {
    return this._cardNumber;
  }

  createCard() {
    const gameCard = document.createElement('div'),
          gameCardBack = document.createElement('div'),
          gameCardFront = document.createElement('div');

    gameCard.classList.add('card', 'btn-reset');
    gameCardFront.classList.add('card__front');
    gameCardBack.classList.add('card__back');

    gameCardFront.append(this.cardNumber);

    gameCard.append(gameCardFront);
    gameCard.append(gameCardBack);


    gameCard.addEventListener('click', (card) => {
      if (!this.open) {
        this.open = true;
        this.flip(card.currentTarget);
        gameCard.classList.add('flip');
      }
    });

    this.container.append(gameCard);

    return gameCard;
  }

  set open(value) {
    this._open = value;
  }

  get open() {
    return this._open;
  }
}
