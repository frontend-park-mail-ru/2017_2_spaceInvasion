export default class User {
  username;
  email;
  password;
  score;

  fromPromise(p: Promise<any>) {
    p.then((data) => {
      this.username = data.username;
      this.password = data.password;
      this.email = data.email;
      this.score = data.score || 0;
    });
  }
};