(function () {
    'use strict';

    const Http = window.Http;

    class UserService {
        constructor() {
            this.user = null;
            this.users = [];
        }

        // Регистрация пользователя
        register(email, login, password) {
          return Http.FetchPost('/user/signup', {email, login, password});
        }

        // Авторизация пользователя
        login(login, password) {
            return Http.FetchPost('/user/signin', {login, password});
        }

        // Залогинен ли пользователь
        isLoggedIn() {
            return !!this.user;
        }

        getData(callback, force = false) {
            if (this.isLoggedIn() && !force) {
                return Promise.resolve(this.user);
            }

            return Http.FetchGet('/me')
                .then(function (userdata) {
                    this.user = userdata;
                    return userdata;
                }.bind(this));
        }

        loadUsersList(callback) {
            console.log("loadUsersList");
            return Http.FetchGet('/users')
                .then(function (users) {
                    this.users = users;

                    if (this.isLoggedIn()) {
                        this.users = this.users.map(function (user) {
                            user.me = user.login === this.user.login;
                            return user;
                        }.bind(this));
                    }
                    console.log(users[0]);

                    return this.users;
                }.bind(this));
        }
    }

    window.UserService = UserService;

})();