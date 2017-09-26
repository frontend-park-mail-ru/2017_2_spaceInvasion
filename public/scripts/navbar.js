const menu_items = document.querySelectorAll(".item");

menu_items.forEach(function(el) {
    el.addEventListener("click", navigate);
}, this);

function navigate() {
    switch (this.id) {
        case "homeBtn":
            window.showHome();
            break;
        case "aboutBtn":
            window.showAbout();
            break;
        case "signUpBtn":
            window.showRegistration();
            break;
    }
}