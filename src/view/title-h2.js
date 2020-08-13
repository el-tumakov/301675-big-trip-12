import {createElement} from "../utils.js";

const createTitleH2Template = (title) => {
  return (
    `<h2 class="visually-hidden">${title}</h2>`
  );
};

export default class TitleH2 {
  constructor() {
    this._element = null;
  }

  getTemplate(title) {
    return createTitleH2Template(title);
  }

  getElement(title) {
    if (!this._element) {
      this._element = createElement(this.getTemplate(title));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
