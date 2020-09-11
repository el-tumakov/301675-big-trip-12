import NewEventButtonView from "../view/new-event-button.js";
import {render, RenderPosition} from "../utils/render.js";
import {MenuItem, ButtonState} from "../const.js";

const {BEFOREEND} = RenderPosition;

export default class NewEventButton {
  constructor(newEventButtonContainer, newEventButtonModel, siteMenuModel) {
    this._newEventButtonContainer = newEventButtonContainer;
    this._newEventButtonModel = newEventButtonModel;
    this._siteMenuModel = siteMenuModel;

    this._newEventButtonComponent = new NewEventButtonView();

    this._handleNewEventButtonModel = this._handleNewEventButtonModel.bind(this);
    this._handleNewEventButtonClick = this._handleNewEventButtonClick.bind(this);

    this._newEventButtonModel.addObserver(this._handleNewEventButtonModel);
  }

  init() {
    this._renderNewEventButton();

    this._newEventButtonComponent.setClickHandler(this._handleNewEventButtonClick);
  }

  _renderNewEventButton() {
    render(this._newEventButtonContainer, this._newEventButtonComponent, BEFOREEND);
  }

  _handleNewEventButtonModel(buttonState) {
    switch (buttonState) {
      case ButtonState.ENABLED:
        this._newEventButtonComponent.removeDisabled();
        break;
      case ButtonState.DISABLED:
        this._newEventButtonComponent.setDisabled();
        break;
    }
  }

  _handleNewEventButtonClick() {
    this._siteMenuModel.setMenuItem(MenuItem.NEW_EVENT);
    this._newEventButtonComponent.setDisabled();
  }
}
