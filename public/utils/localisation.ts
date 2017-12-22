import {throwIfNull} from './utils';

type Language = {
  elem: Element | null,
  className: string,
  language: string,
  locale: string
};

const supportedLanguages: Array<Language> = [
  {
    elem: null,
    className: 'en',
    language: 'English',
    locale: 'en-US'
  },
  {
    elem: null,
    className: 'ru',
    language: 'Russian',
    locale: 'ru-RU'
  }
];

function initLocalization(): void {
  // Create buttons
  const menu = throwIfNull(document.querySelector('.dropdown.item .menu.languages'));
  supportedLanguages.forEach(lang => {
    const elem = document.createElement('div');
    elem.classList.add('item', lang.className);
    elem.innerText = lang.language;
    menu.appendChild(elem);
    lang.elem = elem;
  });

  // Add event listeners for all buttons
  supportedLanguages.forEach(lang => {
    throwIfNull(lang.elem).addEventListener('click', () => {
      supportedLanguages.forEach(l => throwIfNull(l.elem).classList.remove('active', 'selected'));
      throwIfNull(lang.elem).classList.add('active', 'selected');
      changeLocale(lang.locale);
    });
  });

  // Activate button of using locale
  document.l10n.interactive.then((resourceBundle: any[]) => {
    const usingLocale = resourceBundle.find(b => b.loaded).lang || null;
    throwIfNull(
      throwIfNull(
        supportedLanguages.find(lang => lang.locale === usingLocale) || null
      ).elem
    ).classList.add('active', 'selected');
  });
}

function changeLocale(...locales: string[]): void {
  document.l10n.requestLanguages(locales);
}

export default initLocalization;