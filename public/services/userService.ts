import Http from '../modules/http';
import User from '../models/user';
import {throwIfNull} from '../utils/utils';
import Navigator from '../modules/navigator';
import {Router} from '../modules/router';

class UserService {
  private static instance = new UserService();
  user: User | null;
  users: Array<User>;

  constructor() {
    if (UserService.instance) {
      return UserService.instance
    }
    UserService.instance = this;
  }

  logout(): Promise<Response | null> {
    this.user = null;
    return Http.Fetch('POST', '/user/logout');
  }

  register(email: string, username: string, password: string): Promise<User | null> {
    return Http.Fetch('POST', '/user/signup', {email, username, password})
      .then(data => throwIfNull(data).json())
      .then((user: User) => {
        this.user = user;
        if (this.user.username && !this.users.find((el: User) => {
            return this.user !== null && el.username === this.user.username;
          })) {
          this.users.push(this.user);
        }
        return this.user;
      });
  }

  login(username: string, password: string): Promise<User | null> {
    return Http.Fetch('POST', '/user/signin', {username, password})
      .then(data => throwIfNull(data).json())
      .then((user: User) => this.user = User.validate(user));
  }

  isLoggedIn(): boolean {
    return Boolean(this.user);
  }

  fetch(): Promise<User | null> {
    this.user = new User('Admin', 'spaceinvasionlab@yandex.ru', ''); // NOTE: Testing!!!!!! Remove it!
    return Http.Fetch('GET', '/user')
      .then(data => throwIfNull(data).json())
      .then(data => {
        Router.route();
        if (data.result !== 'Unauthorized') {
          return this.user = data;
        } else {
          return null;
        }
      }).catch(() => {
        Navigator.sections.hide();
        Router.route();
        return null;
      });
  }
}

const userService = new UserService();
export {UserService};
export default userService;
