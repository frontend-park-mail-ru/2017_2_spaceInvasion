import Block from '../block/index';

class Form extends Block {
  private rules: Object;

  constructor(el, rules) {
    super(el);
    this.rules = rules;
  }
  onSubmit(callback) {
    this.el.addEventListener('submit', (e) => {
      e.preventDefault();
      this.resetErrors();
      const formData = {};
      const form = <HTMLFormElement> this.el.querySelector('.formWithValidation');
      const elements = form.elements;

      const errors = Form.validation(elements, this.el, this.rules);

      if (!errors) {
        for (let i = 0; i < elements.length; i += 1) {
          if (elements[i]['name'] !== 'ValidateBtn' && elements[i]['name'] !== 'repeatedPassword') {
            formData[elements[i]['name']] = elements[i]['value'];
          }
        }
        callback(formData);
      }
    });
  }

  reset() {
    const form = <HTMLFormElement> this.el.querySelector('.formWithValidation');
    const elements = form.elements;
    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i]['name'] !== 'ValidateBtn') {
        elements[i]['value'] = '';// eslint-disable-line no-param-reassign
        this.resetErrors();
      }
    }
  }

  static validation(arr: HTMLFormControlsCollection, form: HTMLElement, rules) {
    let errCount = 0;
    let errorMessages = [];
    for (let i = 0; i < arr.length; i += 1) {
      switch (arr[i]['name']) {
        case 'email':
          errorMessages = Form.validateField(arr[i]['value'], rules.rulesForEmail);
          break;
        case 'login':
          errorMessages = Form.validateField(arr[i]['value'], rules.rulesForLogin);
          break;
        case 'password':
          if (arr['repeatedPassword'] !== undefined && arr[i]['value'] !== arr[i + 1]['value']) {
            errorMessages = ['Password doesn\'t match'];
            arr['repeatedPassword'].classList.add('errorBorder');
          } else {
            errorMessages = Form.validateField(arr[i]['value'], rules.rulesForPassword);
          }
          break;
        default:
          return 0;
      }
      if (errorMessages.length !== 0) {
        Form.appendErrors(errorMessages, arr[i], form);
        errCount += errorMessages.length;
      }
    }

    return errCount;
  }

  resetErrors() {
    this.el.querySelectorAll('.message').forEach((err) => {
      const error = err as HTMLElement;
      error.hidden = true;
      error.innerText = '';
      (err.parentNode as Element).querySelector('input').classList.remove('errorBorder');
    });
  }

  static appendErrors(arrOfErrors, htmlElement, form) {
    htmlElement.classList.add('errorBorder');
    arrOfErrors.forEach((element) => {
      const message = form.querySelector(`div[name="${htmlElement.name}Field"] .message`);
      if (message !== null) {
        message.innerText += `${element}\n`;
        message.hidden = false;
      }
    });
  }

  // Функция валидации данных.
  static validateField(target, rules) {
    return rules.filter(rule => !rule.predicate(target)).map(rule => rule.message);
  }
}

export default Form;

