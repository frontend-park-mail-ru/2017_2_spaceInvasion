import userService from './services/userService';
import Block from './blocks/block/index';
import router from './modules/router';
import {throwIfNull} from './utils/utils';
import {initThemes} from './modules/themes';
import Navigator from './modules/navigator';
import {registerServiceWorker} from './services/ServiceWorker';

const app = new Block(throwIfNull(document.getElementById('application')));

new Navigator();

Navigator.sections.hide();
app
  .append(Navigator.sections.login)
  .append(Navigator.sections.registration)
  .append(Navigator.sections.about)
  .append(Navigator.sections.leaderboard)
  .append(Navigator.sections.playerPage)
  .append(Navigator.sections.game);

initThemes();
// registerServiceWorker();
router.start();
userService.fetch();
