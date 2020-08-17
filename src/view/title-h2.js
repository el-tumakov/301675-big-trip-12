import AbstractView from "./abstract.js";

const createTitleH2Template = (title) => {
  return (
    `<h2 class="visually-hidden">${title}</h2>`
  );
};

export default class TitleH2 extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createTitleH2Template(this._title);
  }
}
