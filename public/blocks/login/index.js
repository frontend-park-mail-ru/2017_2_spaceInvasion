(function () {
	'use strict';

	const Block = window.Block;
	const LoginTemplate = window.loginTemplate;

	class Login extends Block {
		constructor() {
			const el = document.createElement("div");
			el.innerHTML = LoginTemplate();
			super(el);
		}


        onSubmit(callback) {
			console.log("onSubmit");
            this.el.addEventListener('submit', function (e) {
                e.preventDefault();
                this.resetErrors();
                const formData = {};
                const form = document.querySelector('.Validation');
                const elements = form.elements;

                const errors = this.validationLogin(elements);

                if (errors.length !== 0){
                    this.appendErrors(errors);
                } else {
                    for (const el of elements) {
                        if (el.name!=="ValidateBtn") {
                            formData[el.name] = el.value;
                        }
                    }
                    callback(formData);
                }

            }.bind(this));
        }

        validationLogin (arr){
            let arrInvalidateFields =[];
			for (let el of arr){
                if (el.value === "" && el.name!=="ValidateBtn"){
                	arrInvalidateFields.push(el);
                }
			}
            return arrInvalidateFields;
		}

        resetErrors() {
            const errors = document.querySelectorAll(`.message`);
            for (const err of errors) {
                err.hidden = true;
                err.parentNode.querySelector('input').classList.remove('errorBorder');
            }
        }

		appendErrors (arr) {
            arr.forEach(function (el) {
                el.classList.add('errorBorder');
                const message = document.querySelector(`div[name="${el.name}Field"] .message`);
                message.hidden = false;
            })

        }

	}

	window.Login = Login;

})();