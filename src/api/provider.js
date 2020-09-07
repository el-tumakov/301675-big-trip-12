import {nanoid} from "nanoid";
import EventsModel from "../model/events.js";

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.event);
};

const createStoreStructure = (items, isEvents) => {
  return items.reduce((acc, current) => {
    if (isEvents) {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }
    return items;
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers);
          this._store.setOfferItems(items);
          return offers;
        });
    }
    const storeOffers = Object.values(this._store.getOfferItems());

    return Promise.resolve(storeOffers.slice());
  }

  getDestination() {
    if (Provider.isOnline()) {
      return this._api.getDestination()
        .then((destination) => {
          const items = createStoreStructure(destination);
          this._store.setDestinationItems(items);
          return destination;
        });
    }

    const storeDestination = Object.values(this._store.getDestinationItems());

    return Promise.resolve(storeDestination.slice());
  }

  getEvents() {
    if (Provider.isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventsModel.adaptToServer), true);
          this._store.setEventItems(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._store.getEventItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  updateEvent(event) {
    if (Provider.isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._store.setEventItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setEventItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (Provider.isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setEventItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, event, {id: localNewEventId});

    this._store.setEventItem(localNewEvent.id, EventsModel.adaptToServer(localNewEvent));

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(event) {
    if (Provider.isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeItem(event.id));
    }

    this._store.removeItem(event.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeEvents = Object.values(this._store.getEventItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setEventItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
