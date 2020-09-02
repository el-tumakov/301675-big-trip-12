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
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(cities, offers) {
    if (this._eventFormComponent !== null) {
      return;
    }

    this._eventFormComponent = new EventFormView(cities, offers);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._eventFormComponent, AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventFormComponent === null) {
      return;
    }

    remove(this._eventFormComponent);
    this._eventFormComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
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

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
