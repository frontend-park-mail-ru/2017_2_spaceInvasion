import Block from '../block/index';
import {Rule, Rules} from '../../utils/validationRules';
import {throwIfNull} from '../../utils/utils';

abstract class Form extends Block {
  private rules: Rules;

  constructor(el: HTMLElement, rules: Rules) {
    super(el);
    this.rules = rules;
  }

  static validation(arr: HTMLFormControlsCollection, form: HTMLElement,
                    rules: Rules): number {
    let errCount = 0;
    let errorMessages: string[] = [];
    let pass: string | null = null;

    for (let i = 0; i < arr.length; i += 1) {
      const name = (arr[i] as HTMLInputElement).name;
      const value = (arr[i] as HTMLInputElement).value;
      if (!name) {
        continue;
      }

      errorMessages = Form.validateField(value, rules.get(name) || []);

      if (name === 'repeatedPassword' || name === 'password') {
        if (pass !== null && pass !== value) {
          errorMessages.push(`Password doesn't match`);
          throwIfNull(<Element>arr.namedItem('repeatedPassword')).classList.add('errorBorder');
        } else if (pass === null) {
          pass = value;
        }
      }

      if (errorMessages.length !== 0) {
        Form.appendErrors(errorMessages, arr[i] as HTMLInputElement, form as HTMLFormElement);
        errCount += errorMessages.length;
      }
    }

    return errCount;
  }

  static appendErrors(arrOfErrors: string[], htmlElement: HTMLInputElement, form: HTMLFormElement): void {
    htmlElement.classList.add('errorBorder');
    arrOfErrors.forEach((element) => {
      const message = <HTMLElement>form.querySelector(`div[name="${htmlElement.name}Field"] .message__error_message`);
      if (message !== null) {
        message.innerText += `${element}\n`;
        message.hidden = false;
      }
    });
  }

  // Функция валидации данных.
  static validateField(target: string, rules: Rule[]): string[] {
    return rules.filter(rule => !rule.predicate(target)).map(rule => rule.message);
  }

  onSubmit(callback: (a: any) => any): void {
    this.el.addEventListener('submit', (e) => {
      e.preventDefault();
      this.resetErrors();
      let data: any = {};
      const form = <HTMLFormElement> this.el.querySelector('.formWithValidation');
      const elements = form.elements;

      const errors = Form.validation(elements, this.el, this.rules);

      if (!errors) {
        for (let i = 0; i < elements.length; i += 1) {
          const name = (elements[i] as HTMLInputElement).name;
          const value = (elements[i] as HTMLInputElement).value;
          if (name !== 'ValidateBtn' && name !== 'repeatedPassword') {
            data[name] = value;
          }
        }
        callback(data);
      }

      return !errors;
    });
  }

  reset(): void {
    const form = <HTMLFormElement> this.el.querySelector('.formWithValidation');
    const elements = form.elements;
    for (let i = 0; i < elements.length; i += 1) {
      const name = (elements[i] as HTMLInputElement).name;
      if (name && name !== 'ValidateBtn') {
        (elements[i] as HTMLInputElement).value = '';
        this.resetErrors();
      }
    }
  }

  resetErrors(): void {
    this.el.querySelectorAll('.message__error_message').forEach((err) => {
      const error = <HTMLElement>err;
      error.hidden = true;
      error.innerText = '';
      throwIfNull((err.parentNode as Element).querySelector('input')).classList.remove('errorBorder');
    });
  }
}

export default Form;

