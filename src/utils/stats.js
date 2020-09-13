import moment from "moment";

export const getMoney = (events, type) => {
  return events.reduce((sum, item) => {
    return item.type === type ? (sum += item.price) : sum;
  }, 0);
};

export const getTransport = (events, type) => {
  return events.reduce((count, item) => {
    return item.type === type ? count + 1 : count;
  }, 0);
};

export const getTime = (events, type) => {
  return events.reduce((time, item) => {
    if (item.type === type) {
      const timeStart = moment(item.time.start);
      const timeEnd = moment(item.time.end);
      const diff = timeEnd.diff(timeStart);
      const duration = moment.duration(diff).hours();

      time += duration;
    }

    return time;
  }, 0);
};
