import {getMonthString} from "../utils.js";

export const createDayTemplate = (events) => {
  const dates = [];
  const dayTemplates = [];

  events.forEach((item) => {
    let date = item.time.start
      .toISOString().slice(0, -14);

    if (!dates.includes(date)) {
      dates.push(date);
    }
  });

  dates.forEach((item, index) => {
    const currentDate = new Date(Date.parse(item));

    dayTemplates.push(
        `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${index + 1}</span>
            <time class="day__date" datetime="${item}">${getMonthString(currentDate)} ${currentDate.getDate()}</time>
          </div>

          <ul class="trip-events__list">
          </ul>
        </li>`
    );
  });

  return dayTemplates.join(``);
};
