import TitleH2View from "./view/title-h2.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import {generateEventPoint} from "./mock/event-point.js";
import {render, RenderPosition} from "./utils/render.js";
import Api from "./api.js";

const EVENTS_COUNT = 25;
const AUTHORIZATION = `Basic aL2aw6dreVbgly7fr3a`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const {BEFOREEND} = RenderPosition;

const events = new Array(EVENTS_COUNT).fill().map(generateEventPoint);
const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();

eventsModel.setEvents(events);

const filterModel = new FilterModel();

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

const tripEventsElement = document.querySelector(`.trip-events`);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, eventsModel);
const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createEvent();
  });
