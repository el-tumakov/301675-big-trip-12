import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart.js";
import {getMoney, getTransport, getTime} from "../utils/stats.js";
import {TRIP_TYPES, STOP_TYPES} from "../const.js";

const BAR_HEIGHT = 55;
const TRIP_LABELS = [
  `🚕 TAXI`,
  `🚌 BUS`,
  `🚂 TRAIN`,
  `🛳 SHIP`,
  `🚊 TRANSPORT`,
  `🚗 DRIVE`,
  `✈️ FLIGHT`
];
const STOP_LABELS = [
  `🏨 CHECK-IN`,
  `🏛 SIGHTSEEING`,
  `🍴 RESTAURANT`
];
const LABELS = [
  ...TRIP_LABELS,
  ...STOP_LABELS
];
const TYPES = [
  ...TRIP_TYPES,
  ...STOP_TYPES
];


const renderMoneyChart = (moneyCtx, events) => {
  const moneyData = [];

  TYPES.forEach((item) => {
    return moneyData.push(getMoney(events, item));
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: LABELS,
      datasets: [{
        data: moneyData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, events) => {
  const transportData = [];

  TRIP_TYPES.forEach((item) => {
    return transportData.push(getTransport(events, item));
  });

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: TRIP_LABELS,
      datasets: [{
        data: transportData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpendChart = (timeSpendCtx, events) => {
  const timeSpendData = [];

  TYPES.forEach((item) => {
    return timeSpendData.push(getTime(events, item));
  });

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: LABELS,
      datasets: [{
        data: timeSpendData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

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
  constructor(statsContainer, events) {
    super();

    this._statsContainer = statsContainer;
    this._events = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
  }

  init() {
    this._removeStripe();
    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate(this._events);
  }

  destroy() {
    this.getElement().remove();
    this._addStripe();
  }

  _addStripe() {
    this._statsContainer.classList.remove(`page-body__container--no-strip`);
  }

  _removeStripe() {
    this._statsContainer.classList.add(`page-body__container--no-strip`);
  }

  _setCharts() {
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const transportCtx = document.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = document.querySelector(`.statistics__chart--time`);

    moneyCtx.height = BAR_HEIGHT * TYPES.length;
    transportCtx.height = BAR_HEIGHT * TRIP_TYPES.length;
    timeSpendCtx.height = BAR_HEIGHT * TYPES.length;

    this._moneyChart = renderMoneyChart(moneyCtx, this._events);
    this._transportChart = renderTransportChart(transportCtx, this._events);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._events);
  }
}
