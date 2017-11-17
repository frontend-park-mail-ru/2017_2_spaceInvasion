/**
 * Базовый класс блока
 * @module Block
 */
class Block {

  el: HTMLElement;
  /**
   * @param {HTMLElement} el - корневой элемент блока
   * @constructor
   */
  constructor(el : HTMLElement) {
    this.el = el;
  }

  /**
   * Фабричный метод, который ползволяет удобро создавать блоки с заданными характеристиками
   * @param {string} [tagName='div'] - tagName блока
   * @param {string[]} [classes=[]] - список имён классов
   * @param {string|null} [text=null] - опциональный текст блока
   * @return {Block}
   * @constructor
   */
  static Create(tagName = 'div', classes : string[] = [], text = '') : Block {
    const el = document.createElement(tagName);
    classes.forEach((className) => {
      el.classList.add(className);
    });
    el.textContent = text;
    return new Block(el);
  }

  /**
   * Установить новый текст для блока
   * @param {string} text
   */
  setText(text : string) : void {
    this.el.textContent = text;
  }

  /**
   * Очищает содержимое блока
   */
  clear() : void {
    this.el.innerHTML = '';
  }

  /**
   * Скрывает блок
   */
  hide() : void {
    this.el.setAttribute('hidden', 'hidden');
  }

  /**
   * Проверяет блок на видимость
   * @return {boolean}
   */
  isHidden() : boolean {
    const status = this.el.getAttribute('hidden');
    return status === 'hidden';
  }

  /**
   * Отображает блок
   */
  show() : void {
    this.el.removeAttribute('hidden');
  }

  /**
   * Добавляет к текущему блоку дочерний
   * @param {Block} block
   * @return {Block}
   */
  append(block : Block) : Block {
    this.el.appendChild(block.el);
    return this;
  }

  /**
   * Позволяет подписаться на событие
   * @param {string} event
   * @param {EventListener} callback
   * @return {function(this:Block)} - функция отписки от события
   */
  on(event : string, callback : EventListener) {
    this.el.addEventListener(event, callback);
    return function eventListener(this: Block) {
      this.el.removeEventListener(event, callback);
    }.bind(this);
  }
}

export default Block;
