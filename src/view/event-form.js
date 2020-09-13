import SmartView from "./smart.js";
import {transformPreposition} from "../utils/specific.js";
import {toUpperCaseFirstLetter, getToday} from "../utils/common.js";
import {TRIP_TYPES, STOP_TYPES} from "../const.js";
import flatpickr from "flatpickr";
import moment from "moment";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  type: `taxi`,
  city: ``,
  offers: [],
  description: ``,
  photos: ``,
  time: {
    start: getToday(),
    end: getToday()
  },
  price: ``,
  isFavorite: false,
};

const setFavorite = (isFavorite) => {
  if (isFavorite) {
    return `checked`;
  }

  return ``;
};

const createCityListTemplate = (cities) => {
  return (
    cities.reduce((prev, current) => {
      return prev + (
        `<option value="${current}"></option>`
      );
    }, ``)
  );
};

const createRadioTemplate = (event, types, isDisabled) => {
  return (
    types.reduce((prev, current) => {
      return prev + (
        `<div class="event__type-item">
          <input
            id="event-type-${current}-${event.id}"
            class="event__type-input visually-hidden"
            type="radio"
            name="event-type"
            value="${current}"
            ${event.type === current ? `checked` : ``}
            ${isDisabled ? `disabled` : ``}
          />
          <label class="event__type-label  event__type-label--${current}" for="event-type-${current}-${event.id}">${toUpperCaseFirstLetter(current)}</label>
        </div>`
      );
    }, ``)
  );
};

const createOfferTemplate = (offer, check, id, isDisabled) => {
  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offer.title}-${id}"
        type="checkbox"
        name="event-offer-${offer.title}"
        ${check}
        data-title="${offer.title}"
        ${isDisabled ? `disabled` : ``}
      />
      <label class="event__offer-label" for="event-offer-${offer.title}-${id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const addOfferTemplate = (event, offersData) => {
  const {type, offers, id} = event;

  const offersTemplates = [];

  const offer = offersData.find((item) => item.type === type);

  if (offer.offers.length !== 0) {
    const offersOfType = offer.offers;

    offersOfType.forEach((item) => {
      let check = ``;

      for (let i = 0; i < offers.length; i++) {
        if (offers[i].title === item.title) {
          check = `checked`;
          break;
        }
      }

      offersTemplates.push(createOfferTemplate(item, check, id));
    });
  }

  return offersTemplates.join(``);
};

const createOffersSectionTemplate = (event, offers) => {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${addOfferTemplate(event, offers)}
      </div>
    </section>`
  );
};

const createPhotosTemplate = (photos) => {
  return (
    photos.reduce((prev, current) => {
      return prev + (
        `<img class="event__photo" src="${current.src}" alt="${current.description}">`
      );
    }, ``)
  );
};

const createDesinationTemplate = (description, photos) => {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotosTemplate(photos)}
        </div>
      </div>
    </section>`
  );
};

const createEventFormTemplate = (event, offers, destination) => {
  const {
    id,
    type,
    city,
    time,
    price,
    isFavorite,
    isDisabled,
    isSaving,
    isDeleting
  } = event;

  const offer = offers.find((item) => item.type === type);
  const currentOffers = offer.offers;
  const cities = [];
  let photos;
  let description;

  destination.forEach((item) => {
    cities.push(item.name);

    if (item.name === city) {
      photos = item.pictures;
      description = item.description;
    }
  });

  const timeStart = moment(time.start).format(`DD/MM/YY HH:mm`);
  const timeEnd = moment(time.end).format(`DD/MM/YY HH:mm`);
  const isSubmitDisabled = (city === ``);

  const form = (
    `<form class="${event ? `trip-events__item` : ``} event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input
            class="event__type-toggle  visually-hidden"
            id="event-type-toggle-${id}"
            type="checkbox"
            ${isDisabled ? `disabled` : ``}
          />

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createRadioTemplate(event, TRIP_TYPES, isDisabled)}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createRadioTemplate(event, STOP_TYPES, isDisabled)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
          ${toUpperCaseFirstLetter(type)} ${transformPreposition(type)}
          </label>
          <input
            class="event__input  event__input--destination"
            id="event-destination-${id}"
            type="text"
            name="event-destination"
            value="${city}"
            list="destination-list-${id}"
            ${isDisabled ? `disabled` : ``}
          />
          <datalist id="destination-list-${id}">
            ${createCityListTemplate(cities)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input
            class="event__input  event__input--time"
            id="event-start-time-${id}"
            type="text"
            name="event-start-time"
            value="${timeStart}"
            ${isDisabled ? `disabled` : ``}
          />
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input
            class="event__input  event__input--time"
            id="event-end-time-${id}"
            type="text"
            name="event-end-time"
            value="${timeEnd}"
            ${isDisabled ? `disabled` : ``}
          />
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price"
            id="event-price-${id}"
            type="number"
            name="event-price"
            value="${price}"
            ${isDisabled ? `disabled` : ``}
            required
          />
        </div>

        <button
          class="event__save-btn  btn  btn--blue"
          type="submit"
          ${isSubmitDisabled || isDisabled ? `disabled` : ``}
        >${isSaving ? `Saving...` : `Save`}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
          ${id === undefined ? `Cancel` : `${isDeleting ? `Deleting...` : `Delete`}`}
        </button>

        <input
          id="event-favorite-${id}"
          class="event__favorite-checkbox visually-hidden"
          type="checkbox"
          name="event-favorite"
          ${setFavorite(isFavorite)}
          ${isDisabled ? `disabled` : ``}
        />
        <label class="event__favorite-btn" for="event-favorite-${id}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        ${currentOffers.length !== 0 ? createOffersSectionTemplate(event, offers) : ``}
        ${city !== `` ? createDesinationTemplate(description, photos) : ``}
      </section>
    </form>`
  );

  if (event) {
    return form;
  }

  return (
    `<li class="trip-events__item">
      ${form}
    </li>`
  );
};

