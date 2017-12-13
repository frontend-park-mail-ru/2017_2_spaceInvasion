import {validationRulesForRegistration as rules} from '../utils/validationRules';

class User {
  public id: number;
  public username: string;
  public email: string;
  public password: string;
  public score ?: number;

  constructor(id: number, username: string, email: string, password: string, score: number = 0) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.score = score;
  }

  static validate(u: User): User {
    if ((rules.get('password') || []).filter(rule => !rule.predicate(u.password)).length > 0 ||
      (rules.get('email') || []).filter(rule => !rule.predicate(u.email)).length > 0 ||
      (rules.get('login') || []).filter(rule => !rule.predicate(u.username)).length > 0) {
      throw Error('Broken User object: ' + JSON.stringify(u));
    }

    return u;
  }

  static copy(user: User): User {
    return new User(user.id, user.username, user.email, user.password, user.score);
  }
}

export default User;