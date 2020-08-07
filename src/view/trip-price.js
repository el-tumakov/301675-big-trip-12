export const createTripPriceTemplate = (events) => {
  let sum = 0;

  if (events[0].price !== undefined) {
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
