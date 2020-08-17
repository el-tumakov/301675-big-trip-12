import {getMonthString, createElement} from "../utils.js";

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

export default class Day {
  constructor(date, counter) {
    this._element = null;
    this._date = date;
    this._counter = counter;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._counter);
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
