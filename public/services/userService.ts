import Http from '../modules/http';
import User from '../models/user';
import router from "../modules/router";
import { showHome, showPlayerPage } from "../modules/navigator";
import { throwIfNull } from "../utils/htmlUtils";

class UserService {
  user : User | null;
  users : Array<User>;

  logout() : Promise<Response|null> {
    this.user = null;
    return Http.Fetch('POST', '/user/logout');
  }

  register(email : string, username : string, password : string) : Promise<User|null> {
    return Http.Fetch('POST', '/user/signup', { email, username, password })
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

  login(username : string, password : string) : Promise<User|null> {
    return Http.Fetch('POST', '/user/signin', { username, password })
      .then(data => throwIfNull(data).json())
      .then((user : User) => this.user = User.validate(user));
  }

  isLoggedIn() : boolean {
    return Boolean(this.user);
  }

  fetch() : Promise<User|null> {
    return Http.Fetch('GET', '/user')
      .then(data => throwIfNull(data).json())
      .then(data => {
        const path = window.location.pathname;
        if (data.result !== 'Unauthorized') {
          if (path === '/login' || path === '/signup' || path === '/profile' || path === '/') {
            showPlayerPage();
            router.setPath('/profile');
          }
          return this.user = data;
        } else if (path === '/login' || path === '/profile') {
          showHome();
          router.setPath('/login');
          return null;
        }
      }).catch(() => {
        const path = window.location.pathname;
        router.route(path);
        return null;
      });
  }
}

const userService = new UserService();
export default userService;
