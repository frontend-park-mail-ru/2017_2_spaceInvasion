(function formIndex() {
  const { Block } = window;

  class Form extends Block {
    constructor(el, rules) {
      super(el);
      this.rules = rules;
    }
    onSubmit(callback) {
      this.el.addEventListener('submit', (e) => {
        e.preventDefault();
        this.resetErrors();
        const formData = {};
        const form = this.el.querySelector('.formWithValidation');
        const { elements } = form;

        const errors = Form.validation(elements, this.el, this.rules);

        if (!errors) {
          for (let i = 0; i < elements.length; i += 1) {
            if (elements[i].name !== 'ValidateBtn' && elements[i].name !== 'repeatedPassword') {
              formData[elements[i].name] = elements[i].value;
            }
          }
          callback(formData);
        }
      });
    }

    reset() {
      const form = this.el.querySelector('.formWithValidation');
      const { elements } = form;
      for (let i = 0; i < elements.length; i += 1) {
        if (elements[i].name !== 'ValidateBtn') {
          elements[i].value = ''; // eslint-disable-line no-param-reassign
          this.resetErrors();
        }
      }
    }

    static validation(arr, form, rules) {
      let errCount = 0;
      let errorMessages = [];
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].name === 'email') {
          errorMessages = Form.validateField(arr[i].value, rules.rulesForEmail);
        } else if (arr[i].name === 'login') {
          errorMessages = Form.validateField(arr[i].value, rules.rulesForLogin);
        } else if (arr[i].name === 'password') {
          if (arr.repeatedPassword !== undefined && arr[i].value !== arr[i + 1].value){
            errorMessages = ['Password doesn\'t match'];
          } else {
            errorMessages = Form.validateField(arr[i].value, rules.rulesForPassword);
          }
          arr[i + 1].classList.add('errorBorder');
        }
        if (errorMessages.length !== 0) {
          Form.appendErrors(errorMessages, arr[i], form );
          errCount += errorMessages.length;
        }
      }

      return errCount;
    }

    resetErrors() {
      const errors = this.el.querySelectorAll('.message');
      for (let i = 0; i < errors.length; i += 1) {
        errors[i].hidden = true; // eslint-disable-line no-param-reassign
        errors[i].innerText = '';
        errors[i].parentNode.querySelector('input').classList.remove('errorBorder');
        console.log(errors[i].parentNode.querySelector('input').classList);

      }
    }

    static appendErrors(arrOfErrors, htmlElement, form) {
      htmlElement.classList.add('errorBorder');
      arrOfErrors.forEach((element) => {
        const message = form.querySelector(`div[name="${htmlElement.name}Field"] .message`);
        if (message !== null){
          message.innerText += element+'\n';
          message.hidden = false;
        }
      });
    }

    // Функция валидации данных.
    static validateField(target, rules) {
      return rules.filter(rule => !rule.predicate(target)).map(rule => rule.message);
    }
  }

  window.Form = Form;
}());
