import Observer from "../utils/observer.js";
import {MenuItem} from "../const.js";

export default class SiteMenu extends Observer {
  constructor() {
    super();
    this._activeItem = MenuItem.TABLE;
  }

  setMenuItem(itemType) {
    this._activeItem = itemType;
    this._notify(itemType);
  }

  getMenuItem() {
    return this._activeItem;
  }
}
