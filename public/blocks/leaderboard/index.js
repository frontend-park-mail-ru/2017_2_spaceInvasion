(function leaderboardIndex() {
  const { Block, Http, LeaderboardTemplate } = window;

  function fetchLeaderboard() {
    Http.FetchGet('/leaderboard').then(res => res);

    // const jsonData = '[{ "username": "vasidmi", "email": "https://t.me/vasidmi", "score": 0 }, { "username": "boyanik", "email": "https://t.me/Nikita_Boyarskikh", "score": 0 }, { "username": "egor", "email": "https://Egor_Kurakov", "score": 0 }, { "username": "ChocolateSwan", "email": "https://t.me/ChocolateSwan", "score": 0 }]';
    // const leaderBoardObject = JSON.parse(res);

    // return leaderBoardObject;
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
