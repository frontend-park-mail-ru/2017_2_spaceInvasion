import userService from './services/userService';
import Block from './blocks/block/index';
import router from './modules/router';
import { throwIfNull } from "./utils/htmlUtils";
import { sections, initNavigator } from "./modules/navigator";
import { initThemes } from './modules/themes';

const app = new Block(throwIfNull(document.getElementById('application')));

sections.hide();
app
  .append(sections.login)
  .append(sections.signup)
  .append(sections.about)
  .append(sections.leaderboard)
  .append(sections.playerpage)
  .append(sections.game);

initThemes();
initNavigator();
router.start();
userService.fetch();

export default app;
