import User from '../../public/models/user';

describe('User test', () => {
  const user = new User;
  it('constructor', () => {
    expect(user).toEqual({})
  });

  it('from promise', () => {
    const expected: User = {username: 'username', email: 'email', password: 'password', score: 0} as User;
    expect(user).toEqual(expected);
  });
});