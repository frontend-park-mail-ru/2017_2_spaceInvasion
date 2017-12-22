// Критерии проверки валидности.
interface Rule {
  predicate: (field: string) => boolean;
  message: string;
}

const rulesRegForEmail: Rule[] = [
  {
    predicate: email => /^\S+@\S+(\.\S+)+$/.test(email),
    message: 'Wrong format of email',
  },
  {
    predicate: email => email !== '',
    message: 'Email can not be blank',
  },
];

const rulesRegForLogin: Rule[] = [
  {
    predicate: login => /^.{5,}$/.test(login),
    message: 'Minimum login length is 5',
  },
  {
    predicate: login => /^[\w\-@]+$/.test(login),
    message: 'Login must contain only latin symbols,digits,_,-,@',
  },
];

const rulesRegForPassword: Rule[] = [
  {
    predicate: password => /^.{8,}$/.test(password),
    message: 'Minimum password length is 8',
  },
];

const rulesLogForLogin: Rule[] = [
  {
    predicate: login => login !== '',
    message: 'Login can not be blank',
  },
];

const rulesLogForPassword: Rule[] = [
  {
    predicate: password => password !== '',
    message: 'Password can not be blank',
  },
];

type Rules = Map<string, Rule[]>;

const validationRulesForLogin = new Map<string, Rule[]>();
[
  ['login', rulesLogForLogin],
  ['password', rulesLogForPassword]
].forEach(rule => validationRulesForLogin.set(rule[0] as string, rule[1] as Rule[]));

const validationRulesForRegistration = new Map<string, Rule[]>();
[
  ['email', rulesRegForEmail],
  ['login', rulesRegForLogin],
  ['password', rulesRegForPassword],
  ['repeatedPassword', rulesRegForPassword],
].forEach(rule => validationRulesForRegistration.set(rule[0] as string, rule[1] as Rule[]));

export {Rule, Rules, validationRulesForLogin, validationRulesForRegistration};
