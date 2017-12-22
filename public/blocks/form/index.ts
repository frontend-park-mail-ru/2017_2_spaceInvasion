import Block from '../block/index';
import {Rule, Rules} from '../../utils/validationRules';
import {throwIfNull} from '../../utils/utils';

abstract class Form extends Block {
  private rules: Rules;

  constructor(el: HTMLElement, rules: Rules) {
    super(el);
    this.rules = rules;
  }

  static emptyListener(e: Event) {
    e.preventDefault();
    return false;
  }

  static validation(collection: HTMLFormControlsCollection, form: HTMLElement,
                    rules: Rules): number {
    let errCount = 0;
    let errorMessages: string[] = [];
    let pass: string | null = null;

    Array.from(collection).forEach(el => {
      const name = (el as HTMLInputElement).name;
      const value = (el as HTMLInputElement).value;
      if (!name) {
        return;
      }

      errorMessages = Form.validateField(value, rules.get(name) || []);

      if (name === 'repeatedPassword' || name === 'password') {
        if (pass !== null && pass !== value) {
          errorMessages.push(`Password doesn't match`);
          throwIfNull(<Element>collection.namedItem('repeatedPassword')).classList.add('errorBorder');
        } else if (pass === null) {
          pass = value;
        }
      }

      if (errorMessages.length !== 0) {
        Form.appendErrors(errorMessages, el as HTMLInputElement, form as HTMLFormElement);
        errCount += errorMessages.length;
      }
    });

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

  onSubmitOnce(callback: (a: any) => any): void {
    const listener = (e: Event) => {
      e.preventDefault();
      this.resetErrors();
      let data: any = {};
      const form = <HTMLFormElement> this.el.querySelector('.formWithValidation');
      const elements = form.elements;

      const errors = Form.validation(elements, this.el, this.rules);

      if (!errors) {
        Array.from(elements).forEach(el => {
          const name = (el as HTMLInputElement).name;
          const value = (el as HTMLInputElement).value;
          if (name !== 'ValidateBtn' && name !== 'repeatedPassword') {
            data[name] = value;
          }
        });

        callback(data);
        this.el.removeEventListener('submit', bindedListener);
        this.el.addEventListener('submit', Form.emptyListener);
      }

      return !errors;
    };

    const bindedListener = listener.bind(this);
    this.el.removeEventListener('submit', Form.emptyListener);
    this.el.addEventListener('submit', bindedListener);
  }

  reset(): void {
    const form = <HTMLFormElement> this.el.querySelector('.formWithValidation');
    const elements = Array.from(form.elements);
    elements.forEach(el => {
      const name = (el as HTMLInputElement).name;
      if (name && name !== 'ValidateBtn') {
        (el as HTMLInputElement).value = '';
      }
    });
    this.resetErrors();
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

