(function registrationIndex() {
  const { Block } = window;
  const RegistrationTemplate = window.registrationTemplate;

  class Registration extends Block {
    constructor() {
      const el = document.createElement('div');
      el.innerHTML = RegistrationTemplate();
      super(el);
    }
  }

  window.Registration = Registration;
}());
