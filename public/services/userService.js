(function userService() {
  const { Http } = window;

  class UserService {
    constructor() {
      this.user = null;
      this.users = [];
    }

    logout() {
      const result = Http.Fetch('POST', '/user/logout');
      if (result) {
        this.user = null;
      }
      return result;
    }

    // Регистрация пользователя
    register(email, username, password) {
      this.user = Http.Fetch('POST', '/user/signup', { email, username, password });
      if (this.user && !this.users.find(el => el.username === this.user.username)) {
        this.users.push(this.user);
      }
      return this.user;
    }

    // Авторизация пользователя
    login(username, password) {
      this.user = Http.Fetch('POST', '/user/signin', { username, password });
      return this.user;
    }

    // Залогинен ли пользователь
    isLoggedIn() {
      return !!this.user;
    }

    getData(force = false) {
      if (this.isLoggedIn() && !force) {
        return Promise.resolve(this.user);
      }

      return Http.Fetch('GET', '/user')
        .then((userdata) => {
          this.user = userdata;
          return userdata;
        });
    }
  }

  window.UserService = UserService;
}());
