import SortView from "../view/sort.js";
import TripDaysView from "../view/trip-days.js";
import DayView from "../view/day.js";
import EventPointPresenter from "./event-point.js";
import {render, RenderPosition} from "../utils/render.js";
import {getUniqueDates} from "../utils/specific.js";

const {BEFOREEND} = RenderPosition;

export default class Trip {
  constructor(tripContainer, eventsModel) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._eventPresenter = {};

    this._sortComponent = new SortView();
    this._tripDaysComponent = new TripDaysView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init() {
    this._renderTrip();
  }

  _getEvents() {
    return this._eventsModel.getEvents().slice()
      .sort((a, b) => a.time.start - b.time.start);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
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
    const eventPresenter = new EventPointPresenter(eventsListContainer, this._handleEventChange, this._handleModeChange);

    eventPresenter.init(event);

    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._getEvents().forEach((item) => {
      const {time} = item;

      const timeISO = time.start.toISOString().slice(0, -14);
      const timeElement = this._tripContainer
        .querySelector(`.day__date[datetime="${timeISO}"]`);
      const dayElement = timeElement.closest(`.day`);
      const pointsListElement = dayElement.querySelector(`.trip-events__list`);

      this._renderEvent(pointsListElement, item);
    });
  }

  _renderTrip() {
    this._renderSort();
    this._renderTripDays();
    this._renderDays();
    this._renderEvents();
  }
}
