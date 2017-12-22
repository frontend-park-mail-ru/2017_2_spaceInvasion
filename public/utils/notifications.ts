import Navigator from '../modules/navigator';

const swal = require('sweetalert2');

function showError(message: string): void {
  swal({
    type: 'error',
    titleText: 'Error',
    text: message,
    showConfirmButton: false,
    showCloseButton: true,
    backdrop: false,
    timer: 2000
  });
}

function dismissAllMessages(): void {
  swal.close();
}

function showLeaveGameNotification(): void {
  const backToGameID = 'backToGame';
  swal({
    backdrop: false,
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
