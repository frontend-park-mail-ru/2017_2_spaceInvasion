(function main() {
    const {
        UserService,
        Block,
        Login,
        About,
        Leaderboard,
        Registration,
        PlayerPage
    } = window;
    window.userService = new UserService();
    const app = new Block(document.getElementById('application'));
    const signUpBtn = document.querySelector('.item#signUpBtn');

    const sections = {

        login: Block.Create('section', {}, ['login-section']),
        signup: Block.Create('section', {}, ['signup-section']),
        about: Block.Create('section', {}, ['about-section']),
        leaderboard: Block.Create('section', {}, ['leaderboard-section']),
        playerpage: Block.Create('section', {}, ['playerpage-section']),

        hide() {
            this
                .login
                .hide();
            this
                .signup
                .hide();
            this
                .about
                .hide();
            this
                .leaderboard
                .hide();
            this
                .playerpage
                .hide();
        },
    };

    sections.hide();

    app
        .append(sections.login)
        .append(sections.signup)
        .append(sections.about)
        .append(sections.leaderboard)
        .append(sections.playerpage);


    function hideSignUp() {
        signUpBtn.setAttribute("style", "display:none");
    }

    // Отправка формы логина.
    function onSubmitLoginForm(formdata) {
        const loginBtn = document.querySelector(".ui.submit.button");
        loginBtn.classList.add("loading");
        userService.login(formdata.login, formdata.password).then(data => data.json())
            .then((data) => {
                userService.user = data;
                loginBtn.classList.remove("loading");
                sections.login.loginform.reset();
                hideSignUp();
                openPlayerPage();
            });
    }


    // Отправка формы регистрации.
    function onSubmitRegistrationForm(formdata) {
        const regBtn = document.querySelector(".validateBtn");
        regBtn.classList.add("loading");
        return userService.register(formdata.email, formdata.login, formdata.password).then(data => data.json())
            .then((data) => {
                debugger
                userService.user = data;
                regBtn.classList.remove("loading");
                sections.signup.signupform.reset();
                hideSignUp();
                openPlayerPage();
            })
    }

    function openLogin() {
        if (!userService.isLoggedIn()) {
            signUpBtn.setAttribute("style", "");
            sections.hide();
            if (!sections.login.ready) {
                sections.login.loginform = new Login();
                sections.login.append(sections.login.loginform);
                sections.login.loginform.onSubmit(onSubmitLoginForm);
                sections.login.ready = true;
            }
            sections.login.loginform.reset();
            sections.login.show();
        } else {
            if (sections.playerpage.isHidden()) openPlayerPage();
        }
    }

    function openRegistration() {
        sections.hide();
        if (!sections.signup.ready) {
            sections.signup.signupform = new Registration();
            sections.signup.append(sections.signup.signupform);
            sections.signup.signupform.onSubmit(onSubmitRegistrationForm);
            sections.signup.ready = true;
        }
        sections.signup.signupform.reset();
        sections.signup.show();
    }

    function openLeaderboard() {
        sections.hide();
        if (!sections.leaderboard.ready) {
            sections
                .leaderboard
                .append(new Leaderboard());
            sections.leaderboard.ready = true;
        }
        sections
            .leaderboard
            .show();
    }

    function openAbout() {
        sections.hide();
        if (!sections.about.ready) {
            sections.about.append(new About());
            sections.about.ready = true;
        }
        sections.about.show();
    }

    function openPlayerPage() {
        signUpBtn.setAttribute("style", "display:none");
        sections.hide();
        if (!sections.playerpage.ready) {
            sections.playerpage.append(new PlayerPage());
            sections.playerpage.ready = true;
        }
        sections.playerpage.show();
    }

    window.showHome = openLogin;
    window.showAbout = openAbout;
    window.showRegistration = openRegistration;
    window.showLeaderboard = openLeaderboard;
    window.showPlayerPage = openPlayerPage;

    userService.getData();

}());