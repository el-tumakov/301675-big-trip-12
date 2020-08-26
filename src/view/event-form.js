import SmartView from "./smart.js";
import {transformPreposition} from "../utils/specific.js";
import {toUpperCaseFirstLetter} from "../utils/common.js";
import {Offer, TRIP_TYPES, STOP_TYPES} from "../mock/event-point.js";

const humanizeDate = (date) => {
  const year = date
    .getFullYear()
    .toLocaleString()
    .slice(3);

  return date.toLocaleDateString(`en-GB`)
    .slice(0, -4) +
    year +
    ` ` +
    date.toLocaleTimeString()
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

const createOfferTemplate = (offer, check) => {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${getOfferLabel(offer)}-1" type="checkbox" name="event-offer-${getOfferLabel(offer)}" ${check}>
      <label class="event__offer-label" for="event-offer-${getOfferLabel(offer)}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const addOfferTemplate = (type, event) => {
  const {offers} = event;

  type = type.split(`-`)[0];

  let offersAll = [];

  if (Offer[type]) {
    for (let i = 0; i < Offer[type].length; i++) {
      let check = ``;

      if (offers && offers[i] === Offer[type][i]) {
        check = `checked`;
      }

      offersAll.push(createOfferTemplate(Offer[type][i], check));
    }
  }

  return offersAll.join(``);
};

const createEventFormTemplate = (event) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0).toString();

  const {
    type = `taxi`,
    city = ``,
    time = {
      start: today,
      end: today
    },
    price = ``,
    isFavorite = false,
  } = event;

  const form = (
    `<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
          <label class="event__label  event__type-output" for="event-destination-1">
          ${toUpperCaseFirstLetter(type)} ${transformPreposition(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(time.start)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(time.end)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${setFavorite(isFavorite)}>
        <label class="event__favorite-btn" for="event-favorite-1">
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
            ${addOfferTemplate(type, event)}
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
  constructor(event) {
    super();
    this._event = event;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(event) {
    this.updateData(event);
  }

  getTemplate() {
    return createEventFormTemplate(this._event);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._typeChangeHandler);
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

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._event.isFavorite
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._event);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }
}
