export default class User {
  username;
  email;
  password;

  fromPromise(p: Promise<any>) {
    this.username = p['username'];
    this.password = p['password'];
    this.email = p['email'];
  }
};