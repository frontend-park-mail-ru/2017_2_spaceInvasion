import Navigator from '../modules/navigator';
const swal = require('sweetalert2');

function showError(message: string): void {
  swal({
    position: 'top-right',
    type: 'error',
    titleText: 'Error',
    text: message,
    showConfirmButton: false
  });
}

function dismissAllMessages(): void {
  Array.from(document.getElementsByClassName('swal2-container'))
    .forEach(el => el.setAttribute('hidden', 'hidden'));
}

function showLeaveGameNotification(): void {
  const backToGameID = 'backToGame';
  swal({
    position: 'top-right',
    width: 200,
    type: 'info',
    titleText: 'Игра идёт',
    html: '<a id=' + backToGameID + '>Вернитесь в игру!</a>',
    showConfirmButton: false,
    onOpen: () => {
      const link = document.getElementById(backToGameID);
      if (link !== null) {
        link.addEventListener('click', Navigator.sections.game.show);
      }
      return true;
    }
  });
}

export {dismissAllMessages, showError, showLeaveGameNotification};
