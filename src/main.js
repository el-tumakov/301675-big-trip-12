import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripPriceTemplate} from "./view/trip-price.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createDayTemplate} from "./view/day.js";
import {createEventFormTemplate} from "./view/event-form.js";
import {createEventPointTemplate} from "./view/event-point.js";
import {generateEventPoint} from "./mock/event-point.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const EVENTS_COUNT = 25;

const events = new Array(EVENTS_COUNT).fill().map(generateEventPoint);
const sortEvents = events.sort((a, b) => a.time.start - b.time.start);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

renderTemplate(tripMainElement, createTripInfoTemplate(sortEvents), `afterbegin`);

const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);

renderTemplate(tripInfoElement, createTripPriceTemplate(sortEvents), `beforeend`);

const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

renderTemplate(tripControlsElement, createSiteMenuTemplate(), `beforeend`);
renderTemplate(tripControlsElement, createFilterTemplate(), `beforeend`);

const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

renderTemplate(tripEventsElement, createSortTemplate(), `beforeend`);

const tripDaysElement = mainElement.querySelector(`.trip-days`);

renderTemplate(tripDaysElement, createDayTemplate(sortEvents), `beforeend`);

const eventsListElement = mainElement.querySelector(`.trip-events__list`);

renderTemplate(eventsListElement, createEventFormTemplate(events[0]), `beforeend`);

for (let i = 1; i < EVENTS_COUNT; i++) {
  const {time} = events[i];
  const timeISO = time.start.toISOString().slice(0, -14);
  const timeElement = tripDaysElement
    .querySelector(`.day .day__date[datetime="${timeISO}"]`);
  const dayElement = timeElement.closest(`.day`);
  const pointsListElement = dayElement.querySelector(`.trip-events__list`);

  renderTemplate(pointsListElement, createEventPointTemplate(events[i]), `beforeend`);
}
