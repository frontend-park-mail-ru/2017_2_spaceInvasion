import Navigator from '../modules/navigator';

class PNotify {
  constructor(data: any) {
    console.log(data);
  }

  static removeAll(): void {
    console.log('remove it');
  }
}

function dismissAllMessages(): void {
  PNotify.removeAll();
}

function showError(message: string): void {
  new PNotify({
    buttons: {
      sticker: false
    },
    title: 'Error',
    text: message,
    type: 'error',
  });
}

function showLeaveGameNotification(): void {
  const backToGameID = 'backToGame';
  new PNotify({
    title: 'Игра идёт',
    type: 'info',
    text: '<a id=' + backToGameID + '>Вернитесь в игру!</a>',
    nonblock: {
      nonblock: true,
    },
    animation: 'none',  // NOTE: Bug in PNotify (https://github.com/sciactive/pnotify/issues/241#issuecomment-340626073)
    hide: false,
    after_open: () => {
      const link = document.getElementById(backToGameID);
      if (link !== null) {
        link.addEventListener('click', Navigator.sections.game.show);
      }
      return true;
    }
  });
}

export default PNotify;
export {dismissAllMessages, showError, showLeaveGameNotification};