import {getRandomInteger} from "../utils.js";
import {getRandomElement} from "../utils.js";

const TYPES = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];

const CITIES = [
  `Moscow`,
  `Saint-Petersburg`,
  `Kazan`,
  `Vladivostok`,
  `Ekaterinburg`
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const OfferPrice = {
  MIN: 10,
  MAX: 200
};

const Description = {
  MIN: 1,
  MAX: 1
};

const Photo = {
  MIN: 1,
  MAX: 3
};

const Time = {
  MIN: 1000 * 60 * 60,
  MAX: 1000 * 60 * 60 * 24 * 7
};

const PointPrice = {
  MIN: 20,
  MAX: 600
};

const Offer = {
  taxi: [
    {
      title: `Order Uber`,
      price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX)
    }
  ],
  flight: [
    {
      title: `Add luggage`,
      price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX)
    },
    {
      title: `Switch to comfort`,
      price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX)
    }
  ],
  drive: [
    {
      title: `Rent a car`,
      price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX)
    }
  ],
  check: [
    {
      title: `Add breakfast`,
      price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX)
    }
  ],
  sightseeing: [
    {
      title: `Book tickets`,
      price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX)
    },
    {
      title: `Lunch in city`,
      price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX)
    }
  ]
};

const generateType = () => {
  return getRandomElement(TYPES);
};

const generateCity = () => {
  return getRandomElement(CITIES);
};

const generateOffers = (type) => {
  let offers = [];

  type = type.toLowerCase().split(`-`)[0];

  if (Offer[type]) {
    const quantity = getRandomInteger(0, Offer[type].length);

    for (let i = 0; i < quantity; i++) {
      offers.push(Offer[type][i]);
    }
  }

  return offers;
};

const generateDescription = () => {
  let description = ``;
  const quantity = getRandomInteger(Description.MIN, Description.MAX);

  for (let i = 0; i < quantity; i++) {
    description += `${getRandomElement(DESCRIPTIONS)} `;
  }

  return description.slice(0, -1);
};

const generatePhotos = () => {
  let photos = [];
  const quantity = getRandomInteger(Photo.MIN, Photo.MAX);

  for (let i = 0; i < quantity; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};

const generateTime = () => {
  let start = new Date();
  let end = new Date();

  const setTime = (day) => {
    day.setTime(start.getTime() + getRandomInteger(Time.MIN, Time.MAX));
  };

  setTime(start);
  setTime(end);

  return {
    start,
    end
  };
};

const generatePrice = () => {
  return getRandomInteger(PointPrice.MIN, PointPrice.MAX);
};

export const generateEventPoint = () => {
  const type = generateType();

  return {
    type,
    city: generateCity(),
    offers: generateOffers(type),
    description: generateDescription(),
    photo: generatePhotos(),
    time: generateTime(),
    price: generatePrice()
  };
};
