import chart from "chart.js";
import chartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart.js";

const createStatsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Stats extends SmartView {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createStatsTemplate(this._events);
  }
}
