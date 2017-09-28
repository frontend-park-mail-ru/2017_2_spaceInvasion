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
          elements.forEach((el) => {
            if (el.name !== 'ValidateBtn') {
              formData[el.name] = el.value;
            }
          });
          callback(formData);
        }
      });
    }

    reset() {
      const form = this.el.querySelector('.formWithValidation');
      form.elements.forEach((element) => {
        if (element.name !== 'ValidateBtn') {
          element.value = ''; // eslint-disable-line no-param-reassign
          this.resetErrors();
        }
      });
    }

    static validation(arr) {
      const arrInvalidateFields = [];
      arr.forEach((element) => {
        if (element.value === '' && element.name !== 'ValidateBtn') {
          arrInvalidateFields.push(element);
        }
      });
      return arrInvalidateFields;
    }

    resetErrors() {
      const errors = this.el.querySelectorAll('.message');
      errors.forEach((err) => {
        err.hidden = true; // eslint-disable-line no-param-reassign
        err.parentNode.querySelector('input').classList.remove('errorBorder');
      });
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
