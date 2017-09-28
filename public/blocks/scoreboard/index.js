(function() {
    'use strict';

    const Block = window.Block;
    const ScoreboardTemplate = window.scoreboardTemplate;

    class Scoreboard extends Block {
        constructor() {
            const el = document.createElement("div");
            el.innerHTML = ScoreboardTemplate({count:10});
            super(el);
        }
    }

    window.Scoreboard = Scoreboard;

})();