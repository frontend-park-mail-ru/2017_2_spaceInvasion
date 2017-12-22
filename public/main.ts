import userService from './services/userService';
import Block from './blocks/block/index';
import router from './modules/router';
import {throwIfNull} from './utils/utils';
import {initThemes} from './modules/themes';
import Navigator from './modules/navigator';
import navbarTemplate from './templates/navbar.pug';
import initLocalization from './utils/localisation';

const navbar = document.createElement('div');
navbar.innerHTML = navbarTemplate();
document.body.insertBefore(navbar, document.body.firstChild);

const app = new Block(throwIfNull(document.getElementById('application')));

new Navigator();

Navigator.sections.hide();
app
  .append(Navigator.sections.home)
  .append(Navigator.sections.login)
  .append(Navigator.sections.registration)
  .append(Navigator.sections.about)
  .append(Navigator.sections.leaderboard)
  .append(Navigator.sections.playerPage)
  .append(Navigator.sections.notFound)
  .append(Navigator.sections.game)
  .append(Navigator.sections.winlose);

initThemes();
// registerServiceWorker();
router.start();
initLocalization();
userService.fetch();
