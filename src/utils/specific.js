import {STOP_TYPES} from "../const.js";
import moment from "moment";

const Preposition = {
  TO: `to`,
  IN: `in`
};

const {TO, IN} = Preposition;

export const transformPreposition = (type) => {
  if (STOP_TYPES.includes(type)) {
    return IN;
  }

  return TO;
};

export const getUniqueDates = (data) => {
  const dates = data.reduce((uniqueDates, item) => {
    const date = moment(item.time.start).format(`YYYY-MM-DD`);

    return uniqueDates.includes(date) ? uniqueDates : [...uniqueDates, date];
  }, []);

  return dates.sort((prev, next) => new Date(prev) - new Date(next));
};

export const isDatesEqual = (dateA, dateB) => {
  return moment(dateA) === moment(dateB);
};
