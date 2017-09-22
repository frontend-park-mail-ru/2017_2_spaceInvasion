'use strict';

// Удаление начальных и конечных пробелов.
const deleteStartEndSpacesFromStr = (str) =>
    str.replace(/^\s*/, '').replace(/\s*$/, '');

// Удалить первые и последние пробелы из инпутов.
const deleteStartEndSpaces = function () {
    for (let element of loginForm.elements)
        element.value = deleteStartEndSpacesFromStr(element.value);
};

// Получение данных из формы.
const loginForm = document.querySelector('.formWithValidation');
deleteStartEndSpaces();
const validateBtn = loginForm.querySelector('.validateBtn');
const password = loginForm.password;
const repeatedPassword = loginForm.repeatedPassword;
const login = loginForm.login;
const email = loginForm.email;
const conditions = loginForm.conditions;

//=================================================================

// Критерии проверки валидности.
const rulesForEmail = [{
    predicate: email => /^[\w\-]+@[\w\-]+\.[A-Za-z]{2,4}$/.test(email),//
    message: "Wrong format of email",
},{ predicate: email => email !== "",
    message: "Email can not be blank",
}];
const rulesForConditions = [{
    predicate: isChecked => isChecked,
    message: "Agree to the Terms and Conditions, please",
}];
const rulesForLogin = [{
    predicate: login => /^[\w\-@]{5,}$/.test(login),
    message: "Minimum login length is 5",
},{ predicate: login => /^[\w\-@]+$/.test(login),
    message: "Login must contain only latin symbols,digits,_,-,@",
}];
const rulesForPassword = [{
    predicate: password => /^[\w\s\-.]{8,}$/.test(password),
    message: "Minimum password length is 8",
},{ predicate: password => /^[\w\s\-.]+$/.test(password),
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

// Вставить элемент после заданного.
const insertAfter = (parent, node, referenceNode) =>
    parent.insertBefore(node, referenceNode.nextSibling);

// Создание ошибки (сообщения и красной рамки).
const generateError = function (arrayOfErrors,...element) {
    if (arrayOfErrors.length !== 0){
        element.forEach(i => generateRedBorder(i));
        generateErrorMessage(arrayOfErrors);
    }
    return arrayOfErrors.length;
};

// Создание красной рамки у ошибочного поля.
const generateRedBorder = (element) =>
    element.style.borderColor = 'red';

//Создание сообщения об ошибке.
const generateErrorMessage = function (arrayOfErrors) {
    for (let i of arrayOfErrors) {
        const error = document.createElement('div');
        error.className = 'error';
        error.style.color = 'red';
        error.innerHTML = i;
        insertAfter(validateBtn.parentElement, error, validateBtn);
    }
};

//Удаление красных рамок.
const removeRedBorders = function (){
    for (let element of loginForm.elements)
        element.style.borderColor = "";
};

//Удаление всех сообщений об ошибках.
const removeErrorMessages = function () {
    const errors = loginForm.querySelectorAll('.error');
    for (let i = 0; i < errors.length; i++) {
        errors[i].remove();
    }
};

// Удаление ненужных ошибок.
const removeErrors = function () {
    removeRedBorders();
    removeErrorMessages();
};

//Обработка данных формы.
const processFormData = function () {

    let errorSum = 0;

    // Проверки валидности.
    errorSum += generateError(validate(conditions.checked, rulesForConditions), loginForm.conditions);
    if (password.value !== repeatedPassword.value){
        generateError(['Password doesn\'t match'],password,repeatedPassword);
    } else {
        errorSum += generateError(validate(password.value, rulesForPassword),password, repeatedPassword);
    }
    errorSum += generateError(validate(login.value,rulesForLogin), login);
    errorSum += generateError(validate(email.value, rulesForEmail), email);

    return errorSum;
};

// Обработчик формы.
loginForm.addEventListener('submit', function (event) {

    event.preventDefault();
    removeErrors();

    if (!processFormData()) {
        auth(login.value, email.value, password.value, function (err, resp) {
                if (err) {
                    return alert('AUTH Error: ${err.status}.Please, send data again.');
                }
                console.log("Authorization OK!")
                //loginForm.reset();
            });}
});
