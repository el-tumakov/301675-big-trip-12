import AbstractView from "./abstract.js";

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();
    this._title = `Switch trip view`;
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  getTitle() {
    return this._title;
  }
}
