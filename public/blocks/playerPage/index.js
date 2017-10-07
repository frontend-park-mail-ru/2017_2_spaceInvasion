(function playerPageIndex() {
    const { Block, playerpageTemplate } = window;

    class PlayerPage extends Block {
        constructor() {
            const el = document.createElement('div');
            el.innerHTML = playerpageTemplate({ "user": userService.user });
            onLogoutBtnClick(el);
            super(el);
        }
    }

    function onLogoutBtnClick(el) {
        el.querySelector(".ui.logout").addEventListener("click", () => {
            userService.logout().then(() => {
                showHome();
            })
        });
    }

    window.PlayerPage = PlayerPage;
}());