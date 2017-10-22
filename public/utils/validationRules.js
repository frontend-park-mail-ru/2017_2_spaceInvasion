// Критерии проверки валидности.
const rulesRegForEmail = [
  {
    predicate: email => /^[\w-]+@[\w-]+\.[A-Za-z]{2,4}$/.test(email),
    message: 'Wrong format of email',
  },
  {
    predicate: email => email !== '',
    message: 'Email can not be blank',
  },
];

const rulesRegForLogin = [
  {
    predicate: login => /^[\w\-@]{5,}$/.test(login),
    message: 'Minimum login length is 5',
  },
  {
    predicate: login => /^[\w\-@]+$/.test(login),
    message: 'Login must contain only latin symbols,digits,_,-,@',
  },
];

const rulesRegForPassword = [
  {
    predicate: password => /^[\w\s\-.]{8,}$/.test(password),
    message: 'Minimum password length is 8',
  },
  {
    predicate: password => /^[\w\s\-.]+$/.test(password),
    message: 'Passwords must contain only latin symbols,digits,_,-,.',
  },
];

const rulesLogForLogin = [
  {
    predicate: login => login !== '',
    message: 'Login can not be blank',
  },
];

const rulesLogForPassword = [
  {
    predicate: password => password !== '',
    message: 'Password can not be blank',
  },
];

const validationRulesForLogin = {
  rulesForLogin: rulesLogForLogin,
  rulesForPassword: rulesLogForPassword,
};

const validationRulesForRegistration = {
  rulesForEmail: rulesRegForEmail,
  rulesForLogin: rulesRegForLogin,
  rulesForPassword: rulesRegForPassword,
};

export { validationRulesForLogin, validationRulesForRegistration };
