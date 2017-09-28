const menuItems = document.querySelectorAll('.item');

function setSelection(el) {
  document.getElementById(el).setAttribute('class', 'active item');
}

function clearSelection() {
  const tabs = ['homeBtn', 'aboutBtn', 'signUpBtn', 'scoreboardBtn'];
  tabs.forEach((el) => {
    document.getElementById(el).setAttribute('class', 'item');
  }, this);
}

function navigate() {
  if (!this.id) {
    return;
  }
  clearSelection();
  setSelection(this.id);
  switch (this.id) {
    case 'homeBtn':
      window.showHome();
      break;
    case 'aboutBtn':
      window.showAbout();
      break;
    case 'signUpBtn':
      clearSelection();
      window.showRegistration();
      break;
    case 'scoreboardBtn':
      window.showScoreboard();
      break;
    default:
      break;
  }
}

menuItems.forEach((el) => {
  el.addEventListener('click', navigate.bind(el));
});
