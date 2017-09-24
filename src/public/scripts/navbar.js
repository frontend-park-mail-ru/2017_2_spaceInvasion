const menu_items = document.querySelectorAll(".item");

menu_items.forEach(function(el) {
    el.addEventListener("click",kek);
}, this);
function kek(){
    switch(this.id){
        case "homeBtn":
        debugger
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