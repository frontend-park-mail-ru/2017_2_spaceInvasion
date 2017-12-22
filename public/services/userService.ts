import Http from '../modules/http';
import User from '../models/user';
import {throwIfNull} from '../utils/utils';
import Navigator from '../modules/navigator';
import router from '../modules/router';

class UserService {
  private static instance = new UserService();
  user: User | null = null;
  users: Array<User> = [];

  constructor() {
    if (UserService.instance) {
      return UserService.instance
    }
    UserService.instance = this;
  }

  static getUser(id: number): Promise<User> {
    return Http.Fetch('GET', '/user/' + id)
      .then(data => throwIfNull(data).json())
      .then(data => {
        if (data.status === 'not found') {
          throw Error('User not found: ' + id);
        }
        return data;
      });
  }

  logout(): Promise<Response | null> {
    this.user = null;
    return Http.Fetch('POST', '/user/logout');
  }

  register(email: string, username: string, password: string): Promise<any> {
    return Http.Fetch('POST', '/user/signup', {email, username, password})
      .then(data => throwIfNull(data).json())
      .then(data => {
        if (data.status === undefined) {
          this.user = data;
          if (this.user && this.user.username && !this.users.find((el: User) => {
              return this.user !== null && el.username === this.user.username;
            })) {
            this.users.push(this.user);
          }
        }
        return data;
      });
  }

  login(username: string, password: string): Promise<User | null> {
    return Http.Fetch('POST', '/user/signin', {username, password})
      .then(data => throwIfNull(data).json())
      .then(user => {
        if (user.status === undefined) {
          this.user = user
        }
        return user;
      });
  }

  isLoggedIn(): boolean {
    return Boolean(this.user);
  }

  fetch(): void {
    Http.Fetch('GET', '/user')
      .then(data => throwIfNull(data).json())
      .then(data => {
        if (data.status !== 'bad request') {
          this.user = data;
        }
        Navigator.sections.hide();
        router.route();
      }).catch(() => {
      Navigator.sections.hide();
      router.route();
    });
  }
}

const userService = new UserService();
export {UserService};
export default userService;
