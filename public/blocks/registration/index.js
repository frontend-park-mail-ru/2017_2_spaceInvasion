(function() {
    'use strict';

	const Form = window.Form;
	const RegistrationTemplate = window.registrationTemplate;

	class Registration extends Form {
        constructor() {
            const el = document.createElement("div");
            el.innerHTML = RegistrationTemplate();
            super(el);
        }
    }
    window.Registration = Registration;

})();