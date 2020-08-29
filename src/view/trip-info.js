import AbstractView from "./abstract.js";
import {getMonthString} from "../utils/specific.js";

const createTripInfoTemplate = (events) => {
  let monthStart = ``;
  let monthEnd = ``;
  let dayStart = ``;
  let dayEnd = ``;
  let checkMonth = () => ``;

  if (events.length) {
    const startDate = new Date(events[0].time.start);
    const endDate = new Date(events[events.length - 1].time.end);

    monthStart = getMonthString(startDate);
    monthEnd = getMonthString(endDate);

    dayStart = startDate.getDate() + `&nbsp;&mdash;&nbsp;`;
    dayEnd = endDate.getDate();
  }

  checkMonth = () => {
    if (monthStart === monthEnd) {
      return ``;
    }

    return monthEnd + ` `;
  };

  const getCities = () => {
    let cities = [];

    events.forEach((item) => {
      if (!cities.includes(item.city)) {
        cities.push(item.city);
      }
    });

    return cities.join(` &mdash; `);
  };

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getCities()}</h1>

        <p class="trip-info__dates">${monthStart} ${dayStart}${checkMonth()}${dayEnd}</p>
      </div>
    </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
