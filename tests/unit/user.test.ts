import User from '../../public/models/user';

describe('User test', () => {
  const user = new User;
  it('constructor', () => {
    expect(user).toEqual({})
  });
});