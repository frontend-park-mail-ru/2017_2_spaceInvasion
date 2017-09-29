(function loginIndex() {
  const { Form } = window;
  const LoginTemplate = window.loginTemplate;
  const validationRules = window.validationRulesForLogin;

  class Login extends Form {
    constructor() {
      const el = document.createElement('div');
      el.innerHTML = LoginTemplate();
      super(el, validationRules);
    }
  }

  window.Login = Login;
}());
