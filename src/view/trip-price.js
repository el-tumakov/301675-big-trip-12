import {isEmpty} from "../utils.js";

export const createTripPriceTemplate = (events) => {
  let sum = 0;

  if (!isEmpty(events[0])) {
    events.forEach((item) => {
      item.offers.forEach((offer) => {
        sum += offer.price;
      });

      sum += item.price;
    });
  }

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>`
  );
};
