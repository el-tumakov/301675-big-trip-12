import TripInfoView from "../view/trip-info.js";
import TripPriceView from "../view/trip-price.js";
import {render, RenderPosition} from "../utils/render.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._eventsModel = eventsModel;
  }

  init() {
    this._renderTripInfo();
    this._renderTripPrice();
  }

  _getEvents() {
    return this._eventsModel.getEvents().slice()
      .sort((a, b) => a.time.start - b.time.start);
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._getEvents());

    render(this._tripInfoContainer, this._tripInfoComponent, AFTERBEGIN);
  }

  _renderTripPrice() {
    this._tripPriceComponent = new TripPriceView(this._getEvents());

    render(this._tripInfoComponent, this._tripPriceComponent, BEFOREEND);
  }
}
