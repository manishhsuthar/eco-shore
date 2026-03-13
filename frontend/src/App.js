import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import './App.css';
import { useEcoShoreData } from './hooks/useEcoShoreData';
import { normalizeRoute, pageLinks } from './lib/ecoshore';
import AtlasPage from './pages/AtlasPage';
import ConditionsPage from './pages/ConditionsPage';
import HomePage from './pages/HomePage';
import NearbyPage from './pages/NearbyPage';
import PulsePage from './pages/PulsePage';

function readRoute() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return normalizeRoute(window.location.hash);
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const {
    beaches,
    beachesError,
    isLoadingBeaches,
    isLoadingNearest,
    isLoadingWeather,
    locationError,
    nearestBeaches,
    weather,
    weatherError,
    selectedBeach,
    selectedBeachId,
    selectBeach,
    handleLocateMe,
    userLocation,
  } = useEcoShoreData();

  useEffect(() => {
    function syncRoute() {
      startTransition(() => {
        setRoute(readRoute());
      });
    }

    window.addEventListener('hashchange', syncRoute);

    return () => {
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  useEffect(() => {
    const activePage = pageLinks.find((page) => page.path === route) || pageLinks[0];
    document.title = `Ecoshore | ${activePage.title}`;

    if (typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    }
  }, [route]);

  const filteredBeaches = beaches.filter((beach) => {
    const haystack = `${beach.name} ${beach.city} ${beach.state}`.toLowerCase();
    return haystack.includes(deferredSearchTerm.toLowerCase());
  });

  function navigate(nextRoute) {
    const normalizedRoute = normalizeRoute(nextRoute);
    const nextHash = `#${normalizedRoute}`;

    if (window.location.hash !== nextHash) {
      window.location.hash = normalizedRoute;
      return;
    }

    startTransition(() => {
      setRoute(normalizedRoute);
    });
  }

  function handleLinkClick(event, nextRoute) {
    event.preventDefault();
    navigate(nextRoute);
  }

  function handleSelectBeach(beachId) {
    selectBeach(beachId);
  }

  let pageContent = (
    <HomePage
      beaches={beaches}
      nearestBeaches={nearestBeaches}
      onLocateMe={handleLocateMe}
      pageLinks={pageLinks}
      selectedBeach={selectedBeach}
      userLocation={userLocation}
      weather={weather}
      navigate={navigate}
    />
  );

  if (route === '/atlas') {
    pageContent = (
      <AtlasPage
        beaches={beaches}
        beachesError={beachesError}
        filteredBeaches={filteredBeaches}
        isLoadingBeaches={isLoadingBeaches}
        navigate={navigate}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        selectBeach={handleSelectBeach}
        selectedBeach={selectedBeach}
        selectedBeachId={selectedBeachId}
      />
    );
  }

  if (route === '/conditions') {
    pageContent = (
      <ConditionsPage
        beaches={beaches}
        isLoadingWeather={isLoadingWeather}
        navigate={navigate}
        selectBeach={handleSelectBeach}
        selectedBeach={selectedBeach}
        selectedBeachId={selectedBeachId}
        weather={weather}
        weatherError={weatherError}
      />
    );
  }

  if (route === '/nearby') {
    pageContent = (
      <NearbyPage
        isLoadingNearest={isLoadingNearest}
        locationError={locationError}
        nearestBeaches={nearestBeaches}
        onLocateMe={handleLocateMe}
        selectBeach={handleSelectBeach}
        userLocation={userLocation}
        navigate={navigate}
      />
    );
  }

  if (route === '/pulse') {
    pageContent = (
      <PulsePage
        beaches={beaches}
        beachesError={beachesError}
        isLoadingBeaches={isLoadingBeaches}
        navigate={navigate}
        selectedBeach={selectedBeach}
      />
    );
  }

  return (
    <div className="app-shell">
      <div className="shell-backdrop">
        <div className="sun-glow sun-glow-a" />
        <div className="sun-glow sun-glow-b" />
        <div className="wave-band wave-band-top" />
        <div className="wave-band wave-band-bottom" />
      </div>

      <header className="shell-header">
        <div className="shell-header-inner">
          <a className="brand" href="#/" onClick={(event) => handleLinkClick(event, '/')}>
            <span className="brand-mark">E</span>
            <span className="brand-copy">
              <strong>Ecoshore</strong>
              <small>Beachfront pages</small>
            </span>
          </a>

          <nav aria-label="Primary" className="main-nav">
            {pageLinks.map((page) => (
              <a
                key={page.path}
                className={`nav-link ${route === page.path ? 'active' : ''}`}
                href={`#${page.path}`}
                onClick={(event) => handleLinkClick(event, page.path)}
              >
                {page.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="shell-main">
        <div key={route} className="page-wrap">
          {pageContent}
        </div>
      </main>

      <footer className="shell-footer">
        <p>Multi-page coastal experience built around your Django API.</p>
        <p>Shorelines, live conditions, proximity search, and beach data pulse in one flow.</p>
      </footer>
    </div>
  );
}

export default App;
