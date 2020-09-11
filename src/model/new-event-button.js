import Observer from "../utils/observer.js";
import {ButtonState} from "../const.js";

export default class NewEventButton extends Observer {
  constructor() {
    super();
    this._activeButtonState = ButtonState.DISABLED;
  }

  setButtonState(buttonState) {
    this._activeButtonState = buttonState;
    this._notify(buttonState);
  }

  getButtonState() {
    return this._activeButtonState;
  }
}
