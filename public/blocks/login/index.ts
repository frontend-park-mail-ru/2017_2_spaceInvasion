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
          case 400:
            if (data.result && data.result === 'Bad request') {
              showError(data.description);
            } else {
              showError('Already authorized as ' + data.username || 'Guest')
            }
            break;
          case 200:
            Navigator.sections.login.reset();
            Navigator.sections.registration.hide();
            Navigator.sections.playerPage.show();
            break;
          default:
            showError('Internal Error');
            break;
        }
        Navigator.sections.login.onSubmitOnce(this.onSubmitLoginForm.bind(this));
        loginBtn.classList.remove('loading');
      }).catch(() => {
      Navigator.sections.login.onSubmitOnce(this.onSubmitLoginForm.bind(this));
      loginBtn.classList.remove('loading');
    });
  }
}

export default LoginBlock;