const menuItems = document.querySelectorAll('.item');
window.currentTab = 'home';

function setSelection(el) {
  document.getElementById(el).setAttribute('class', 'active item');
}

function clearSelection() {
  const tabs = ['homeBtn', 'aboutBtn', 'signUpBtn', 'leaderboardBtn'];
  tabs.forEach((el) => {
    document.getElementById(el).setAttribute('class', 'item');
  }, this);
}

function navigate() {
  if (!this.id) {
    return;
  }
  clearSelection();
  if (window.currentTab === 'about' && typeof window.devDialog !== 'undefined') {
    window.closeDialog();
  }
  setSelection(this.id);
  switch (this.id) {
    case 'homeBtn':
      window.currentTab = 'home';
      window.showHome();
      break;
    case 'aboutBtn':
      window.currentTab = 'about';
      window.showAbout();
      break;
    case 'signUpBtn':
      window.currentTab = 'signUp';
      clearSelection();
      window.showRegistration();
      break;
    case 'leaderboardBtn':
      window.currentTab = 'leaderboard';
      window.showLeaderboard();
      break;
    default:
      break;
  }
}

for (let i = 0; i < menuItems.length; i += 1) {
  menuItems[i].addEventListener('click', navigate.bind(menuItems[i]));
}
