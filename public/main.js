(function () {
	'use strict';
    const UserService = window.UserService;
    const userService = new UserService();

	// const Http = window.Http;

	// if (window.location.host === 'space-invasion.herokuapp.com') {
	// 	// enable CORS TO-DO edit backend url
	// 	Http.BaseUrl = 'https://super-frontend-backend.herokuapp.com';
	// }

    const Block = window.Block;
	const Login = window.Login;
	const About = window.About;
	const Registration = window.Registration;
	
	window.showHome = openLogin;
	window.showAbout = openAbout;
	window.showRegistration = openRegistration;

	const app = new Block(document.getElementById('application'));

	const sections = {

		login: Block.Create('section', {}, ['login-section']),
        signup: Block.Create('section', {}, ['signup-section']),
        about: Block.Create('section', {}, ['about-section']),

		hide() {
			this.login.hide();
			this.signup.hide();
			this.about.hide();
		},
	};

	sections.hide();

	app
		.append(sections.login)
        .append(sections.signup)
        .append(sections.about);

    // Отправка формы логина.
    function onSubmitLoginForm(formdata) {
         return userService.login(formdata.login, formdata.password)
             .then(function () { return userService.getData(true); })
             .then(function () { sections.login.loginform.reset();
                 //openGamePage();
             })
             .catch((err) => alert(`Some error ${err.status}: ${err.responseText}`)); // текст ошибки не работает
    }

    function openLogin() {
    	console.log("openLogin");
		sections.hide();						
            if (!sections.login.ready) {
                sections.login.loginform = new Login();
				sections.login.append(sections.login.loginform);
                sections.login.loginform.onSubmit(onSubmitLoginForm);
				sections.login.ready = true;
			}
			sections.login.show();
		}

		function openRegistration() {
			sections.hide();							
            if (!sections.signup.ready) {
                sections.signup.append(new Registration());
				sections.signup.ready = true;
			}
			sections.signup.show();			
		}
		
		function openAbout() {
			sections.hide();
            if (!sections.about.ready) {
                sections.about.append(new About());				
				sections.about.ready = true;
			}
			sections.about.show();
			window.alertDialog();		
        }
	openLogin();
})();