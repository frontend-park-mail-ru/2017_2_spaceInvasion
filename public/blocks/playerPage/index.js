(function playerPageIndex() {
    const { Block, playerpageTemplate } = window;

    class PlayerPage extends Block {
        constructor() {
            const el = document.createElement('div');
            debugger
            el.innerHTML = playerpageTemplate({ "user": userService.user });
            super(el);
        }
    }
    window.PlayerPage = PlayerPage;
}());