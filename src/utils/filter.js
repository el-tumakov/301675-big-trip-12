import {FilterType} from "../const.js";

const isPastDate = (date) => {
  const today = new Date();

  return date < today;
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => !isPastDate(event.time.start)),
  [FilterType.PAST]: (events) => events.filter((event) => isPastDate(event.time.start))
};
