import SortView from "../view/sort.js";
import TripDaysView from "../view/trip-days.js";
import DayView from "../view/day.js";
import EventFormView from "../view/event-form.js";
import EventPointView from "../view/event-point.js";
import {render, RenderPosition, replace} from "../utils/render.js";
import {getUniqueDates} from "../utils/specific.js";

const {BEFOREEND} = RenderPosition;

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortComponent = new SortView();
    this._tripDaysComponent = new TripDaysView();
  }

  init(events) {
    this._events = events.slice();

    this._renderTrip();
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
    getUniqueDates(this._events).forEach((item, index) => {
      this._renderDay(item, index);
    });
  }

  _renderEvent(eventsListElement, event) {
    const eventComponent = new EventPointView(event);
    const eventEditComponent = new EventFormView(event);

    const replaceEventToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventEditComponent);
    };

    eventComponent.setEditClickHandler(() => {
      replaceEventToForm();
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceFormToEvent();
    });

    render(eventsListElement, eventComponent, RenderPosition.BEFOREEND);
  }

  _renderEvents() {
    this._events.forEach((item) => {
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
