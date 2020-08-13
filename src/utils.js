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

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

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
