import EventPointView from "../view/event-point.js";
import EventFormView from "../view/event-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import {isDatesEqual} from "../utils/specific.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

const {BEFOREEND} = RenderPosition;

export default class Event {
  constructor(eventsListContainer, changeData, changeMode) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(event, offers) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventFormComponent = this._eventFormComponent;

    this._eventComponent = new EventPointView(event);
    this._eventFormComponent = new EventFormView(offers, event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventsListContainer, this._eventComponent, BEFOREEND);

      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventFormComponent, prevEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }

  _replaceEventToForm() {
    replace(this._eventFormComponent, this._eventComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormComponent);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(update) {
    const isMinorUpdate =
      !isDatesEqual(this._event.time.start, update.time.start);

    this._changeData(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update);
    this._replaceFormToEvent();
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
  }
}
