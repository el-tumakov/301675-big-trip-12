import TripInfoView from "../view/trip-info.js";
import TripPriceView from "../view/trip-price.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;
    this._tripPriceComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripInfo();
    this._renderTripPrice();
  }

  _handleModelEvent() {
    this.init();
  }

  _getEvents() {
    return this._eventsModel.getEvents().slice()
      .sort((a, b) => a.time.start - b.time.start);
  }

  _renderTripInfo() {
    const prevTripInfoComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoView(this._getEvents());

    if (prevTripInfoComponent === null) {
      render(this._tripInfoContainer, this._tripInfoComponent, AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  _renderTripPrice() {
    this._tripPriceComponent = new TripPriceView(this._getEvents());

    render(this._tripInfoComponent, this._tripPriceComponent, BEFOREEND);
  }
}
