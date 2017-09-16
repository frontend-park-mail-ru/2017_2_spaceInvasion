$(".ui.circular.image").click(function(){


    var title = document.getElementById("title");
    var avatar = document.getElementById("developer-avatar");
    var workOn = document.getElementById("workOn");

    switch(this.id){
        case "1":
        title.innerText = "Ольга Сурикова"
        avatar.src = "/images/olga_surikova.jpg"
        workOn.innerText = "Frontend"
        break;
        
        case "2":
        title.innerText = "Василий Дмитриев"
        avatar.src = "/images/vasiliy_dmitriev.jpg"
        workOn.innerText = "Frontend"
        break;

        case "3":
        title.innerText = "Никита Боярских"
        avatar.src = "/images/nikita_boyarskikh.jpg"
        workOn.innerText = "Backend"
        break;

        case "4":
        title.innerText = "Егор Кураков"
        avatar.src = "/images/egor_kurakov.jpg"
        workOn.innerText = "Backend"
        break;
    }
    $('.ui.modal')
    .modal('show');
});