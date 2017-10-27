/* eslint-disable no-restricted-syntax */
export default function* findCollisions(arr1, arr2) {
  for (const elArr1 of arr1) {
    for (const elArr2 of arr2) {
      if (
        (
          (
            (elArr1.xPosition + elArr1.width >= elArr2.xPosition) && // elArr1 слева от elArr2
              (elArr1.xPosition <= elArr2.xPosition + elArr2.width)
          )
            ||
            (
              (elArr1.xPosition <= elArr2.xPosition + elArr2.width) && // elArr1 слева от elArr2
              (elArr1.xPosition + elArr1.width >= elArr2.xPosition)
            )
        )
          &&
          (
            (
              (elArr1.yPosition + elArr1.height >= elArr2.yPosition) && // elArr1 сверху от elArr2
              (elArr1.yPosition <= elArr2.yPosition + elArr2.height)
            )
            // ||
            // (
            //   (elArr1.yPosition <= elArr2.yPosition + elArr2.height) &&  //elArr1 снизу от elArr2
            //   (elArr1.yPosition + elArr1.height >= elArr2.yPosition)
            // )
          )
      ) {
        yield [elArr1, elArr2];
      }
    }
  }
  return 0;
}
