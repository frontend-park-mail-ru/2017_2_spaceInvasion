import * as fs from 'fs';

document.body.innerHTML = fs.readFileSync('./public/index.htm').toString();

import userService from '../../public/services/userService';
import User from '../../public/models/user';
import Http from '../../public/modules/http';
import {isUndefined} from 'util';

let curUser: User | null = null;
const registredUsers: User[] = [];

function prepareFetchbody(body: User): User | null {
  if (!body || !body.username || !body.password) {
    return null;
  }

  body.score = 0;
  delete body.password;

  return body;
}

function refresh(): void {
  registredUsers.length = 0;
  curUser = null;
}

// Mock Http.Fetch
Http.Fetch = function Fetch(method: string, path: string, body: any = undefined): any {
  switch (`${method} ${path}`) {
    case 'POST /user/signup':
      body = prepareFetchbody(body);
      if (curUser) {
        return Promise.resolve(null);
      }
      registredUsers.push(body);
      curUser = body;
      return Promise.resolve(curUser);
    case 'GET /user':
      return Promise.resolve(curUser);
    case 'GET /leaderboard':
      return Promise.resolve(
        registredUsers.sort((a, b) => {
          if (isUndefined(a.score) || isUndefined(b.score)) {
            throw Error('score is undefined');
          }
          return a.score - b.score;
        })
      );
    case 'POST /user/logout':
      if (curUser) {
        curUser = null;
        return Promise.resolve(true as any);
      }
      return Promise.resolve(false as any);
    case 'POST /user/signin':
      body = prepareFetchbody(body);
      if (curUser) {
        return Promise.resolve(null);
      }
      curUser = curUser || registredUsers.find(el => el.username === body.username &&
        el.password === body.password) || null;
      return Promise.resolve(curUser);
    default:
      return Promise.reject(Error(`Origin API method ${method} ${path} calling is not permitted!`));
  }
};

describe('UserService test', () => {
  it('constructor', () => {
    expect(userService && !userService.user).toBeTruthy();
    expect(userService.users).toEqual([]);
  });

  it('register', () => {
    refresh();
    const actual = {username: 'username', email: 'email', score: 0};
    userService.register('email', 'username', 'password').then(data => {
      expect(data).toEqual(actual);
      expect(userService.users).toEqual([actual]);
      expect(userService.user).toEqual(actual);
      expect(userService.isLoggedIn()).toBeTruthy();
    });
    // expect(userService.fetch()).toEqual(user);
  });

  it('login', () => {
    refresh();
    expect(!userService.isLoggedIn()).toBeTruthy();
    userService.login('username', 'password').then(data => {
      expect(data).toBeNull();
      userService.register('email', 'username', 'password').then(data => {
        expect(data).toEqual({
          username: 'username', email: 'email', score: 0,
        });
        expect(userService.isLoggedIn()).toBeTruthy();
      });
    });
  });

  it('logout', () => {
    refresh();
    let user: User | null = null;
    userService.register('email', 'username', 'password')
      .then(data => {
        expect(user).toEqual({
          username: 'username', email: 'email', score: 0,
        });
        expect(userService.isLoggedIn()).toBeTruthy();
        expect(userService.logout()).toBeTruthy();
        expect(!userService.isLoggedIn()).toBeTruthy();
        expect(!userService.logout()).toBeTruthy();
      });
  });
});
