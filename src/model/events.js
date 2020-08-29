import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          city: event.destination.name,
          description: event.destination.description,
          photo: event.destination.pictures,
          time: {
            start: event.date_from,
            end: event.date_to
          },
          price: event.base_price,
          isFavorite: event.is_favorite
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.destination;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          "base_price": event.price,
          "date_from": event.time.start,
          "date_to": event.time.end,
          "destination": {
            "description": event.description,
            "name": event.city,
            "pictures": event.photo
          },
          "is_favorite": event.isFavorite
        }
    );

    delete adaptedEvent.city;
    delete adaptedEvent.description;
    delete adaptedEvent.photo;
    delete adaptedEvent.time;
    delete adaptedEvent.price;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
