const menu_items = document.querySelectorAll(".item");
window.currentTab = "home";

menu_items.forEach(function(el) {
    el.addEventListener("click", navigate);
}, this);

function navigate() {
    clearSelection();
    if (currentTab === 'about' && window.devDialog != undefined) {
        window.closeDialog();
    }
    setSelection(this.id);
    switch (this.id) {
        case "homeBtn":
            window.currentTab = "home";
            window.showHome();
            break;
        case "aboutBtn":
            window.currentTab = "about";
            window.showAbout();
            break;
        case "signUpBtn":
            window.currentTab = "signUp";
            clearSelection();
            window.showRegistration();
            break;
        case "leaderboardBtn":
            window.currentTab = "leaderboard";
            window.showLeaderboard();
            break;
    }
}

function setSelection(el) {
    document.querySelector("#" + el).setAttribute("class", "active item");
}

function clearSelection() {
    const tabs = ["homeBtn", "aboutBtn", "signUpBtn", "leaderboardBtn"];
    tabs.forEach(function(el) {
        document.querySelector("#" + el).setAttribute("class", "item");
    }, this);
}