import { useEffect, useMemo, useState } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';

type Beach = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  water_quality: string;
  crowd_density: string;
  distance_km?: number;
};

type WeatherResponse = {
  current_weather?: {
    temperature?: number;
    windspeed?: number;
    weathercode?: number;
    time?: string;
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const weatherCodeMap: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Light snow',
  80: 'Rain showers',
  95: 'Thunderstorm',
};

function formatWeatherLabel(code?: number): string {
  if (typeof code !== 'number') {
    return 'Live update';
  }
  return weatherCodeMap[code] ?? 'Live update';
}

function toMapUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

function App() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [nearestBeaches, setNearestBeaches] = useState<Beach[]>([]);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
  const [isLoadingBeaches, setIsLoadingBeaches] = useState(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingNearest, setIsLoadingNearest] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadBeaches() {
      setIsLoadingBeaches(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/beaches/`);
        if (!response.ok) {
          throw new Error('Failed to fetch beaches');
        }
        const data = (await response.json()) as Beach[];
        if (!ignore) {
          setBeaches(data);
          setSelectedBeach(data[0] ?? null);
        }
      } catch {
        if (!ignore) {
          setError('Could not load beach data from backend.');
        }
      } finally {
        if (!ignore) {
          setIsLoadingBeaches(false);
        }
      }
    }

    loadBeaches();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedBeach) {
      setWeather(null);
      return;
    }

    const controller = new AbortController();

    async function loadWeather() {
      setIsLoadingWeather(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/weather/?lat=${selectedBeach.latitude}&lon=${selectedBeach.longitude}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather');
        }
        const data = (await response.json()) as WeatherResponse;
        setWeather(data);
      } catch {
        if (!controller.signal.aborted) {
          setWeather(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingWeather(false);
        }
      }
    }

    loadWeather();

    return () => controller.abort();
  }, [selectedBeach]);

  async function handleFindNearest() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }

    setIsLoadingNearest(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `${API_BASE_URL}/nearest-beaches/?lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) {
            throw new Error('Failed to load nearest beaches');
          }
          const data = (await response.json()) as Beach[];
          setNearestBeaches(data);
        } catch {
          setNearestBeaches([]);
          setLocationError('Nearest beach lookup is unavailable right now.');
        } finally {
          setIsLoadingNearest(false);
        }
      },
      () => {
        setIsLoadingNearest(false);
        setLocationError('Location access denied. Allow it to view nearby beaches.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const stats = useMemo(() => {
    const states = new Set(beaches.map((beach) => beach.state)).size;
    const excellentWater = beaches.filter((beach) =>
      beach.water_quality.toLowerCase().includes('excellent')
    ).length;
    const lowCrowd = beaches.filter((beach) =>
      beach.crowd_density.toLowerCase().includes('low')
    ).length;

    return {
      totalBeaches: beaches.length,
      statesCovered: states,
      excellentWater,
      lowCrowd,
    };
  }, [beaches]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-amber-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <h1 className="text-lg font-bold sm:text-2xl">Ecoshore 50</h1>
          <a
            href="#nearby"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Find Nearby
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 px-4 py-20 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-100">Smart coastal companion</p>
          <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            New Ecoshore frontend is now connected to live backend data
          </h2>
          <p className="mt-6 max-w-2xl text-base text-cyan-50 sm:text-lg">
            Browse beaches, check conditions, and discover nearby coastlines in one place.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {error ? (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Beaches', value: stats.totalBeaches, icon: Waves },
            { label: 'States', value: stats.statesCovered, icon: MapPin },
            { label: 'Excellent Water', value: stats.excellentWater, icon: Compass },
            { label: 'Low Crowd', value: stats.lowCrowd, icon: Navigation },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <item.icon className="mb-3 h-6 w-6 text-sky-600" />
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <h3 className="text-xl font-bold text-slate-900">Featured Beach</h3>
            {isLoadingBeaches ? <p className="mt-4 text-slate-500">Loading beaches...</p> : null}
            {selectedBeach ? (
              <div className="mt-4 space-y-3">
                <p className="text-2xl font-semibold">{selectedBeach.name}</p>
                <p className="text-slate-600">
                  {selectedBeach.city}, {selectedBeach.state}
                </p>
                <p className="text-sm text-slate-500">
                  Water quality: <span className="font-semibold">{selectedBeach.water_quality}</span> | Crowd:{' '}
                  <span className="font-semibold">{selectedBeach.crowd_density}</span>
                </p>
                <a
                  href={toMapUrl(selectedBeach.latitude, selectedBeach.longitude)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Maps
                </a>
              </div>
            ) : (
              !isLoadingBeaches && <p className="mt-4 text-slate-500">No beach data available.</p>
            )}
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <h3 className="text-xl font-bold text-slate-900">Live Conditions</h3>
            {isLoadingWeather ? <p className="mt-4 text-slate-500">Loading weather...</p> : null}
            {!isLoadingWeather && weather?.current_weather ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-sky-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Thermometer className="h-4 w-4 text-sky-600" />
                    Temperature
                  </div>
                  <p className="mt-1 text-2xl font-bold">{weather.current_weather.temperature ?? '--'} °C</p>
                </div>
                <div className="rounded-xl bg-cyan-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Wind className="h-4 w-4 text-cyan-600" />
                    Wind
                  </div>
                  <p className="mt-1 text-2xl font-bold">{weather.current_weather.windspeed ?? '--'} km/h</p>
                </div>
                <div className="sm:col-span-2 rounded-xl bg-amber-50 p-4">
                  <p className="text-sm text-slate-500">Condition</p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatWeatherLabel(weather.current_weather.weathercode)}
                  </p>
                </div>
              </div>
            ) : (
              !isLoadingWeather && <p className="mt-4 text-slate-500">Weather data unavailable.</p>
            )}
          </article>
        </section>

        <section id="nearby" className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-slate-900">Nearest Beaches</h3>
            <button
              type="button"
              onClick={handleFindNearest}
              className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white transition hover:from-sky-600 hover:to-cyan-600"
            >
              {isLoadingNearest ? 'Locating...' : 'Use My Location'}
            </button>
          </div>
          {locationError ? <p className="mt-4 text-sm text-rose-600">{locationError}</p> : null}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {nearestBeaches.map((beach) => (
              <article key={beach.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{beach.name}</p>
                <p className="text-sm text-slate-600">
                  {beach.city}, {beach.state}
                </p>
                <p className="mt-2 text-sm text-slate-500">Distance: {beach.distance_km ?? '--'} km</p>
              </article>
            ))}
            {!nearestBeaches.length && !isLoadingNearest ? (
              <p className="text-slate-500">Tap "Use My Location" to load closest beaches.</p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
