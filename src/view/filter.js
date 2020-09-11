import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, curentFilterType, emptyFilters) => {
  const {type} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === curentFilterType ? `checked` : ``}
        ${emptyFilters.includes(type) ? `disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType, emptyFilters) => {
  const filterItemTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType, emptyFilters))
    .join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType, emptyFilters) {
    super();
    this._title = `Filter events`;
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._emptyFilters = emptyFilters;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter, this._emptyFilters);
  }

  getTitle() {
    return this._title;
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
