import Http from '../modules/httpModule';
import { showPlayerPage, showHome } from '../main';

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

  getData() {
    Http.Fetch('GET', '/user').then(userdata => userdata.json())
      .then((userdata) => {
        if (userdata.result !== 'Unauthorized') {
          this.user = userdata;
          showPlayerPage();
        } else {
          showHome();
        }
      });
  }
}

export default UserService;
