import SiteMenuPresenter from "./presenter/site-menu.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationModel from "./model/destination.js";
import SiteMenuModel from "./model/site-menu.js";
import {UpdateType} from "./const.js";
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic aL2aw6dreVbg7fr3a`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `301675-bigtrip-localstorage`;
const STORE_VER = `v12`;

const StoreType = {
  EVENTS: `events`,
  OFFERS: `offers`,
  DESTINATION: `destination`
};

const STORE_EVENTS = `${STORE_PREFIX}-${StoreType.EVENTS}-${STORE_VER}`;
const STORE_OFFERS = `${STORE_PREFIX}-${StoreType.OFFERS}-${STORE_VER}`;
const STORE_DESTINATION = `${STORE_PREFIX}-${StoreType.DESTINATION}-${STORE_VER}`;

const siteHeaderElement = document.querySelector(`.page-header`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const storeEvents = new Store(STORE_EVENTS, window.localStorage);
const storeOffers = new Store(STORE_OFFERS, window.localStorage);
const storeDestination = new Store(STORE_DESTINATION, window.localStorage);

const apiEventsWithProvider = new Provider(api, storeEvents);
const apiOffersWithProvider = new Provider(api, storeOffers);
const apiDestinationWithProvider = new Provider(api, storeDestination);

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
    apiEventsWithProvider
);

siteMenuPresenter.init();
filterPresenter.init();
tripPresenter.init();

apiOffersWithProvider.getOffers()
  .then((offers) => {
    offersModel.setOffers(offers);
  })
  .then(() => {
    apiEventsWithProvider.getEvents()
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

apiDestinationWithProvider.getDestination()
  .then((destination) => {
    destinationModel.setDestination(destination);
  })
  .catch(() => {
    destinationModel.setDestination([]);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiEventsWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
