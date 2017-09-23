var NavLoginForm = document.getElementById("login-section");
var registrationForm = document.getElementById("registration-section");
var aboutForm = document.getElementById("about-section");

var homeBtn = document.getElementById("homeBtn");
var aboutBtn = document.getElementById("aboutBtn");
var signUpBtn = document.getElementById("signUpBtn");


homeBtn.onclick = function(){
    NavLoginForm.style.display = "initial"
    registrationForm.style.display = "none"
    aboutForm.style.display = "none"
}

aboutBtn.onclick = function(){
    NavLoginForm.style.display = "none"
    registrationForm.style.display = "none"
    aboutForm.style.display = "initial"
}

signUpBtn.onclick = function(){
    NavLoginForm.style.display = "none"
    registrationForm.style.display = "initial"
    aboutForm.style.display = "none"
}