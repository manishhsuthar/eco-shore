const localApiBaseUrl =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `${window.location.protocol}//${window.location.hostname}:8000/api`
    : '/api';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || localApiBaseUrl;

export const pageLinks = [
  {
    path: '/',
    label: 'Lobby',
    title: 'Shoreline Lobby',
    eyebrow: 'Arrival lounge',
    description: 'A warm welcome with the featured coastline and fast entries into the rest of the beach experience.',
    preview: 'Start with the selected beach, live climate hints, and a breezy overview of the whole app.',
  },
  {
    path: '/atlas',
    label: 'Atlas',
    title: 'Beach Atlas',
    eyebrow: 'Card wall',
    description: 'An editorial wall for browsing every stored beach with filters, highlights, and a featured pick.',
    preview: 'Search the saved coastline collection and move through the catalog like a destination board.',
  },
  {
    path: '/conditions',
    label: 'Forecast',
    title: 'Forecast Deck',
    eyebrow: 'Weather room',
    description: 'A focused conditions page for the currently selected shoreline, blending weather and beach traits.',
    preview: 'View the weather dial, environmental badges, coordinates, and quick route into maps.',
  },
  {
    path: '/nearby',
    label: 'Nearby',
    title: 'Drift Finder',
    eyebrow: 'Compass mode',
    description: 'Use your location to surface the closest beaches and jump straight into their live conditions.',
    preview: 'Let the browser point you toward nearby shorelines and turn proximity into the main story.',
  },
  {
    path: '/pulse',
    label: 'Pulse',
    title: 'Tide Pulse',
    eyebrow: 'Data bulletin',
    description: 'A calmer analytical page that turns the backend dataset into beach quality, crowd, and region signals.',
    preview: 'Read the current beach inventory like a coastal bulletin instead of another list.',
  },
];

const validRouteSet = new Set(pageLinks.map((page) => page.path));

export const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light rain showers',
  81: 'Rain showers',
  82: 'Strong rain showers',
  85: 'Light snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm with hail',
};

export function normalizeRoute(hashValue = '') {
  const strippedValue = hashValue.replace(/^#/, '').trim();

  if (!strippedValue || strippedValue === '/') {
    return '/';
  }

  const route = strippedValue.startsWith('/') ? strippedValue : `/${strippedValue}`;

  return validRouteSet.has(route) ? route : '/';
}

export function formatNumber(value, digits = 2) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'Unknown';
  }

  return value.toFixed(digits);
}

export function formatLabel(value) {
  return value || 'Unknown';
}

export function formatObservationTime(value) {
  if (!value) {
    return 'Awaiting live weather';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function buildMapUrl(latitude, longitude) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

export function getWeatherDescription(weather) {
  return weatherCodeMap[weather?.current_weather?.weathercode] || 'Live update';
}

export function countByLabel(items, key) {
  const counts = {};

  items.forEach((item) => {
    const label = formatLabel(item[key]);
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([label, total]) => ({ label, total }))
    .sort((left, right) => right.total - left.total || left.label.localeCompare(right.label));
}

export function getTopStates(beaches, limit = 6) {
  const counts = {};

  beaches.forEach((beach) => {
    const label = formatLabel(beach.state);
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([label, total]) => ({ label, total }))
    .sort((left, right) => right.total - left.total || left.label.localeCompare(right.label))
    .slice(0, limit);
}
