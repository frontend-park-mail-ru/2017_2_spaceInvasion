import User from '../../public/models/user';

describe('User test', () => {
  let user = new User(0, 'username', 'email', 'password');
  it('constructor', () => {
    expect(user).toEqual({
      id: 0,
      username: 'username',
      email: 'email',
      password: 'password',
      score: 0
    })
  });

  it('access to fields', () => {
    expect(user.username).toBe('username');
    expect(user.email).toBe('email');
    expect(user.password).toBe('password');
    expect(user.score).toBe(0);

    user.username = 'otherUsername';
    expect(user.username).toBe('otherUsername');
    user.email = 'otherEmail';
    expect(user.email).toBe('otherEmail');
    user.password = 'otherPassword';
    expect(user.password).toBe('otherPassword');
    user.score = 10;
    expect(user.score).toBe(10);
  });

  describe('validation', () => {
    it('validate correct user objects', () => {
      expect(() => {
        // Обычная проверка
        const user1 = new User(0, 'username', 'login@mail.com', 'usual_123_password');
        expect(User.validate(user1)).toEqual(user1);

        // Проверка русского эмейла и случайного пароля
        const user2 = new User(0, 'usual_login',
          'русский-логин@юникод-рулит.домен-нного-уровня.поддомен.рф',
          'Jl3hlc;KE@KLVNLWEI vw 2v m');

        // Допустимые обычные символы
        expect(User.validate(user2)).toEqual(user2);
        const user3 = new User(0, 'long_username-with@enabled12345symbols67890',
          'login@mail.usa.museum',
          'password_with all 01234 .enabled 56789 symbols');
        expect(User.validate(user3)).toEqual(user3);

        // Поддержка юникод
        const unicode_user = new User(0, 'latin_login',
          '☺☺☺☺☺@mail.ru',
          '㮨㑠 㑡 㑢 㑣㑤㑥㑦 㑧㑨 㑩㑪 㑫㑬 㑭㑮');
        expect(User.validate(unicode_user)).toEqual(unicode_user);
      }).not.toThrow();
    });

    it('validate broken user objects', () => {
      const errorRegExp = /Broken User object: /;
      const user = new User(0, 'login', 'login@mail.ru', 'password');

      // Проверка начальных данных
      expect(() => User.validate(user)).not.toThrow();

      // Пустые поля
      expect(() => {
        const user_copy = user;
        user_copy.username = '';
        User.validate(user_copy);
      }).toThrow(errorRegExp);
      expect(() => {
        const user_copy = user;
        user_copy.email = '';
        User.validate(user_copy);
      }).toThrow(errorRegExp);
      expect(() => {
        const user_copy = user;
        user_copy.password = '';
        User.validate(user_copy);
      }).toThrow(errorRegExp);

      // Короткие поля
      expect(() => {
        const user_copy = user;
        user_copy.username = 'ya';
        User.validate(user_copy);
      }).toThrow(errorRegExp);
      expect(() => {
        const user_copy = user;
        user_copy.password = 'pass';
        User.validate(user_copy);
      }).toThrow(errorRegExp);

      // Неправильный логин
      expect(() => {
        const user_copy = user;
        user_copy.username = 'bla bla bla';
        User.validate(user_copy);
      }).toThrow(errorRegExp);
      expect(() => {
        const user_copy = user;
        user_copy.username = 'юникод';
        User.validate(user_copy);
      }).toThrow(errorRegExp);
      expect(() => {
        const user_copy = user;
        user_copy.username = '!#$@##(%#@+$@';
        User.validate(user_copy);
      }).toThrow(errorRegExp);

      // Неправильный e-mail
      expect(() => {
        const user_copy = user;
        user_copy.email = '@mail.ru';
        User.validate(user_copy);
      }).toThrow(errorRegExp);
      expect(() => {
        const user_copy = user;
        user_copy.email = 'login@.ru';
        User.validate(user_copy);
      }).toThrow(errorRegExp);
      expect(() => {
        const user_copy = user;
        user_copy.email = 'login@mailru';
        User.validate(user_copy);
      }).toThrow(errorRegExp);
    })
  });
});