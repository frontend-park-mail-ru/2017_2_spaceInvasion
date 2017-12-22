import {throwIfNull} from './utils';

let devDialog: HTMLElement;

function closeDialog(): void {
  if (devDialog) {
    devDialog.setAttribute('class', 'ui modal scrolling transition hidden');
  }
}

function initDialog(): void {
  const dialog = throwIfNull(document.querySelector('div.ui.modal'));
  const closeDialogBtn = throwIfNull(document.querySelector('.closeBtn'));

  devDialog = <HTMLElement> dialog;
  closeDialogBtn.addEventListener('click', closeDialog);
  dialog.setAttribute('style', 'display: block !important; top: 265px;');
  dialog.classList.add('scrolling', 'transition', 'visible', 'active', 'animating', 'scale', 'in');
}

function alertDialog(): void {
  const developerAvatar = document.querySelectorAll('img#devAvatar');
  const dialog = document.querySelectorAll('.ui.modal')[0];

  const developersInfo = {
    avatars: [
      '/images/olga_surikova.jpg', '/images/vasiliy_dmitriev.jpg', '/images/nikita_boyarskikh.jpg', '/images/egor_kurakov.jpg',
    ],
    names: [
      'Olga Surikova', 'Vasiliy Dmitriev', 'Nikita Boyarskikh', 'Egor Kurakov',
    ],
    workOn: ['Frontend', 'Frontend', 'Fullstack', 'Backend'],
  };

  const avatar = <HTMLElement> dialog.querySelector('img#developer-avatar');
  const title = <HTMLElement> dialog.querySelector('.ui.header');
  const workOn = <HTMLElement> dialog.querySelector('.ui.header#workOn');

  developerAvatar.forEach((element) => {
    element.addEventListener('click', () => {
      const id = throwIfNull(element.getAttribute('name'));
      avatar.setAttribute('src', developersInfo.avatars[+id]);
      title.innerText = `${developersInfo.names[+id]}`;
      workOn.innerText = `${developersInfo.workOn[+id]}`;
      initDialog();
    });
  });
}

export {alertDialog, closeDialog};
