import NewEventBtnView from "../view/new-event-btn.js";
import {render, RenderPosition} from "../utils/render.js";
import {MenuItem, ButtonState} from "../const.js";

const {BEFOREEND} = RenderPosition;

export default class NewEventBtn {
  constructor(newEventBtnContainer, newEventBtnModel, siteMenuModel) {
    this._newEventBtnContainer = newEventBtnContainer;
    this._newEventBtnModel = newEventBtnModel;
    this._siteMenuModel = siteMenuModel;

    this._newEventBtnComponent = new NewEventBtnView();

    this._handleNewEventBtnModel = this._handleNewEventBtnModel.bind(this);
    this._handleNewEventBtnClick = this._handleNewEventBtnClick.bind(this);

    this._newEventBtnModel.addObserver(this._handleNewEventBtnModel);
  }

  init() {
    this._renderNewEventBtn();

    this._newEventBtnComponent.setClickHandler(this._handleNewEventBtnClick);
  }

  _renderNewEventBtn() {
    render(this._newEventBtnContainer, this._newEventBtnComponent, BEFOREEND);
  }

  _handleNewEventBtnModel(buttonState) {
    switch (buttonState) {
      case ButtonState.ENABLED:
        this._newEventBtnComponent.removeDisabled();
        break;
      case ButtonState.DISABLED:
        this._newEventBtnComponent.setDisabled();
        break;
    }
  }

  _handleNewEventBtnClick() {
    this._siteMenuModel.setMenuItem(MenuItem.NEW_EVENT);
    this._newEventBtnComponent.setDisabled();
  }
}
