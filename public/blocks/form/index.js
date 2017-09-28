(function formIndex() {
  const { Block } = window;

  class Form extends Block {
    onSubmit(callback) {
      this.el.addEventListener('submit', (e) => {
        e.preventDefault();
        this.resetErrors();
        const formData = {};
        const form = this.el.querySelector('.formWithValidation');

        const { elements } = form;

        const errors = Form.validation(elements);

        if (errors.length !== 0) {
          Form.appendErrors(errors, this);
        } else {
          for (let i = 0; i < elements.length; i += 1) {
            if (elements[i].name !== 'ValidateBtn') {
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

    static validation(arr) {
      const arrInvalidateFields = [];
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].value === '' && arr[i].name !== 'ValidateBtn') {
          arrInvalidateFields.push(arr[i]);
        }
      }
      return arrInvalidateFields;
    }

    resetErrors() {
      const errors = this.el.querySelectorAll('.message');
      for (let i = 0; i < errors.length; i += 1) {
        errors[i].hidden = true; // eslint-disable-line no-param-reassign
        errors[i].parentNode.querySelector('input').classList.remove('errorBorder');
      }
    }

    static appendErrors(arr, form) {
      arr.forEach((element) => {
        element.classList.add('errorBorder');
        const message = form.el.querySelector(`div[name="${element.name}Field"] .message`);
        message.hidden = false;
      });
    }
  }

  window.Form = Form;
}());
