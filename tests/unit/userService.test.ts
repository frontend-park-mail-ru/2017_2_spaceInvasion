import Http from '../../public/modules/httpModule';
import userService from '../../public/services/userService';
import User from '../../public/models/user';

const registredUsers = [];
let curUser = null;

function refresh() {
  registredUsers.length = 0;
  curUser = null;
}

function prepareFetchObject(object: User): User {
  if (!object || !object.username || !object.password) {
    return null;
  }

  object.score = 0;
  delete object.password;

  return object;
}

// Mock Http.Fetch
Http.Fetch = (method = 'GET', path, object = {}): Promise<Response> => {
  switch (`${method} ${path}`) {
    case 'POST /user/signup':
      object = prepareFetchObject(object);
      if (curUser) {
        return Promise.resolve(null);
      }
      registredUsers.push(object);
      curUser = object;
      return Promise.resolve(curUser);
    case 'GET /user':
      return Promise.resolve(curUser);
    case 'GET /leaderboard':
      return Promise.resolve(registredUsers.sort((a, b) => a.score - b.score) as any);
    case 'POST /user/logout':
      if (curUser) {
        curUser = null;
        return Promise.resolve(true as any);
      }
      return Promise.resolve(false as any);
    case 'POST /user/signin':
      object = prepareFetchObject(object);
      if (curUser) {
        return Promise.resolve(null);
      }
      curUser = curUser || registredUsers.find(el => el.username === object.username &&
        el.password === object.password);
      return Promise.resolve(curUser);
    default:
      return Promise.reject(Error(`Origin API method ${method} ${path} calling is not permitted!`));
  }
};

it('constructor', () => {
   expect(userService && !userService.user).toBeTruthy();
   expect(userService.users).toEqual([]);
});

it('register', () => {
  refresh();
  const actual = { username: 'username', email: 'email', score: 0 };
  let expected;
  userService.register('email', 'username', 'password').then(data => expected = data);
  expect(expected).toBe(actual);
  expect(userService.users).toEqual([actual]);
  expect(userService.user).toEqual(actual);
  // expect(userService.getData()).toBe(user);
  expect(userService.isLoggedIn()).toBeTruthy();
});

it('login', () => {
  refresh();
  expect(!userService.isLoggedIn()).toBeTruthy();
  expect(!userService.login('username', 'password')).toBeTruthy();
  expect(userService.register('email', 'username', 'password')).toEqual({
    username: 'username', email: 'email', score: 0,
  });
  expect(userService.isLoggedIn()).toBeTruthy();
    expect(true).toBeTruthy();
});

it('logout', () => {
  refresh();
  let user;
  userService.register('email', 'username', 'password').then(data => user = data).catch(data => user = data);
  expect(user).toEqual({
    username: 'username', email: 'email', score: 0,
  });

  expect(userService.isLoggedIn()).toBeTruthy();
  expect(userService.logout()).toBeTruthy();
  expect(!userService.isLoggedIn()).toBeTruthy();
  expect(!userService.logout()).toBeTruthy();
});