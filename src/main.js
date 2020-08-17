import TripInfoView from "./view/trip-info.js";
import TripPriceView from "./view/trip-price.js";
import TitleH2View from "./view/title-h2.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import TripPresenter from "./presenter/trip.js";
import {generateEventPoint} from "./mock/event-point.js";
import {render, RenderPosition} from "./utils/render.js";

const EVENTS_COUNT = 25;

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

const events = new Array(EVENTS_COUNT).fill().map(generateEventPoint);
const sortEvents = events.sort((a, b) => a.time.start - b.time.start);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

render(tripMainElement, new TripInfoView(sortEvents), AFTERBEGIN);

const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);

render(tripInfoElement, new TripPriceView(sortEvents), BEFOREEND);

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
const tripPresenter = new TripPresenter(tripEventsElement);

tripPresenter.init(sortEvents);
