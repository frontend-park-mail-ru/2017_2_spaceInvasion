import Form from '../form/index';
import { validationRulesForRegistration as validationRules } from '../../utils/validationRules';

class Registration extends Form {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = window.registrationTemplate();
    super(el, validationRules);
  }
}

export default Registration;
