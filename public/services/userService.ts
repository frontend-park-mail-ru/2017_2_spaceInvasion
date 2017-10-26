import Http from '../modules/httpModule';
import User from '../models/user';
import { showPlayerPage, showHome, showError, router } from '../main';

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

    if (!this.user) {
      this.user = new User();
    }
    if (result) {
      this.user.fromPromise(result);
    }
    if (this.user.username && !this.users.find(el => el.username === this.user.username)) {
      this.users.push(this.user);
    }

    return result;
  }

  // Авторизация пользователя
  login(username, password) {
    const result = Http.Fetch('POST', '/user/signin', { username, password })
      .then(data => data.json());

    if (!this.user) {
      this.user = new User();
    }
    if (result) {
      this.user.fromPromise(result);
    }

    return result;
  }

  // Залогинен ли пользователь
  isLoggedIn() {
    return Boolean(this.user);
  }

  getData() {
    Http.Fetch('GET', '/user').then(userdata => userdata.json())
      .then((userdata) => {
        const path = window.location.pathname;
        if (userdata.result !== 'Unauthorized') {
          this.user = userdata;
          if (path === '/login' || path === '/profile' || path === '/') {
            showPlayerPage();
            router.setPath('/profile');
          }
        } else if (path === '/login' || path === '/profile') {
          showHome();
          router.setPath('/');
        }
      }).catch(() => {
        router.setPath('/');
        showError('Oops, try again!');
      });
  }
}

const userService = new UserService();

export default userService;
