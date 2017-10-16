import Form from '../form/index';
import { validationRulesForLogin as validationRules } from '../../utils/validationRules';

class Login extends Form {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = window.loginTemplate();
    super(el, validationRules);
  }
}

export default Login;
