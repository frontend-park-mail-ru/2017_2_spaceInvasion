import Form from '../form/index';
import {validationRulesForRegistration as validationRules} from '../../utils/validationRules';
import registrationTemplate from './registration.pug';
import {showError} from '../../utils/notifications';
import {throwIfNull} from '../../utils/utils';
import userService from '../../services/userService';
import Navigator from '../../modules/navigator';
import router from '../../modules/router';

class RegistrationBlock extends Form {
  constructor(el: HTMLElement) {
    super(el, validationRules);
  }

  show(): void {
    this.el.innerHTML = registrationTemplate();
    if (!Navigator.sections.registration.ready) {
      Navigator.sections.registration.onSubmitOnce(this.onSubmitRegistrationForm.bind(this));
      Navigator.sections.registration.ready = true;
    }

    throwIfNull(document.querySelector('#loginLink'))
      .addEventListener('click', () => {
        Navigator.sections.hide();
        Navigator.sections.login.show();
      });

    router.setPath('/signup');
    super.show();
  }

  // Отправка формы регистрации.
  private onSubmitRegistrationForm(formdata: any): void {
    const regBtn = throwIfNull(document.querySelector('.validateBtn'));
    regBtn.classList.add('loading');
    userService.register(formdata.email, formdata.login, formdata.password)
      .then((data: any) => {
        switch (data.status) {
          case 'conflict':
            showError('Username already used');
            break;
          case 'forbidden':
            showError('Wrong user data');
            break;
          case 'bad request':
            showError('Already authorized as ' + (userService.user || {username: 'Guest'}).username);
            break;
          case undefined:
            Navigator.sections.registration.reset();
            Navigator.sections.hide();
            Navigator.sections.playerPage.show();
            break;
          default:
            showError('Internal Error');
            break;
        }
        Navigator.sections.registration.onSubmitOnce(this.onSubmitRegistrationForm.bind(this));
        regBtn.classList.remove('loading');
      }).catch(() => {
      Navigator.sections.registration.onSubmitOnce(this.onSubmitRegistrationForm.bind(this));
      regBtn.classList.remove('loading')
    });
  }
}

export default RegistrationBlock;
