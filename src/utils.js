const TYPES_PREP_IN = [
  `Sightseeing`,
  `Restaurant`,
  `Check-in`
];

const Preposition = {
  TO: `to`,
  IN: `in`
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const {TO, IN} = Preposition;
const {AFTERBEGIN, BEFOREEND} = RenderPosition;

export const render = (container, element, place) => {
  switch (place) {
    case AFTERBEGIN:
      container.prepend(element);
      break;
    case BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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
