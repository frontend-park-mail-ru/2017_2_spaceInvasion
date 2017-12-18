import notFoundTemplate from './404.pug';
import Form from '../form/index';
import Navigator from '../../modules/navigator';

class NotFoundBlock extends Form {
  show(): void {
    if (!Navigator.sections.notFound.ready) {
      this.el.innerHTML = notFoundTemplate();
      Navigator.sections.notFound.ready = true;
    }
    super.show();
  }
}

export default NotFoundBlock;