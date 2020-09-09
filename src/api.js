import EventsModel from "./model/events.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

const SuccessHTTPStatusRange = {
  OK: 200
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON)
      .then((offers) => offers.slice());
  }

  getEvents() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((events) => events.map(EventsModel.adaptToClient));
  }

  getDestination() {
    return this._load({url: `destinations`})
      .then(Api.toJSON)
      .then((destination) => destination.slice());
  }

  updateEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status !== SuccessHTTPStatusRange.OK) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
