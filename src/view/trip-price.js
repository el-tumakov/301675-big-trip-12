import AbstractView from "./abstract.js";

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

export default class TripPrice extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripPriceTemplate(this._events);
  }
}
