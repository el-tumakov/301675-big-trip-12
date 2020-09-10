import SiteMenuView from "../view/site-menu.js";
import TitleH2View from "../view/title-h2.js";
import FilterView from "../view/filter.js";
import {render, RenderPosition} from "../utils/render.js";
// import {MenuItem} from "../const.js";

const {BEFOREEND} = RenderPosition;

export default class SiteMenu {
  constructor(siteMenuContainer, siteMenuModel) {
    this._siteMenuContainer = siteMenuContainer;
    this._siteMenuModel = siteMenuModel;

    this._siteMenuComponent = new SiteMenuView();
    this._filterComponent = new FilterView();

    this._handleSiteMenuChange = this._handleSiteMenuChange.bind(this);
  }

  init() {
    this._renderSiteMenu();

    this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuChange);
  }

  _renderSiteMenu() {
    this._menuTitleComponent = new TitleH2View(this._siteMenuComponent.getTitle());

    render(this._siteMenuContainer, this._menuTitleComponent, BEFOREEND);
    render(this._siteMenuContainer, this._siteMenuComponent, BEFOREEND);
  }

  _handleSiteMenuChange(menuItem) {
    this._currentMenuItem = this._siteMenuModel.getMenuItem();

    if (this._currentMenuItem === menuItem) {
      return;
    }

    this._siteMenuComponent.getElement()
      .querySelector(`[data-type="${this._currentMenuItem}"]`)
      .classList.remove(`trip-tabs__btn--active`);

    this._siteMenuComponent.getElement()
      .querySelector(`[data-type="${menuItem}"]`)
      .classList.add(`trip-tabs__btn--active`);

    this._siteMenuModel.setMenuItem(menuItem);
  }

  // _handleNewEventBtnClick() {
  //   this._currentMenuItem = this._siteMenuModel.getMenuItem();

  //   if (this._currentMenuItem === MenuItem.STATS) {
  //     this._siteMenuComponent.getElement()
  //     .querySelector(`[data-type="${MenuItem.STATS}"]`)
  //     .classList.remove(`trip-tabs__btn--active`);

  //     this._siteMenuComponent.getElement()
  //       .querySelector(`[data-type="${MenuItem.TABLE}"]`)
  //       .classList.add(`trip-tabs__btn--active`);
  //   }

  //   this._newEventBtnComponent.setDisabled();

  //   this._siteMenuModel.setMenuItem(MenuItem.NEW_EVENT);
  // }
}
