import TitleH2View from "./view/title-h2.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import {generateEventPoint} from "./mock/event-point.js";
import {render, RenderPosition} from "./utils/render.js";

const EVENTS_COUNT = 25;

const {BEFOREEND} = RenderPosition;

const events = new Array(EVENTS_COUNT).fill().map(generateEventPoint);
const eventsModel = new EventsModel();

eventsModel.setEvents(events);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);

tripInfoPresenter.init();

const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

render(
    tripControlsElement,
    new TitleH2View(new SiteMenuView().getTitle()),
    BEFOREEND
);
render(tripControlsElement, new SiteMenuView(), BEFOREEND);

render(
    tripControlsElement,
    new TitleH2View(new FilterView().getTitle()),
    BEFOREEND
);
render(tripControlsElement, new FilterView(), BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventsElement, eventsModel);

tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createEvent();
  });
