(function() {
    'use strict';

    const Block = window.Block;
    const LeaderboardTemplate = window.leaderboardTemplate;

    class Leaderboard extends Block {
        constructor() {
            const el = document.createElement("div");
            el.innerHTML = LeaderboardTemplate({ data: fetchLeaderboard() });
            super(el);
        }
    }

    function fetchLeaderboard() {

        const res = Http.FetchGet("/leaderboard");

        const jsonData = '[{ "username": "vasidmi", "email": "https://t.me/vasidmi", "score": 0 }, { "username": "boyanik", "email": "https://t.me/Nikita_Boyarskikh", "score": 0 }, { "username": "egor", "email": "https://Egor_Kurakov", "score": 0 }, { "username": "ChocolateSwan", "email": "https://t.me/ChocolateSwan", "score": 0 }]';
        const leaderBoardObject = JSON.parse(jsonData);

        return leaderBoardObject;
    }

    window.Leaderboard = Leaderboard;

})();