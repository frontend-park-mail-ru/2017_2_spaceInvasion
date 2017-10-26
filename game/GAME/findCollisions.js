window.findCollisions = (function () {
  function * findCollisions (arr1, arr2) {
    for (let elArr1 of arr1) {
      for (let elArr2 of arr2) {
        if (
          (
            (
              (elArr1.x_position + elArr1.width >= elArr2.x_position) && //elArr1 слева от elArr2
              (elArr1.x_position <= elArr2.x_position + elArr2.width)
            )
            ||
            (
              (elArr1.x_position <= elArr2.x_position + elArr2.width ) && //elArr1 слева от elArr2
              (elArr1.x_position + elArr1.width >= elArr2.x_position)
            )
          )
          &&
          (
            (
              (elArr1.y_position + elArr1.height >= elArr2.y_position) &&  // elArr1 сверху от elArr2
              (elArr1.y_position <= elArr2.y_position + elArr2.height)
            )
            // ||
            // (
            //   (elArr1.y_position <= elArr2.y_position + elArr2.height) &&  //elArr1 снизу от elArr2
            //   (elArr1.y_position + elArr1.height >= elArr2.y_position)
            // )
          )
        ) {
          yield [elArr1, elArr2];
        }
      }
    }
    return 0;
  }
  return findCollisions;
})(window);