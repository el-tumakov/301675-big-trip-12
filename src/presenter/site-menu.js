import SiteMenuView from "../view/site-menu.js";
import TitleH2View from "../view/title-h2.js";
import FilterView from "../view/filter.js";
import NewEventBtnView from "../view/new-event-btn.js";
import {render, RenderPosition} from "../utils/render.js";
import {MenuItem} from "../const.js";

const {BEFOREEND} = RenderPosition;

export default class SiteMenu {
  constructor(siteMenuContainer, siteMenuModel) {
    this._siteMenuContainer = siteMenuContainer;
    this._siteMenuModel = siteMenuModel;

    this._siteMenuComponent = new SiteMenuView();
    this._filterComponent = new FilterView();
    this._newEventBtnComponent = new NewEventBtnView();

    this._handleSiteMenuChange = this._handleSiteMenuChange.bind(this);
    this._handleNewEventBtnClick = this._handleNewEventBtnClick.bind(this);
  }

  init() {
    this._renderSiteMenu();
    this._renderNewEventBtn();

    this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuChange);
    this._newEventBtnComponent.setClickHandler(this._handleNewEventBtnClick);
  }

  _renderSiteMenu() {
    this._menuTitleComponent = new TitleH2View(this._siteMenuComponent.getTitle());

    render(this._siteMenuContainer, this._menuTitleComponent, BEFOREEND);
    render(this._siteMenuContainer, this._siteMenuComponent, BEFOREEND);
  }

  _renderNewEventBtn() {
    const tripMainElement = document.querySelector(`.trip-main`);

    render(tripMainElement, this._newEventBtnComponent, BEFOREEND);
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
    this._newEventBtnComponent.getElement().disabled = false;
  }

  _handleNewEventBtnClick() {
    this._currentMenuItem = this._siteMenuModel.getMenuItem();

    if (this._currentMenuItem === MenuItem.STATS) {
      this._siteMenuComponent.getElement()
      .querySelector(`[data-type="${MenuItem.STATS}"]`)
      .classList.remove(`trip-tabs__btn--active`);

      this._siteMenuComponent.getElement()
        .querySelector(`[data-type="${MenuItem.TABLE}"]`)
        .classList.add(`trip-tabs__btn--active`);
    }

    this._newEventBtnComponent.getElement().disabled = true;

    this._siteMenuModel.setMenuItem(MenuItem.NEW_EVENT);
  }
}
