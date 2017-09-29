(function registrationIndex() {
  const { Form } = window;
  const RegistrationTemplate = window.registrationTemplate;
  const validationRules = window.validationRulesForRegistration;

  class Registration extends Form {
    constructor() {
      const el = document.createElement('div');
      el.innerHTML = RegistrationTemplate();
      super(el, validationRules);
    }
  }

  window.Registration = Registration;
}());
