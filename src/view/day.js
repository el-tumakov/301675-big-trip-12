import AbstractView from "./abstract.js";
import {getMonthString} from "../utils/specific.js";

const createDayTemplate = (date, counter) => {
  const currentDate = new Date(Date.parse(date));

  return (
    `<li class="trip-days__item day">
        <div class="day__info">
          <span class="day__counter">${counter + 1}</span>
          <time class="day__date" datetime="${date}">${getMonthString(currentDate)} ${currentDate.getDate()}</time>
        </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class Day extends AbstractView {
  constructor(date, counter) {
    super();
    this._date = date;
    this._counter = counter;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._counter);
  }
}
