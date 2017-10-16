function closeDialog() {
  if (window.devDialog) {
    window.devDialog.setAttribute('class', 'ui modal scrolling transition hidden');
  }
}

function initDialog() {
  const dialog = document.querySelector('div.ui.modal');
  const closeDialogBtn = document.querySelector('.closeBtn');

  window.devDialog = dialog;
  closeDialogBtn.setAttribute('style', 'color:#ffffff');
  closeDialogBtn.addEventListener('click', closeDialog);
  dialog.setAttribute('style', 'display: block !important; top: 265px;');
  dialog.classList.add('scrolling', 'transition', 'visible', 'active', 'animating', 'scale', 'in');
}

function alertDialog() {
  const developerAvatar = document.querySelectorAll('img#devAvatar');
  const dialog = document.querySelectorAll('.ui.modal')[0];

  const developersInfo = {
    avatars: [
      '/images/olga_surikova.jpg', '/images/vasiliy_dmitriev.jpg', '/images/nikita_boyarskikh.jpg', '/images/egor_kurakov.jpg',
    ],
    names: [
      'Olga Surikova', 'Vasiliy Dmitriev', 'Nikita Boyarskikh', 'Egor Kurakov',
    ],
    workOn: ['Frontend', 'Frontend', 'Backend', 'Backend'],
  };

  const avatar = dialog.querySelector('img#developer-avatar');
  const title = dialog.querySelector('.ui.header');
  const workOn = dialog.querySelector('.ui.header#workOn');

  developerAvatar.forEach((element) => {
    element.onclick = function clickHandler() { // eslint-disable-line no-param-reassign
      const id = element.getAttribute('name');
      avatar.setAttribute('src', developersInfo.avatars[+id]);
      title.innerText = `${developersInfo.names[+id]}`;
      workOn.innerText = `${developersInfo.workOn[+id]}`;
      initDialog();
    };
  }, this);
}

export { alertDialog, closeDialog };
