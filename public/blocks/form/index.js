(function () {
    'use strict';

    const Block = window.Block;

    class Form extends Block {
        constructor(el) {
            super(el);
        }

        onSubmit(callback) {
            this.el.addEventListener('submit', function (e) {
                e.preventDefault();
                this.resetErrors();
                const formData = {};
                const form = this.el.querySelector(`.formWithValidation`);

                const elements = form.elements;

                const errors = Form.validationLogin(elements);

                if (errors.length !== 0){
                    Form.appendErrors(errors,this);
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

        static validationLogin (arr){
            let arrInvalidateFields =[];
            for (let element of arr){
                if (element.value === "" && element.name!=="ValidateBtn"){
                    arrInvalidateFields.push(element);
                }
            }
            return arrInvalidateFields;
        }

        resetErrors() {
            const errors = this.el.querySelectorAll(`.message`);
            for (const err of errors) {
                err.hidden = true;
                err.parentNode.querySelector('input').classList.remove('errorBorder');
            }
        }

        static appendErrors (arr, f) {
            arr.forEach(function (element) {
                element.classList.add('errorBorder');
                const message = f.el.querySelector(`div[name="${element.name}Field"] .message`);
                message.hidden = false;
            })
        }
    }

    window.Form = Form;

})();