import { startTransition, useEffect, useState } from 'react';
import { API_BASE_URL } from '../lib/ecoshore';

export function useEcoShoreData() {
  const [beaches, setBeaches] = useState([]);
  const [selectedBeachId, setSelectedBeachId] = useState(null);
  const [selectedBeach, setSelectedBeach] = useState(null);
  const [weather, setWeather] = useState(null);
  const [nearestBeaches, setNearestBeaches] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [beachesError, setBeachesError] = useState('');
  const [weatherError, setWeatherError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isLoadingBeaches, setIsLoadingBeaches] = useState(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingNearest, setIsLoadingNearest] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadBeaches() {
      setIsLoadingBeaches(true);
      setBeachesError('');

      try {
        const response = await fetch(`${API_BASE_URL}/beaches/`);

        if (!response.ok) {
          throw new Error('Unable to load beaches');
        }

        const data = await response.json();

        if (!ignore) {
          setBeaches(data);

          if (data.length > 0) {
            setSelectedBeachId((currentId) => currentId || data[0].id);
          }
        }
      } catch (error) {
        if (!ignore) {
          setBeachesError('The beach collection is not loading right now. Start the Django API and try again.');
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
    if (!selectedBeachId) {
      setSelectedBeach(null);
      return undefined;
    }

    const controller = new AbortController();

    async function loadBeachDetail() {
      try {
        const response = await fetch(`${API_BASE_URL}/beach/${selectedBeachId}/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Unable to load beach detail');
        }

        const data = await response.json();
        setSelectedBeach(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSelectedBeach(beaches.find((beach) => beach.id === selectedBeachId) || null);
        }
      }
    }

    loadBeachDetail();

    return () => {
      controller.abort();
    };
  }, [beaches, selectedBeachId]);

  useEffect(() => {
    if (
      !selectedBeach ||
      selectedBeach.latitude == null ||
      selectedBeach.longitude == null
    ) {
      setWeather(null);
      return undefined;
    }

    const controller = new AbortController();

    async function loadWeather() {
      setIsLoadingWeather(true);
      setWeatherError('');

      try {
        const response = await fetch(
          `${API_BASE_URL}/weather/?lat=${selectedBeach.latitude}&lon=${selectedBeach.longitude}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Unable to load weather');
        }

        const data = await response.json();
        setWeather(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setWeather(null);
          setWeatherError('Live conditions are temporarily unavailable.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingWeather(false);
        }
      }
    }

    loadWeather();

    return () => {
      controller.abort();
    };
  }, [selectedBeach]);

  async function loadNearestBeaches(latitude, longitude) {
    setIsLoadingNearest(true);
    setLocationError('');

    try {
      const response = await fetch(`${API_BASE_URL}/nearest-beaches/?lat=${latitude}&lon=${longitude}`);

      if (!response.ok) {
        throw new Error('Unable to load nearest beaches');
      }

      const data = await response.json();
      setNearestBeaches(data);
    } catch (error) {
      setLocationError('Nearest beach lookup is unavailable right now.');
      setNearestBeaches([]);
    } finally {
      setIsLoadingNearest(false);
    }
  }

  function handleLocateMe() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }

    setIsLoadingNearest(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setUserLocation(nextLocation);
        loadNearestBeaches(nextLocation.latitude, nextLocation.longitude);
      },
      () => {
        setIsLoadingNearest(false);
        setLocationError('Location access was blocked. Allow it to discover the nearest beaches.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  function selectBeach(beachId) {
    startTransition(() => {
      setSelectedBeachId(beachId);
    });
  }

  return {
    beaches,
    beachesError,
    handleLocateMe,
    isLoadingBeaches,
    isLoadingNearest,
    isLoadingWeather,
    loadNearestBeaches,
    locationError,
    nearestBeaches,
    selectedBeach,
    selectedBeachId,
    selectBeach,
    userLocation,
    weather,
    weatherError,
  };
}
