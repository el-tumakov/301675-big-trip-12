import TitleH2View from "./view/title-h2.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import {render, RenderPosition} from "./utils/render.js";
import {UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic aL2aw6dreVbgly7fr3a`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const {BEFOREEND} = RenderPosition;

const siteHeaderElement = document.querySelector(`.page-header`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

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

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();

const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, eventsModel);
const tripPresenter = new TripPresenter(tripEventsElement, offersModel, eventsModel, filterModel);

filterPresenter.init();
tripPresenter.init();

api.getOffers()
  .then((offers) => {
    offersModel.setOffers(offers);

    api.getEvents()
      .then((events) => {
        eventsModel.setEvents(UpdateType.INIT, events);
      })
      .catch(() => {
        eventsModel.setEvents(UpdateType.INIT, []);
      });
  })
  .catch(() => {
    offersModel.setOffers([]);
  });

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createEvent();
  });
