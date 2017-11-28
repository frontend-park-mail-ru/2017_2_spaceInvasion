import Block from '../block/index';
import aboutTemplate from './about.pug';
import router from '../../modules/router';
import Navigator from '../../modules/navigator';
import {alertDialog, closeDialog, showDialog} from '../../utils/aboutAlertDialog';

class AboutBlock extends Block {
  constructor(el: HTMLElement) {
    super(el);
  }

  show(): void {
    if (!Navigator.sections.about.ready) {
      this.el.innerHTML = aboutTemplate();
      Navigator.sections.about.ready = true;
      alertDialog();
    }
    showDialog();
    router.setPath('/about');
    super.show();
  }

  hide(): void {
    closeDialog();
    super.hide();
  }
}

export default AboutBlock;
