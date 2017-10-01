(function leaderboardIndex() {
  const { Block, Http, leaderboardTemplate } = window;

  function fetchLeaderboard(el) {
    Http.Fetch('GET', '/leaderboard').then((res) => { el.innerHTML = leaderboardTemplate({ data: res }); });
  }

  class Leaderboard extends Block {
    constructor() {
      const el = document.createElement('div');
      fetchLeaderboard(el);
      super(el);
    }
  }

  window.Leaderboard = Leaderboard;
}());
