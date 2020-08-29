import TripInfoView from "../view/trip-info.js";
import TripPriceView from "../view/trip-price.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

export default class TripInfo {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;

    this._tripInfoComponent = null;
    this._tripPriceComponent = null;
  }

  init(events) {
    this._renderTripInfo(events);
    this._renderTripPrice(events);
  }

  _renderTripInfo(events) {
    const prevTripInfoComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoView(events);

    if (prevTripInfoComponent === null) {
      render(this._tripInfoContainer, this._tripInfoComponent, AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  _renderTripPrice(events) {
    this._tripPriceComponent = new TripPriceView(events);

    render(this._tripInfoComponent, this._tripPriceComponent, BEFOREEND);
  }
}
