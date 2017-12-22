import {throwIfNull} from './utils';

function protect(img: HTMLImageElement): HTMLImageElement {
  const ratio = img.width / img.height;

  const maxSquare = 5000000;  // ios max canvas square
  const maxSize = 4096;  // ie max canvas dimensions

  let maxW = Math.floor(Math.sqrt(maxSquare * ratio));
  let maxH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio));
  if (maxW > maxSize) {
    maxW = maxSize;
    maxH = Math.round(maxW / ratio);
  }
  if (maxH > maxSize) {
    maxH = maxSize;
    maxW = Math.round(ratio * maxH);
  }
  if (img.width > maxW) {
    const canvas = document.createElement('canvas');
    canvas.width = maxW;
    canvas.height = maxH;
    throwIfNull(canvas.getContext('2d')).drawImage(img, 0, 0, maxW, maxH);
    img.src = canvas.toDataURL();
  }

  return img;
}

function resize(img: HTMLImageElement, w: number, h: number): HTMLImageElement {
  img = protect(img);

  let steps = Math.ceil(Math.log(img.width / w) / Math.LN2);
  let sW = w * Math.pow(2, steps - 1);
  let sH = h * Math.pow(2, steps - 1);
  const x = 2;

  while (steps--) {
    const canvas = document.createElement('canvas');
    canvas.width = sW;
    canvas.height = sH;
    throwIfNull(canvas.getContext('2d')).drawImage(img, 0, 0, sW, sH);
    img.src = canvas.toDataURL();

    sW = Math.round(sW / x);
    sH = Math.round(sH / x);
  }

  return img;
}

export default resize;