import Form from '../form/index';
import { validationRulesForRegistration as validationRules } from '../../utils/validationRules';
import registrationTemplate from './registration.pug';

class Registration extends Form {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = registrationTemplate();
    super(el, validationRules);
  }
}

export default Registration;
