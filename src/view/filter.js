import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, curentFilterType) => {
  const {type} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === curentFilterType ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._title = `Filter events`;
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
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
