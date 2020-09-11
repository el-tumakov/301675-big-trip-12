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
