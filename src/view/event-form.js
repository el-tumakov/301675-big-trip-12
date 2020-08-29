import SmartView from "./smart.js";
import {transformPreposition} from "../utils/specific.js";
import {toUpperCaseFirstLetter, generateId, getToday} from "../utils/common.js";
import {TRIP_TYPES, STOP_TYPES} from "../const.js";

const BLANK_EVENT = {
  id: generateId(),
  type: `taxi`,
  city: ``,
  offers: [],
  description: ``,
  photo: ``,
  time: {
    start: getToday(),
    end: getToday()
  },
  price: ``,
  isFavorite: false,
};

const humanizeDate = (date) => {
  const dateData = new Date(date);

  const year = dateData
    .getFullYear()
    .toLocaleString()
    .slice(3);

  return dateData.toLocaleDateString(`en-GB`)
    .slice(0, -4) +
    year +
    ` ` +
    dateData.toLocaleTimeString()
    .slice(0, -3);
};

const getOfferLabel = (offer) => {
  let split = offer.title.split(` `);

  return split[split.length - 1];
};

const setFavorite = (isFavorite) => {
  if (isFavorite) {
    return `checked`;
  }

  return ``;
};

const getUniqCities = (events) => {
  const cities = [];

  events.forEach((item) => {
    if (!cities.includes(item.city)) {
      cities.push(item.city);
    }
  });

  return cities;
};

const createCityListTemplate = (events) => {
  const uniqCities = getUniqCities(events);

  return (
    uniqCities.reduce((prev, current) => {
      return prev + (
        `<option value="${current}"></option>`
      );
    }, ``)
  );
};

const createRadioTemplate = (event, types) => {
  return (
    types.reduce((prev, current) => {
      return prev + (
        `<div class="event__type-item">
          <input id="event-type-${current}-${event.id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${current}" ${event.type === current ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${current}" for="event-type-${current}-${event.id}">${toUpperCaseFirstLetter(current)}</label>
        </div>`
      );
    }, ``)
  );
};

const createOfferTemplate = (offer, check, event) => {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${getOfferLabel(offer)}-${event.id}" type="checkbox" name="event-offer-${getOfferLabel(offer)}" ${check}>
      <label class="event__offer-label" for="event-offer-${getOfferLabel(offer)}-${event.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const addOfferTemplate = (event, offersData) => {
  const {type, offers, id} = event;

  let offersTemplate = [];

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

      offersTemplate.push(createOfferTemplate(item, check, id));
    });
  }

  return offersTemplate.join(``);
};

const createEventFormTemplate = (event, offers, events) => {
  const {
    id,
    type,
    city,
    time,
    price,
    isFavorite
  } = event;

  const form = (
    `<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createRadioTemplate(event, TRIP_TYPES)}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createRadioTemplate(event, STOP_TYPES)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
          ${toUpperCaseFirstLetter(type)} ${transformPreposition(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${city}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createCityListTemplate(events)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizeDate(time.start)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizeDate(time.end)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-${id}" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${setFavorite(isFavorite)}>
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
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${addOfferTemplate(event, offers)}
          </div>
        </section>
      </section>
    </form>`
  );

  if (city === ``) {
    return form;
  }

  return (
    `<li class="trip-events__item">
      ${form}
    </li>`
  );
};

export default class EventForm extends SmartView {
  constructor(events, offers, event = BLANK_EVENT) {
    super();
    this._events = events;
    this._offers = offers;
    this._event = event;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(event) {
    this.updateData(event);
  }

  getTemplate() {
    return createEventFormTemplate(this._event, this._offers, this._events);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
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
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    });
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      city: evt.target.value
    }, true);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._event.isFavorite
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    if (!this._validateCity()) {
      return;
    }

    this._callback.formSubmit(this._event);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._event);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._deleteClickHandler);
  }

  _validateCity() {
    const cityInputValue = document.querySelector(`.event__input--destination`).value;
    const cities = getUniqCities(this._events);

    return cities.includes(cityInputValue) ? true : false;
  }
}
