import he from "he";
import AbstractView from "./abstract.js";
import {transformPreposition} from "../utils/specific.js";
import {toUpperCaseFirstLetter} from "../utils/common.js";
import moment from "moment";

const MAX_OFFERS = 3;

const Time = {
  MS: 1000,
  S: 60,
  M: 60,
  H: 24
};

const {MS, S, M, H} = Time;

const humanizePeriod = (period) => {
  let stringPeriod = ``;

  if (period.day > 0) {
    stringPeriod += `${period.day}D `;
  }

  if (period.hour > 0) {
    stringPeriod += `${period.hour}H `;
  }

  if (period.minute > 0) {
    stringPeriod += `${period.minute}M`;
  }

  return stringPeriod;
};

const createOffersTemplate = (offers) => {
  let offer = ``;

  if (offers.length > 0) {
    for (let i = 0; i < offers.length; i++) {
      offer += (
        `<li class="event__offer">
          <span class="event__offer-title">${offers[i].title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offers[i].price}</span>
        </li>`
      );

      if (i === MAX_OFFERS - 1) {
        break;
      }
    }
  }

  return offer;
};

const createEventPointTemplate = (event) => {
  const {type, city, offers, time, price} = event;
  const diff = moment(time.end) - moment(time.start);
  const period = {
    day: Math.floor(diff / MS / S / M / H),
    hour: Math.floor(diff / MS / S / M % H),
    minute: Math.floor(diff / MS / S % M)
  };

  const timeStart = moment(time.start).format(`HH:mm`);
  const timeEnd = moment(time.end).format(`HH:mm`);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${toUpperCaseFirstLetter(type)} ${transformPreposition(type)} ${he.encode(city)}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${time.start}">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${time.end}">${timeEnd}</time>
          </p>
          <p class="event__duration">${humanizePeriod(period)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(price.toString())}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class EventPoint extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEventPointTemplate(this._event);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}
