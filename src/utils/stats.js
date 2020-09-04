import moment from "moment";

export const getMoney = (events, type) => {
  let sum = 0;

  events.forEach((item) => {
    if (item.type === type) {
      sum += item.price;
    }
  });

  return sum;
};

export const getTransport = (events, type) => {
  let count = 0;

  events.forEach((item) => {
    if (item.type === type) {
      count++;
    }
  });

  return count;
};

export const getTime = (events, type) => {
  let time = 0;

  events.forEach((item) => {
    if (item.type === type) {
      const timeStart = moment(item.time.start);
      const timeEnd = moment(item.time.end);
      const diff = timeEnd.diff(timeStart);
      const duration = moment.duration(diff).hours();

      time += duration;
    }
  });

  return time;
};
