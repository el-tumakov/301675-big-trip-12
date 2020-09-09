export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomSign = () => {
  return Math.random() < 0.5 ? 1 : -1;
};

export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const toUpperCaseFirstLetter = (str) => {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
};

export const getToday = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0).toString();

  return today;
};
