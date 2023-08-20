import { createDblArr } from "./script.js";

export async function getImages(src) {
  const arr = [];

  for (let i = 0; i < 50; i++) {
    const response = await fetch(src);

    if (response.status === 200 || response.status === 201) {
      response.json().then(res => arr.push(res.message));
    } else {
      throw new Error('Изображение не загрузилось!')
    }
  }

  let dblArr = createDblArr(arr);
  return dblArr;
}
