const menu_items = document.querySelectorAll(".item");

menu_items.forEach(function(el) {
    el.addEventListener("click", navigate);
}, this);

function navigate() {
    clearSelection();
    setSelection(this.id);
    switch (this.id) {
        case "homeBtn":
            window.showHome();
            break;
        case "aboutBtn":
            window.showAbout();
            break;
        case "signUpBtn":
            clearSelection();
            window.showRegistration();
            break;
    }
}

function setSelection(el) {
    document.querySelector("#" + el).setAttribute("class", "active item");
}

function clearSelection() {
    const tabs = ["homeBtn", "aboutBtn", "signUpBtn"];
    tabs.forEach(function(el) {
        document.querySelector("#" + el).setAttribute("class", "item");
    }, this);
}