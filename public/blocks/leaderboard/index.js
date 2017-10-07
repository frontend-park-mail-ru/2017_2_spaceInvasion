(function leaderboardIndex() {
    const { Block, Http, leaderboardTemplate } = window;

    function fetchLeaderboard(el) {
        Http.Fetch('GET', '/leaderboard').then(res => res.json())
            .then((res) => {
                el.classList.remove("ui", "active", "loader");
                el.innerHTML = leaderboardTemplate({ data: res });
            });
    }

    class Leaderboard extends Block {
        constructor() {
            const el = document.createElement('div');
            el.classList.add("ui", "active", "loader");
            fetchLeaderboard(el);
            super(el);
        }
    }

    window.Leaderboard = Leaderboard;
}());