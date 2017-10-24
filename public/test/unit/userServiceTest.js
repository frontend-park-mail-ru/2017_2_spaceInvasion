QUnit.module('userServiceTest');

const { Http, UserService } = window;
const registredUsers = [];
let curUser = null;

function refresh() {
  registredUsers.length = 0;
  curUser = null;
}

function prepareFetchObject(object) {
  if (!object || !object.username || !object.password) {
    return null;
  }

  object.score = 0;
  delete object.password;

  return object;
}

// Mock Http.Fetch and Promise.resolve
Promise.resolve = data => data;
Http.Fetch = (method = 'GET', path, object = {}) => {
  switch (`${method} ${path}`) {
    case 'POST /user/signup':
      object = prepareFetchObject(object);
      if (curUser) {
        return null;
      }
      registredUsers.push(object);
      curUser = object;
      return curUser;
    case 'GET /user':
      return curUser;
    case 'GET /leaderboard':
      return registredUsers.sort((a, b) => a.score - b.score);
    case 'POST /user/logout':
      if (curUser) {
        curUser = null;
        return true;
      }
      return false;
    case 'POST /user/signin':
      object = prepareFetchObject(object);
      if (curUser) {
        return null;
      }
      curUser = curUser || registredUsers.find(el => el.username === object.username &&
        el.password === object.password);
      return curUser;
    default:
      throw Error(`Origin API method ${method} ${path} calling is not permitted!`);
  }
};

QUnit.test('constructor', (assert) => {
  const userService = new UserService();
  assert.expect(2);

  assert.ok(userService && !userService.user);
  assert.deepEqual(userService.users, []);
});

QUnit.test('register', (assert) => {
  refresh();
  const userService = new UserService();
  assert.expect(5);

  const user = { username: 'username', email: 'email', score: 0 };
  assert.deepEqual(userService.register('email', 'username', 'password'), user);
  assert.deepEqual(userService.users, [user]);
  assert.deepEqual(userService.user, user);
  assert.deepEqual(userService.getData(), user);
  assert.ok(userService.isLoggedIn());
});

QUnit.test('login', (assert) => {
  refresh();
  const userService = new UserService();
  assert.expect(4);

  assert.ok(!userService.isLoggedIn());
  assert.ok(!userService.login('username', 'password'));
  assert.deepEqual(userService.register('email', 'username', 'password'), {
    username: 'username', email: 'email', score: 0,
  });
  assert.ok(userService.isLoggedIn());
});

QUnit.test('logout', (assert) => {
  refresh();
  const userService = new UserService();
  assert.expect(5);

  assert.deepEqual(userService.register('email', 'username', 'password'), {
    username: 'username', email: 'email', score: 0,
  });

  assert.ok(userService.isLoggedIn());
  assert.ok(userService.logout());
  assert.ok(!userService.isLoggedIn());
  assert.ok(!userService.logout());
});