export default class EventForm extends SmartView {
  constructor(destination, offers, event = BLANK_EVENT) {
    super();
    this._destination = destination;
    this._offers = offers;
    this._data = EventForm.parseEventToData(event);

    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._timeStartChangeHandler = this._timeStartChangeHandler.bind(this);
    this._timeEndChangeHandler = this._timeEndChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(event) {
    this.updateData(EventForm.parseEventToData(event));
  }

  getTemplate() {
    return createEventFormTemplate(this._data, this._offers, this._destination);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setDatepickers();
  }

  setDatepickers() {
    this._setDatepickerStart();
    this._setDatepickerEnd();
  }

  removeDatepickers() {
    this._datepickerStart.destroy();
    this._datepickerEnd.destroy();
  }

  _setDatepickerStart() {
    this._datepickerStart = flatpickr(
        this.getElement().querySelector(`input[name="event-start-time"]`),
        {
          "enableTime": true,
          "dateFormat": `d/m/y H:i`,
          "time_24hr": true,
          "onChange": this._timeStartChangeHandler
        }
    );
  }

  _setDatepickerEnd() {
    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }

    this._datepickerEnd = flatpickr(
        this.getElement().querySelector(`input[name="event-end-time"]`),
        {
          "enableTime": true,
          "dateFormat": `d/m/y H:i`,
          "time_24hr": true,
          "onChange": this._timeEndChangeHandler
        }
    );
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();

    let offers = [];
    const offersOfType = this._offers.find((item) => item.type === this._data.type).offers;
    const offer = offersOfType.find((item) => item.title === evt.target.dataset.title);

    if (evt.target.checked) {
      offers = [
        ...this._data.offers,
        offer
      ];
    } else {
      const index = this._data.offers.findIndex((item) => item.title === offer.title);

      offers = [
        ...this._data.offers.slice(0, index),
        ...this._data.offers.slice(index + 1)
      ];
    }

    this.updateData({
      offers
    });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: []
    });
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();

    const city = evt.target.value;
    const destination = this._destination.find((item) => item.name === city);

    if (!destination) {
      evt.target.setCustomValidity(`Choose a city from the list`);
      return;
    }

    const description = destination.description;
    const photos = destination.pictures;

    this.updateData({
      city,
      description,
      photos
    });
  }

  _timeStartChangeHandler([userDate]) {
    const date = userDate.toISOString();
    let end = this._data.time.end;

    if (userDate > moment(end)) {
      const timeEndElement = this.getElement()
        .querySelector(`input[name="event-end-time"]`);

      end = date;
      timeEndElement.value = moment(end).format(`DD/MM/YY HH:mm`);
    }

    this.updateData({
      time: {
        start: date,
        end
      }
    }, true);
  }

  _timeEndChangeHandler([userDate]) {
    const date = userDate.toISOString();
    let start = this._data.time.start;

    if (userDate < moment(start)) {
      const timeStartElement = this.getElement()
        .querySelector(`input[name="event-start-time"]`);

      start = date;
      timeStartElement.value = moment(start).format(`DD/MM/YY HH:mm`);
    }

    this.updateData({
      time: {
        start,
        end: date
      }
    }, true);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();

    if (!Number.isInteger(+evt.target.value)) {
      return;
    }

    this.updateData({
      price: evt.target.value
    }, true);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this._callback.formSubmit(EventForm.parseDataToEvent(this._data));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventForm.parseDataToEvent(this._data));
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._typeChangeHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._cityChangeHandler);
    this.getElement()
    .querySelector(`.event__input--price`)
    .addEventListener(`change`, this._priceChangeHandler);
    this.getElement()
      .querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, this._favoriteClickHandler);

    const offersSectionElement = this.getElement()
      .querySelector(`.event__section--offers`);

    if (offersSectionElement) {
      offersSectionElement.addEventListener(`change`, this._offersChangeHandler);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._deleteClickHandler);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeButtonClickHandler);
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
