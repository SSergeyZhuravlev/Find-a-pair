import { CardWithNumber } from './cardWithNumber.js';
import { getImages } from "./getImages.js";

let imgArr;
try {
  document.querySelector('.spinner-border').style.zIndex = '1001';
  document.querySelector('.spinner-border').style.display = 'block';
  imgArr = await getImages('https://dog.ceo/api/breeds/image/random');
}
catch {
  imgArr = [
    './images/100.jpg',
    './images/101.jpg',
    './images/102.jpg',
    './images/103.jpg',
    './images/200.jpg',
    './images/201.jpg',
    './images/202.jpg',
    './images/203.jpg',
    './images/204.jpg',
    './images/205.jpg',
  ]
}
finally {
  document.querySelector('.spinner-border').style.zIndex = '-1';
  document.querySelector('.spinner-border').style.display = 'none';
}

export class CardWithImage extends CardWithNumber {
  set cardNumber(number) {
    const img = document.createElement('img');
    img.classList.add('card-img');

    img.textContent = number;
    img.src = imgArr[number];
    img.onerror = () => {
      img.src = './images/error-img.jpg';
    }

    this._cardNumber = img;
  }

  get cardNumber() {
    return this._cardNumber
  }
}

