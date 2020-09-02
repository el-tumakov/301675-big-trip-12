import EventFormView from "../view/event-form.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const {AFTERBEGIN} = RenderPosition;

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(events, offers) {
    if (this._eventFormComponent !== null) {
      return;
    }

    this._eventFormComponent = new EventFormView(events, offers);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._eventFormComponent, AFTERBEGIN);
  }

  destroy() {
    if (this._eventFormComponent === null) {
      return;
    }

    remove(this._eventFormComponent);
    this._eventFormComponent = null;
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MAJOR,
        Object.assign(event)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
