import Http from '../modules/httpModule';
import User from '../models/user';

import { showPlayerPage, showHome, showError } from '../main';

class UserService {
  user : User;
  users : Array<User>;

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
    const result = Http.Fetch('POST', '/user/signup', { email, username, password })
      .then(data => data.json());

    this.user.fromPromise(result);
    if (this.user.username && !this.users.find(el => el.username === this.user.username)) {
      this.users.push(this.user);
    }

    return result;
  }

  // Авторизация пользователя
  login(username, password) {
    const result = Http.Fetch('POST', '/user/signin', { username, password })
      .then(data => data.json());

    this.user.fromPromise(result);

    return result;
  }

  // Залогинен ли пользователь
  isLoggedIn() {
    return Boolean(this.user);
  }

  getData() {
    Http.Fetch('GET', '/user').then(userdata => userdata.json())
      .then((userdata) => {
        if (userdata.result !== 'Unauthorized') {
          this.user = userdata;
          showPlayerPage();
        } else {
          showHome();
        }
      }).catch(() => {
        showError('Oops, try again!');
      });
  }
}

const userService = new UserService();

export default userService;
