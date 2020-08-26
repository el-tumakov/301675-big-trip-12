import {STOP_TYPES} from "../mock/event-point.js";

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

export const getMonthString = (date) => {
  let month = date.toLocaleString(`en-GB`, {
    month: `long`
  });

  return month.toUpperCase().slice(0, 3);
};

const toISODate = (date) => {
  return date.toISOString().slice(0, -14);
};

export const getUniqueDates = (data) => {
  const dates = [];

  data.forEach((item) => {
    let date = toISODate(item.time.start);

    if (!dates.includes(date)) {
      dates.push(date);
    }
  });

  return dates;
};

export const isDatesEqual = (dateA, dateB) => {
  return toISODate(dateA) === toISODate(dateB);
};
