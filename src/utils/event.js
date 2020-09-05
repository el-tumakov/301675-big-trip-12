export const sortEventTime = (eventA, eventB) => {
  const timeA = new Date(eventA.time.end) - new Date(eventA.time.start);
  const timeB = new Date(eventB.time.end) - new Date(eventB.time.start);

  return timeB - timeA;
};

export const sortEventPrice = (eventA, eventB) => {
  return eventB.price - eventA.price;
};
