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

export const getUniqueDates = (data) => {
  const dates = [];

  data.forEach((item) => {
    let date = item.time.start
      .toISOString().slice(0, -14);

    if (!dates.includes(date)) {
      dates.push(date);
    }
  });

  return dates;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
