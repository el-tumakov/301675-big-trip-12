import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-type="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-type="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._title = `Switch trip view`;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  getTitle() {
    return this._title;
  }

  setMenuItemActive(prevMenuItem, menuItem) {
    this.getElement().querySelector(`[data-type="${prevMenuItem}"]`)
      .classList.remove(`trip-tabs__btn--active`);

    this.getElement().querySelector(`[data-type="${menuItem}"]`)
      .classList.add(`trip-tabs__btn--active`);
  }

  resetMenu() {
    this.getElement().querySelector(`[data-type="${MenuItem.STATS}"]`)
      .classList.remove(`trip-tabs__btn--active`);

    this.getElement().querySelector(`[data-type="${MenuItem.TABLE}"]`)
      .classList.add(`trip-tabs__btn--active`);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    this._callback.menuClick(evt.target.dataset.type);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
