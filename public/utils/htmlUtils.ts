import { showGame } from '../modules/navigator';

const PNotify = require('../pnotify.custom.min.js');

function throwIfNull<T>(a : T|null) : T {
  if (a === null) {
    throw Error('Variable ' + a + ' must not be null');
  }
  return a;
}

function dismissAllMessages() : void {
  PNotify.removeAll();
}

function showError(message : string) : void {
  return new PNotify({
    buttons: {
      sticker: false
    },
    title: 'Error',
    text: message,
    type: 'error',
  });
}

function showLeaveGameNotification() {
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
        link.onclick = showGame;
      }
      return true;
    }
  });
}

export { throwIfNull, showError, showLeaveGameNotification, dismissAllMessages };