import TitleH2View from "../view/title-h2.js";
import FilterView from "../view/filter.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, UpdateType} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const events = this._eventsModel.getEvents();
    const emptyFilters = [];
    const prevFilterComponent = this._filterComponent;
    this._currentFilter = this._filterModel.getFilter();

    for (let i = 1; i < filters.length; i++) {
      const filtredEvents = filter[filters[i].type](events);

      if (filtredEvents.length === 0) {
        emptyFilters.push(filters[i].type);
      }
    }

    this._filterComponent = new FilterView(filters, this._currentFilter, emptyFilters);
    this._filterTitleComponent = new TitleH2View(this._filterComponent.getTitle());

    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterTitleComponent, RenderPosition.BEFOREEND);
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
      },
      {
        type: FilterType.PAST,
      },
      {
        type: FilterType.FUTURE,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
