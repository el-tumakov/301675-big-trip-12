export const createTripInfoTemplate = (events) => {
  let monthStart = ``;
  let monthEnd = ``;
  let dayStart = ``;
  let dayEnd = ``;
  let checkMonth = () => ``;

  if (events[0].time !== undefined) {
    events.sort((a, b) => a.time.start - b.time.start);

    const getMonthString = (date) => {
      let month = date.toLocaleString(`en-GB`, {
        month: `long`
      });

      return month.toUpperCase().slice(0, 3);
    };

    monthStart = getMonthString(events[0].time.start);
    monthEnd = getMonthString(
        events[events.length - 1]
        .time.end);
    dayStart = events[0].time.start.getDate() + `&nbsp;&mdash;&nbsp;`;
    dayEnd = events[events.length - 1].time.end.getDate();

    checkMonth = () => {
      if (monthStart === monthEnd) {
        return ``;
      }

      return monthEnd + ` `;
    };
  }

  const getCities = () => {
    let cities = [];

    events.forEach((item) => {
      if (!cities.includes(item.city)) {
        cities.push(item.city);
      }
    });

    return cities.join(` &mdash; `);
  };

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getCities()}</h1>

        <p class="trip-info__dates">${monthStart} ${dayStart}${checkMonth()}${dayEnd}</p>
      </div>
    </section>`
  );
};