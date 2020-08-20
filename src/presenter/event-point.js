import EventPointView from "../view/event-point.js";
import EventFormView from "../view/event-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const {BEFOREEND} = RenderPosition;

export default class Event {
  constructor(eventsListContainer, changeData) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;

    this._eventComponent = null;
    this._eventFormComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventFormComponent = this._eventFormComponent;

    this._eventComponent = new EventPointView(event);
    this._eventFormComponent = new EventFormView(event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventFormComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventsListContainer, this._eventComponent, BEFOREEND);

      return;
    }

    if (this._eventsListContainer.contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._eventsListContainer.contains(prevEventFormComponent.getElement())) {
      replace(this._eventFormComponent, prevEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }

  _replaceEventToForm() {
    replace(this._eventFormComponent, this._eventComponent);
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormComponent);
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  _handleFormSubmit(event) {
    this._changeData(event);
    this._replaceFormToEvent();
  }
}
