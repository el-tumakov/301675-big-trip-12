import AbstractView from "./abstract.js";
import {transformPreposition} from "../utils/specific.js";

const MAX_OFFERS = 3;

const Time = {
  MS: 1000,
  S: 60,
  M: 60,
  H: 24
};

const {MS, S, M, H} = Time;

const humanizeTime = (date) => {
  return date.toLocaleTimeString().slice(0, -3);
};

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
  const diff = time.end - time.start;
  const period = {
    day: Math.floor(diff / MS / S / M / H),
    hour: Math.floor(diff / MS / S / M % H),
    minute: Math.floor(diff / MS / S % M)
  };

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${transformPreposition(type)} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${time.start.toISOString()}">${humanizeTime(time.start)}</time>
            &mdash;
            <time class="event__end-time" datetime="${time.end.toISOString()}">${humanizeTime(time.end)}</time>
          </p>
          <p class="event__duration">${humanizePeriod(period)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
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
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createEventPointTemplate(this._event);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setEditClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
