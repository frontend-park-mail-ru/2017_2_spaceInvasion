import {refreshTheme} from '../../modules/themes';

/**
 * Базовый класс блока
 * @module Block
 */
class Block {
  public ready: boolean;
  public initialized = false;
  protected el: HTMLElement;
  protected childrens: Block[] = [];

  /**
   * @param {HTMLElement|undefined} el - корневой элемент блока (по умолчанию - <div>)
   * @constructor
   */
  constructor(el?: HTMLElement) {
    this.ready = false;
    this.el = el || document.createElement('div');
  }

  /**
   * Фабричный метод, который ползволяет удобро создавать блоки с заданными характеристиками
   * @param {string} [tagName='div'] - tagName блока
   * @param {string[]} [classes=[]] - список имён классов
   * @param {string|null} [text=null] - опциональный текст блока
   * @param type {typeof T} - класс создаваемого блока
   * @return {T} - T.super = Block
   * @constructor
   */
  static Create<T extends Block>(tagName = 'div', classes: string[] = [],
                                 type: { new(...args: any[]): T; }): T {
    const el = document.createElement(tagName);
    classes.forEach((className) => {
      el.classList.add(className);
    });
    el.textContent = '';
    return new type(el);
  }

  /**
   * Установить новый текст для блока
   * @param {string} text
   */
  setText(text: string): void {
    this.el.textContent = text;
  }

  /**
   * Очищает содержимое блока
   */
  clear(): void {
    this.el.innerHTML = '';
    this.childrens = [];
  }

  /**
   * Скрывает блок и его детей
   */
  hide(): void {
    this.el.setAttribute('hidden', 'hidden');
    this.childrens.forEach(block => block.hide());
  }

  /**
   * Проверяет блок на видимость
   * @return {boolean}
   */
  isHidden(): boolean {
    const status = this.el.getAttribute('hidden');
    return status === 'hidden';
  }

  /**
   * Отображает блок и его детей
   */
  show(): void {
    this.el.removeAttribute('hidden');
    this.childrens.forEach(ch => ch.show());
    refreshTheme();
  }

  /**
   * Добавляет к текущему блоку дочерний
   * @param {Block} block
   * @return {Block}
   */
  append(block: Block): Block {
    this.el.appendChild(block.el);
    this.childrens.push(block);
    return this;
  }

  /**
   * Возвращает корневой элемент блока
   * @return {HTMLElement}
   */
  getElement(): HTMLElement {
    return this.el;
  }

  /**
   * Возвращает потомков блока
   * @return {Block[]}
   */
  getChildrens(): Block[] {
    return this.childrens;
  }

  /**
   * Позволяет подписаться на событие
   * @param {string} event
   * @param {EventListener} callback
   * @return {function(this:Block)} - функция отписки от события
   */
  on(event: string, callback: EventListener): void {
    this.el.addEventListener(event, callback);
    return function eventListener(this: Block): void {
      this.el.removeEventListener(event, callback);
    }.bind(this);
  }
}

export default Block;
