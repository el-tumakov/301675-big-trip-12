import SortView from "../view/sort.js";
import TripDaysView from "../view/trip-days.js";
import DayView from "../view/day.js";
import LoadingView from "../view/loading.js";
import TripInfoPresenter from "./trip-info.js";
import EventPointPresenter from "./event-point.js";
import EventNewPresenter from "./event-new.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {getUniqueDates, toISODate} from "../utils/specific.js";
import {filter} from "../utils/filter.js";
import {UserAction, UpdateType} from "../const.js";

const {BEFOREEND} = RenderPosition;

export default class Trip {
  constructor(tripContainer, offersModel, eventsModel, filterModel, api) {
    this._tripContainer = tripContainer;
    this._offersModel = offersModel;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._eventPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._sortComponent = new SortView();
    this._tripDaysComponent = new TripDaysView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._tripContainer, this._handleViewAction);
  }

  init() {
    this._renderTrip();
  }

  createEvent() {
    this._eventNewPresenter.init(this._eventsModel.getEvents(), this._getOffers());
  }

  _getOffers() {
    return this._offersModel.getOffers();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();

    const events = this._eventsModel.getEvents()
      .slice().sort((a, b) => a.time.start - b.time.start);

    const filtredEvents = filter[filterType](events);

    return filtredEvents;
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._api.updateEvent(update).then((response) => {
          this._eventsModel.updateEvent(updateType, response);
        });
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(this._eventsModel.getEvents(), data, this._getOffers());
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleEventChange(updatedEvent) {
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _renderTripInfo() {
    const tripMainElement = document.querySelector(`.trip-main`);
    const tripInfoPresenter = new TripInfoPresenter(tripMainElement);

    tripInfoPresenter.init(this._eventsModel.getEvents());
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, BEFOREEND);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, BEFOREEND);
  }

  _renderTripDays() {
    render(this._tripContainer, this._tripDaysComponent, BEFOREEND);
  }

  _renderDay(date, counter) {
    const dayComponent = new DayView(date, counter);

    render(this._tripDaysComponent, dayComponent, BEFOREEND);
  }

  _renderDays() {
    getUniqueDates(this._getEvents()).forEach((item, index) => {
      this._renderDay(item, index);
    });
  }

  _renderEvent(eventsListContainer, event) {
    const eventPresenter = new EventPointPresenter(eventsListContainer, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(this._eventsModel.getEvents(), event, this._getOffers());

    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._getEvents().forEach((item) => {
      const {time} = item;

      const timeISO = toISODate(time.start);
      const timeElement = this._tripContainer
        .querySelector(`.day__date[datetime="${timeISO}"]`);
      const dayElement = timeElement.closest(`.day`);
      const pointsListElement = dayElement.querySelector(`.trip-events__list`);

      this._renderEvent(pointsListElement, item);
    });
  }

  _clearTrip() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._tripDaysComponent);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();

      return;
    }

    this._renderTripInfo();
    this._renderSort();
    this._renderTripDays();
    this._renderDays();
    this._renderEvents();
  }
}
