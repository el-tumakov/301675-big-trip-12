const TYPES_PREP_IN = [
  `Sightseeing`,
  `Restaurant`,
  `Check-in`
];

const Preposition = {
  TO: `to`,
  IN: `in`
};

const {TO, IN} = Preposition;

export const transformPreposition = (type) => {
  if (TYPES_PREP_IN.includes(type)) {
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
