import TripInfoView from "./view/trip-info.js";
import TripPriceView from "./view/trip-price.js";
import TitleH2View from "./view/title-h2.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import TripDaysView from "./view/trip-days.js";
import DayView from "./view/day.js";
import EventFormView from "./view/event-form.js";
import EventPointView from "./view/event-point.js";
import {generateEventPoint} from "./mock/event-point.js";
import {renderElement, RenderPosition, getUniqueDates} from "./utils.js";

const EVENTS_COUNT = 25;

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

const events = new Array(EVENTS_COUNT).fill().map(generateEventPoint);
const sortEvents = events.sort((a, b) => a.time.start - b.time.start);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

renderElement(tripMainElement, new TripInfoView(sortEvents).getElement(), AFTERBEGIN);

const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);

renderElement(tripInfoElement, new TripPriceView(sortEvents).getElement(), BEFOREEND);

const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

renderElement(
    tripControlsElement,
    new TitleH2View().getElement(
        new SiteMenuView().getTitle()
    ),
    BEFOREEND
);
renderElement(tripControlsElement, new SiteMenuView().getElement(), BEFOREEND);

renderElement(
    tripControlsElement,
    new TitleH2View().getElement(
        new FilterView().getTitle()
    ),
    BEFOREEND
);
renderElement(tripControlsElement, new FilterView().getElement(), BEFOREEND);

const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

renderElement(tripEventsElement, new SortView().getElement(), BEFOREEND);
renderElement(tripEventsElement, new TripDaysView().getElement(), BEFOREEND);

const tripDaysElement = mainElement.querySelector(`.trip-days`);

getUniqueDates(events).forEach((item, index) => {
  renderElement(tripDaysElement, new DayView(item, index).getElement(), BEFOREEND);
});

const eventsListElement = mainElement.querySelector(`.trip-events__list`);

renderElement(eventsListElement, new EventFormView(events[0]).getElement(), BEFOREEND);

for (let i = 1; i < EVENTS_COUNT; i++) {
  const {time} = events[i];
  const timeISO = time.start.toISOString().slice(0, -14);
  const timeElement = tripDaysElement
    .querySelector(`.day .day__date[datetime="${timeISO}"]`);
  const dayElement = timeElement.closest(`.day`);
  const pointsListElement = dayElement.querySelector(`.trip-events__list`);

  renderElement(pointsListElement, new EventPointView(events[i]).getElement(), BEFOREEND);
}
