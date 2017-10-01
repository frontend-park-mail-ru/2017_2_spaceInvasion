(function leaderboardIndex() {
  const { Block, Http, LeaderboardTemplate } = window;

  function fetchLeaderboard() {
    return Http.FetchGet('/leaderboard').then(res => res);
  }

  class Leaderboard extends Block {
    constructor() {
      const el = document.createElement('div');
      el.innerHTML = LeaderboardTemplate({ data: fetchLeaderboard() });
      super(el);
    }
  }

  window.Leaderboard = Leaderboard;
}());
