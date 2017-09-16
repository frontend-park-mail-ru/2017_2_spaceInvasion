'use strict';

// TODO: Дописать переменные email, login,...

const loginForm = document.querySelector('.formWithValidation');
const validateBtn = loginForm.querySelector('.validateBtn');
const password = loginForm.password;
const repeatedPassword = loginForm.repeatedPassword;
let isError = false;  // TODO: Надо убрать!!!!

//=================================================================

// Критерии проверки валидности.
const rulesForEmail = [{
    predicate: email => /^[\w\-]+\@[\w\-]+\.[A-Za-z]{2,4}$/.test(email),//
    message: "Wrong format of email",
},{ predicate: function (email) { return email !== ""; },
    message: "Email can not be blank",
}];
const rulesForConditions = [{
    predicate: function (isChecked) {return isChecked;},
    message: "Agree to the Terms and Conditions, please",
}];
const rulesForLogin = [{
    predicate: function (login) {return /^[\w\-\@]{5,}$/.test(login)},
    message: "Minimum login length is 5",
},{ predicate: function (login) { return /^[\w\-\@]+$/.test(login) },
    message: "Login must contain only latin symbols,digits,_,-,@",
}];
const rulesForPassword = [{
    predicate: function (password) {return /^[\w\s\-\.]{8,}$/.test(password)},
    message: "Minimum password length is 8",
},{ predicate: function (password) {return /^[\w\s\-\.]+$/.test(password)},
    message: "Passwords must contain only latin symbols,digits,_,-,.",
}];

//=================================================================

// Авторизация.
function auth(login, email, password, callback) {
    const xhr = new XMLHttpRequest();

    console.log("auth");
    console.log(login,email, password);
    xhr.open('POST', '/auth', true);
    xhr.withCredentials = true;

    const user = {login, email, password};
    const body = JSON.stringify(user);
    console.log(body);

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (+xhr.status !== 200) {
            return callback(xhr, null);
        }

        const response = JSON.parse(xhr.responseText);
        callback(null, response);
    };

    xhr.send(body);
}

// Функция валидации данных.
const validate = (target, rules) =>
    rules.filter(rule => !rule.predicate(target)).map(rule => rule.message);

// Удаление начальных и конечных пробелов.
const deleteStartEndSpaces = (str) =>
    str.replace(/^\s*/, '').replace(/\s*$/, '');

// Вставить элемент после заданного.
const insertAfter = (parent, node, referenceNode) =>
    parent.insertBefore(node, referenceNode.nextSibling);

// Создание ошибки (сообщения и красной рамки)
const generateError = function (element, arrayOfErrors) {
    if (arrayOfErrors.length !== 0){
        generateRedBorder(element);
        generateErrorMessage(arrayOfErrors);
    }
};

// Создание красной рамки у ошибочного поля.
const generateRedBorder = (element) =>
    element.style.borderColor = 'red';

//Создание сообщения об ошибке.
const generateErrorMessage = function (arrayOfErrors) {
    for (let i in arrayOfErrors) {
        isError = true; // TODO: Надо убрать!!!!
        const error = document.createElement('div');
        error.className = 'error';
        error.style.color = 'red';
        error.innerHTML = arrayOfErrors[i];
        insertAfter(validateBtn.parentElement, error, validateBtn);
    }
};

//Удаление красных рамок.
const removeRedBorders = function (){  // TODO: Переписать!!!!
loginForm.email.style.borderColor = "";
loginForm.login.style.borderColor ="";
loginForm.password.style.borderColor ="";
loginForm.repeatedPassword.style.borderColor ="";
};

// Удаление ненужных ошибок.
const removeErrors = function () {
    removeRedBorders();
    // TODO: Нет удаления красных рамок!
        const errors = loginForm.querySelectorAll('.error');
        for (let i = 0; i < errors.length; i++) {
            isError = false; // TODO: Надо убрать!!!
            errors[i].remove();
        }
};

// Обработчик формы.
loginForm.addEventListener('submit', function (event) {

    debugger
    event.preventDefault();
    removeErrors();

    // Проверки валидности.
    generateError(loginForm.conditions, validate(loginForm.conditions.checked, rulesForConditions));
// TODO: По другому сделать проверку пароля!!!
    loginForm.password = deleteStartEndSpaces(loginForm.password.value);
    loginForm.repeatedPassword = deleteStartEndSpaces(loginForm.repeatedPassword.value);
    if (password.value !== repeatedPassword.value){ 
        generateErrorMessage(['Password doesn\'t match']);
        generateRedBorder(loginForm.repeatedPassword);
        generateRedBorder(loginForm.password);
    } else {
        generateError(password,validate(password.value, rulesForPassword));
        //generateRedBorder(loginForm.repeatedPassword);
    }
    generateError(loginForm.login, validate(loginForm.login.value,rulesForLogin));
    generateError(loginForm.email, validate(loginForm.email.value, rulesForEmail));

    if (!isError) { 
        // Авторизация.
        auth(loginForm.login.value, loginForm.email.value, loginForm.password.value, function (err, resp) {
                if (err) {
                    return alert('AUTH Error: ${err.status}.Please, send data again.');
                }
                console.log("Authorization OK!")
                //loginForm.reset();
            });}

});
