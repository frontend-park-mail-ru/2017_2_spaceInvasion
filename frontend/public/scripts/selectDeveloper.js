$(".ui.circular.image").click(function(){
    switch(this.id){
        case "1":
        $("div[class='header']").text("Ольга Сурикова")
        $("div[class='ui medium image'] img").attr("src","/images/olga_surikova.jpg")
        $("div[class='ui header']").text("Frontend")
        break;
        
        case "2":
        $("div[class='header']").text("Василий Дмитриев")
        $("div[class='ui medium image'] img").attr("src","/images/vasiliy_dmitriev.jpg")
        $("div[class='ui header']").text("Frontend")
        break;

        case "3":
        $("div[class='header']").text("Никита Боярских")
        $("div[class='ui medium image'] img").attr("src","/images/nikita_boyarskikh.jpg")
        $("div[class='ui header']").text("Backend")
        break;

        case "4":
        $("div[class='header']").text("Егор")
        $("div[class='ui medium image'] img").attr("src","/images/none.png")
        $("div[class='ui header']").text("Backend")
        break;
    }
    $('.ui.modal')
    .modal('show');
});