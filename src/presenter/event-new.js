import EventFormView from "../view/event-form.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType, ButtonState} from "../const.js";

const {BEFOREEND} = RenderPosition;

export default class EventNew {
  constructor(eventListContainer, changeData, newEventBtnModel) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._newEventBtnModel = newEventBtnModel;

    this._eventFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(destination, offers) {
    if (this._eventFormComponent !== null) {
      return;
    }

    this._eventFormComponent = new EventFormView(destination, offers);

    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._eventFormComponent.setDatepickers();

    render(this._eventListContainer, this._eventFormComponent, BEFOREEND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventFormComponent === null) {
      return;
    }

    remove(this._eventFormComponent);

    this._eventFormComponent.removeDatepickers();
    this._eventFormComponent = null;

    this._newEventBtnModel.setButtonState(ButtonState.ENABLED);

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._eventFormComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._eventFormComponent.shake(resetFormState);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MAJOR,
        event
    );
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
