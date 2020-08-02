import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripPriceTemplate} from "./view/trip-price.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createDayTemplate} from "./view/day.js";
import {createEventFormTemplate} from "./view/event-form.js";
import {createEventPointTemplate} from "./view/event-point.js";

const EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripPriceTemplate(), `beforeend`);

const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const menuTitleElement = tripControlsElement.querySelector(`h2`);

render(menuTitleElement, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate(), `beforeend`);

const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

render(tripEventsElement, createSortTemplate(), `beforeend`);

const tripDaysElement = mainElement.querySelector(`.trip-days`);

render(tripDaysElement, createDayTemplate(), `beforeend`);

const eventsListElement = mainElement.querySelector(`.trip-events__list`);

render(eventsListElement, createEventFormTemplate(), `beforeend`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(eventsListElement, createEventPointTemplate(), `beforeend`);
}
