var developerAvatar = document.querySelectorAll("#devAvatar");
var alertDialog = document.getElementsByClassName("ui modal developer alert")[0];

const developersInfo = {
    avatars: [
        "/images/olga_surikova.jpg",
        "/images/vasiliy_dmitriev.jpg",
        "/images/nikita_boyarskikh.jpg",
        "/images/egor_kurakov.jpg",
    ],
    names:[
        "Olga Surikova",
        "Vasiliy Dmitriev",
        "Nikita Boyarskikh",
        "Egor Kurakov"
    ],
    workOn:[
        "Frontend",
        "Frontend",
        "Backend",
        "Backend"
    ]
}

var avatar = alertDialog.querySelector("img.developer.avatar");
var title = alertDialog.querySelector(".header");
var workOn = alertDialog.querySelector(".description");

developerAvatar.forEach(function(element) {
    element.onclick = function(){
        const id = element.getAttribute("name");
        avatar.setAttribute("src",developersInfo.avatars[+id]);
        title.innerText = ""+developersInfo.names[+id];
        workOn.innerText = ""+developersInfo.workOn[+id];
        $('.ui.modal.developer.alert')
        .modal('show');
    };
}, this);