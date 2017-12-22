import Form from '../form/index';
import {validationRulesForLogin as validationRules} from '../../utils/validationRules';
import loginTemplate from './login.pug';
import {throwIfNull} from '../../utils/utils';
import userService from '../../services/userService';
import {showError} from '../../utils/notifications';
import Navigator from '../../modules/navigator';
import router from '../../modules/router';

class LoginBlock extends Form {
  constructor(el: HTMLElement) {
    super(el, validationRules);
  }

  show(): void {
    throwIfNull(document.getElementById('signupBtn')).setAttribute('style', '');
    if (!Navigator.sections.login.ready) {
      this.el.innerHTML = loginTemplate();
      Navigator.sections.login.onSubmitOnce(this.onSubmitLoginForm.bind(this));

      Navigator.sections.login.ready = true;
    }

    throwIfNull(document.querySelector('#register'))
      .addEventListener('click', () => {
        Navigator.sections.hide();
        Navigator.sections.registration.show();
      });

    router.setPath('/login');
    super.show();
  }

  // Отправка формы логина.
  private onSubmitLoginForm(formdata: any): void {
    const loginBtn = throwIfNull(document.querySelector('.ui.submit.button'));
    loginBtn.classList.add('loading');
    userService.login(formdata.login, formdata.password)
      .then((data: any) => {
        switch (data.status) {
          case 'forbidden':
            showError('Wrong login or password');
            break;
          case 'bad request':
            showError('Already authorized as ' + (userService.user || {username: 'Guest'}).username);
            break;
          case undefined:
            Navigator.sections.login.reset();
            Navigator.sections.hide();
            Navigator.sections.playerPage.show();
            break;
          default:
            showError('Sorry, something went wrong...');
            break;
        }
        Navigator.sections.login.onSubmitOnce(this.onSubmitLoginForm.bind(this));
        loginBtn.classList.remove('loading');
      }).catch(() => {
      showError('Sorry, something went wrong...');
      Navigator.sections.login.onSubmitOnce(this.onSubmitLoginForm.bind(this));
      loginBtn.classList.remove('loading');
    });
  }
}

export default LoginBlock;
