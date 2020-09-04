import SiteMenuPresenter from "./presenter/site-menu.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationModel from "./model/destination.js";
import SiteMenuModel from "./model/site-menu.js";
import {UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic aL2aw6dreVbgly7fr3a`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const siteHeaderElement = document.querySelector(`.page-header`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationModel = new DestinationModel();
const siteMenuModel = new SiteMenuModel();

const siteMenuPresenter = new SiteMenuPresenter(tripControlsElement, siteMenuModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, eventsModel);
const tripPresenter = new TripPresenter(
    tripEventsElement,
    offersModel,
    eventsModel,
    filterModel,
    siteMenuModel,
    destinationModel,
    api
);

siteMenuPresenter.init();
filterPresenter.init();
tripPresenter.init();

api.getOffers()
  .then((offers) => {
    offersModel.setOffers(offers);
  })
  .then(() => {
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

api.getDestination()
  .then((destination) => {
    destinationModel.setDestination(destination);
  })
  .catch(() => {
    destinationModel.setDestination([]);
  });
