import AbstractView from "./abstract.js";
import {SortType} from "../const.js";
import moment from "moment";

const createDayTemplate = (date, counter, sortType) => {
  const currentDate = new Date(date);

  return (
    `<li class="trip-days__item day">
        <div class="day__info">
          ${sortType !== SortType.DEFAULT ? `` : `<span class="day__counter">${counter + 1}</span>
          <time class="day__date" datetime="${date}">${moment(currentDate).format(`MMM`)} ${currentDate.getDate()}</time>`}
        </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class Day extends AbstractView {
  constructor(date, counter, sortType) {
    super();
    this._date = date;
    this._counter = counter;
    this._sortType = sortType;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._counter, this._sortType);
  }
}
