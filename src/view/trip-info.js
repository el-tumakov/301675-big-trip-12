import AbstractView from "./abstract.js";
import moment from "moment";

const createTripInfoTemplate = (events) => {
  let monthStart = ``;
  let monthEnd = ``;
  let dayStart = ``;
  let dayEnd = ``;
  let checkMonth = () => ``;

  const sortEvents = events.sort((prev, next) => new Date(prev.time.start) - new Date(next.time.start));

  if (sortEvents.length) {
    const startDate = new Date(sortEvents[0].time.start);
    const endDate = new Date(sortEvents[sortEvents.length - 1].time.end);
    monthStart = moment(startDate).format(`MMM`);
    monthEnd = moment(endDate).format(`MMM`);

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
    const cities = [];

    sortEvents.forEach((item) => {
      cities.push(item.city);
    });

    if (cities.length > 3) {
      return (
        `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`
      );
    }

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
