(function() {
    'use strict';

    // const Http = window.Http; if (window.location.host ===
    // 'space-invasion.herokuapp.com') { 	// enable CORS TO-DO edit backend url
    // 	Http.BaseUrl = 'https://super-frontend-backend.herokuapp.com'; }

    const Block = window.Block;
    const Login = window.Login;
    const About = window.About;
    const Scoreboard = window.Scoreboard
    const Registration = window.Registration;

    window.showHome = openLogin;
    window.showAbout = openAbout;
    window.showRegistration = openRegistration;
    window.showScoreboard = openScoreboard;

    const app = new Block(document.getElementById('application'));

    const sections = {

        login: Block.Create('section', {}, ['login-section']),
        signup: Block.Create('section', {}, ['signup-section']),
        about: Block.Create('section', {}, ['about-section']),
        scoreboard: Block.Create('section', {}, ['scoreboard-section']),

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
                .scoreboard
                .hide();
        }
    };

    sections.hide();

    app
        .append(sections.login)
        .append(sections.signup)
        .append(sections.about)
        .append(sections.scoreboard)

    function openLogin() {
        sections.hide();
        if (!sections.login.ready) {
            sections
                .login
                .append(new Login());
            sections.login.ready = true;
        }
        sections
            .login
            .show();
    }

    function openRegistration() {
        sections.hide();
        if (!sections.signup.ready) {
            sections
                .signup
                .append(new Registration());
            sections.signup.ready = true;
        }
        sections
            .signup
            .show();
    }

    function openScoreboard() {
        sections.hide();
        if (!sections.scoreboard.ready) {
            sections
                .scoreboard
                .append(new Scoreboard());
            sections.scoreboard.ready = true;
        }
        sections
            .scoreboard
            .show();
    }

    function openAbout() {
        sections.hide();
        if (!sections.about.ready) {
            sections
                .about
                .append(new About());
            sections.about.ready = true;
        }
        sections
            .about
            .show();
        window.alertDialog();
    }
    openLogin();
})();