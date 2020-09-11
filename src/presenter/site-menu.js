import SiteMenuView from "../view/site-menu.js";
import TitleH2View from "../view/title-h2.js";
import FilterView from "../view/filter.js";
import {render, RenderPosition} from "../utils/render.js";
import {MenuItem} from "../const.js";

const {BEFOREEND} = RenderPosition;

export default class SiteMenu {
  constructor(siteMenuContainer, siteMenuModel) {
    this._siteMenuContainer = siteMenuContainer;
    this._siteMenuModel = siteMenuModel;

    this._siteMenuComponent = new SiteMenuView();
    this._filterComponent = new FilterView();

    this._handleSiteMenuModel = this._handleSiteMenuModel.bind(this);
    this._handleSiteMenuChange = this._handleSiteMenuChange.bind(this);

    this._siteMenuModel.addObserver(this._handleSiteMenuModel);
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

  _handleSiteMenuModel() {
    if (this._siteMenuModel.getMenuItem() === MenuItem.NEW_EVENT) {
      this._siteMenuModel.setMenuItem(MenuItem.TABLE);
      this._siteMenuComponent.resetMenu();
    }
  }

  _handleSiteMenuChange(menuItem) {
    if (!menuItem) {
      return;
    }

    this._currentMenuItem = this._siteMenuModel.getMenuItem();

    if (this._currentMenuItem === menuItem) {
      return;
    }

    this._siteMenuModel.setMenuItem(menuItem);
    this._siteMenuComponent.setMenuItemActive(this._currentMenuItem, menuItem);
  }
}
