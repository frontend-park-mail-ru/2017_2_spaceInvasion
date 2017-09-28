(function () {
	'use strict';

	const LoginTemplate = window.loginTemplate;
	const Form = window.Form;

	class Login extends Form {
		constructor() {
			const el = document.createElement("div");
			el.innerHTML = LoginTemplate();
			super(el);
		}
	}
	window.Login = Login;

})();