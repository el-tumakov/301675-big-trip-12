import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripPriceTemplate} from "./view/trip-price.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createDayTemplate} from "./view/day.js";
import {createEventFormTemplate} from "./view/event-form.js";
import {createEventPointTemplate} from "./view/event-point.js";
import {generateEventPoint} from "./mock/event-point.js";
import {isEmpty} from "./utils.js";

const EVENTS_COUNT = 25;

const events = new Array(EVENTS_COUNT).fill().map(generateEventPoint);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

render(tripMainElement, createTripInfoTemplate(events), `afterbegin`);

const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripPriceTemplate(events), `beforeend`);

const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const menuTitleElement = tripControlsElement.querySelector(`h2`);

render(menuTitleElement, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate(), `beforeend`);

const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

if (!isEmpty(events[0])) {
  render(tripEventsElement, createSortTemplate(), `beforeend`);

  const tripDaysElement = mainElement.querySelector(`.trip-days`);

  render(tripDaysElement, createDayTemplate(events), `beforeend`);

  const eventsListElement = mainElement.querySelector(`.trip-events__list`);

  render(eventsListElement, createEventFormTemplate(events[0]), `beforeend`);

  for (let i = 1; i < EVENTS_COUNT; i++) {
    const {time} = events[i];
    const timeISO = time.start.toISOString().slice(0, -14);
    const timeElement = tripDaysElement
      .querySelector(`.day .day__date[datetime="${timeISO}"]`);
    const dayElement = timeElement.closest(`.day`);
    const pointsListElement = dayElement.querySelector(`.trip-events__list`);

    render(pointsListElement, createEventPointTemplate(events[i]), `beforeend`);
  }
} else {
  render(tripEventsElement, createEventFormTemplate(events[0]), `beforeend`);

  const eventFormElement = tripEventsElement.querySelector(`.event`);

  eventFormElement.classList.add(`trip-events__item`);
}
