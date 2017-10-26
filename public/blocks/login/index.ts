import Form from '../form/index';
import { validationRulesForLogin as validationRules } from '../../utils/validationRules';
import loginTemplate from './login.pug';

export default class Login extends Form {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = loginTemplate();
    super(el, validationRules);
  }
}