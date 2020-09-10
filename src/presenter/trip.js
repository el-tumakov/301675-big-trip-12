import NewEventBtnView from "../view/new-event-btn.js";
import StatsView from "../view/stats.js";
import SortView from "../view/sort.js";
import TripDaysView from "../view/trip-days.js";
import DayView from "../view/day.js";
import LoadingView from "../view/loading.js";
import NoEventView from "../view/no-event.js";
import TripInfoPresenter from "./trip-info.js";
import EventPresenter, {State as EventPresenterViewState} from "./event-point.js";
import EventNewPresenter from "./event-new.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {getUniqueDates} from "../utils/specific.js";
import {sortEventTime, sortEventPrice} from "../utils/event.js";
import {filter} from "../utils/filter.js";
import {SortType, UserAction, UpdateType, MenuItem, FilterType} from "../const.js";
import moment from "moment";

const {BEFOREEND} = RenderPosition;

export default class Trip {
  constructor(
      tripContainer,
      offersModel,
      eventsModel,
      filterModel,
      siteMenuModel,
      destinationModel,
      api
  ) {
    this._tripContainer = tripContainer;
    this._offersModel = offersModel;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._siteMenuModel = siteMenuModel;
    this._destinationModel = destinationModel;
    this._eventPresenter = {};
    this._tripInfoPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._sortComponent = null;
    this._statsComponent = null;

    this._sortComponent = new SortView();
    this._tripDaysComponent = new TripDaysView();
    this._loadingComponent = new LoadingView();
    this._noEventComponent = new NoEventView();
    this._newEventBtnComponent = new NewEventBtnView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleMenuModel = this._handleMenuModel.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._tripContainer, this._handleViewAction);

    this._siteMenuModel.addObserver(this._handleMenuModel);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);

    remove(this._tripDaysComponent);
  }

  createEvent() {
    this._clearTrip({resetSortType: true});

    if (this._getEvents().length !== 0) {
      this._renderSort();
    }

    this._eventNewPresenter.init(this._getDestination(), this._getOffers());

    this._renderTripDays();
    this._renderDays();
    this._renderEvents();
  }

  _getOffers() {
    return this._offersModel.getOffers();
  }

  _getDestination() {
    return this._destinationModel.getDestination();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();

    const events = this._eventsModel.getEvents();

    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredEvents.sort(sortEventTime);
      case SortType.PRICE:
        return filtredEvents.sort(sortEventPrice);
    }

    return filtredEvents;
  }

  _renderTripInfo() {
    const tripMainElement = document.querySelector(`.trip-main`);
    const tripInfoPresenter = new TripInfoPresenter(tripMainElement);

    this._tripInfoPresenter = tripInfoPresenter;

    tripInfoPresenter.init(this._eventsModel.getEvents());
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, BEFOREEND);
  }

  _renderNoEvent() {
    render(this._tripContainer, this._noEventComponent, BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, BEFOREEND);
  }

  _renderTripDays() {
    render(this._tripContainer, this._tripDaysComponent, BEFOREEND);
  }

  _renderDay(date, counter, sortType) {
    const dayComponent = new DayView(date, counter, sortType);
    render(this._tripDaysComponent, dayComponent, BEFOREEND);
  }

  _renderDays() {
    getUniqueDates(this._getEvents()).forEach((item, index) => {
      this._renderDay(item, index, this._currentSortType);
    });
  }

  _renderEvent(eventsListContainer, event) {
    const eventPresenter = new EventPresenter(eventsListContainer, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(this._getDestination(), event, this._getOffers());

    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._getEvents().forEach((item) => {
      let pointsListElement = document.querySelector(`.trip-events__list`);

      if (this._currentSortType === SortType.DEFAULT) {
        const {time} = item;
        const timeISO = moment(time.start).format(`YYYY-MM-DD`);
        const timeElement = this._tripContainer
          .querySelector(`.day__date[datetime="${timeISO}"]`);
        const dayElement = timeElement.closest(`.day`);

        pointsListElement = dayElement.querySelector(`.trip-events__list`);
      }

      this._renderEvent(pointsListElement, item);
    });
  }

  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._noEventComponent);
    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._tripDaysComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderTripInfo();
      this._renderLoading();
      this._newEventBtnComponent.getElement().disabled = true;

      return;
    }

    const events = this._getEvents();
    const eventsCount = events.length;

    if (eventsCount === 0) {
      this._renderNoEvent();

      return;
    }

    this._renderSort();
    this._renderTripDays();
    this._renderDays();
    this._renderEvents();
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
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);

            if (this._getEvents().length === 0) {
              this._filterModel.resetFilter(UpdateType.MAJOR);
            }
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);

            if (this._getEvents().length === 0) {
              this._filterModel.resetFilter(UpdateType.MAJOR);
            }
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, event) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripInfoPresenter.destroy();
        this._renderTripInfo();
        this._eventPresenter[event.id].init(this._getDestination(), event, this._getOffers());
        break;
      case UpdateType.MINOR:
        this._tripInfoPresenter.destroy();
        this._renderTripInfo();
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._tripInfoPresenter.destroy();
        this._renderTripInfo();
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._newEventBtnComponent.getElement().disabled = false;
        this._tripInfoPresenter.destroy();
        remove(this._loadingComponent);
        this._currentSortType = SortType.DEFAULT;
        this._renderTripInfo();
        this._renderTrip();
        break;
    }
  }

  _handleMenuModel(menuItem) {
    switch (menuItem) {
      case MenuItem.TABLE:
        if (this._statsComponent) {
          const pageBodyElement = document.querySelector(`.page-body__container--no-strip`);
          pageBodyElement.classList.remove(`page-body__container--no-strip`);
          this.destroy();
          this.init();
          remove(this._statsComponent);
        }
        break;
      case MenuItem.STATS:
        const pageMainElement = document.querySelector(`.page-main`);
        const pageBodyElement = pageMainElement.querySelector(`.page-body__container`);
        pageBodyElement.classList.add(`page-body__container--no-strip`);
        this.destroy();
        this._statsComponent = new StatsView(this._eventsModel.getEvents());
        render(pageBodyElement, this._statsComponent, BEFOREEND);
        this._statsComponent.init();
        break;
      case MenuItem.NEW_EVENT:
        this._siteMenuModel.setMenuItem(MenuItem.TABLE);
        this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        this.createEvent();
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
}
