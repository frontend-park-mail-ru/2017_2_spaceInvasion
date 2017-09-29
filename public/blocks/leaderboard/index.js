(function() {
    'use strict';

    const Block = window.Block;
    const LeaderboardTemplate = window.leaderboardTemplate;

    class Leaderboard extends Block {
        constructor() {

            window.el = document.createElement("div");
            fetchLeaderboard();
            super(el);

        }
    }

    function fetchLeaderboard() {

        Http.FetchGet("/leaderboard").then(function(res) {
            window.el.innerHTML = LeaderboardTemplate({ data: res });
        });

    }

    window.Leaderboard = Leaderboard;

})();