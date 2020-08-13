import {createElement} from "../utils.js";

const createTripPriceTemplate = (events) => {
  let sum = 0;

  events.forEach((item) => {
    item.offers.forEach((offer) => {
      sum += offer.price;
    });

    sum += item.price;
  });

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>`
  );
};

export default class TripPrice {
  constructor(events) {
    this._element = null;
    this._events = events;
  }

  getTemplate() {
    return createTripPriceTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
