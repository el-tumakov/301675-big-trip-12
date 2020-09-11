import TripInfoView from "../view/trip-info.js";
import TripPriceView from "../view/trip-price.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

export default class TripInfo {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;

    this._tripInfoComponent = null;
  }

  init(events) {
    this._renderTripInfo(events);
    this._renderTripPrice(events);
  }

  destroy() {
    remove(this._tripInfoComponent);
  }

  _renderTripInfo(events) {
    this._tripInfoComponent = new TripInfoView(events);

    render(this._tripInfoContainer, this._tripInfoComponent, AFTERBEGIN);
  }

  _renderTripPrice(events) {
    this._tripPriceComponent = new TripPriceView(events);

    render(this._tripInfoComponent, this._tripPriceComponent, BEFOREEND);
  }
}
