(function() {
    'use strict';

<<<<<<< HEAD
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
=======
    const Block = window.Block;
    const LoginTemplate = window.loginTemplate;

    class Login extends Block {
        constructor() {
            const el = document.createElement("div");
            el.innerHTML = LoginTemplate();
            super(el);
        }
    }

    window.Login = Login;
>>>>>>> 5e6dd594152c8a83b8ecc5459d8ed8119ecbc1c9

})();