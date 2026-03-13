import {
  buildMapUrl,
  formatLabel,
  formatNumber,
  formatObservationTime,
  getWeatherDescription,
} from '../lib/ecoshore';

function HomePage({
  beaches,
  nearestBeaches,
  onLocateMe,
  pageLinks,
  selectedBeach,
  userLocation,
  weather,
  navigate,
}) {
  const statesCovered = new Set(beaches.map((beach) => beach.state).filter(Boolean)).size;
  const weatherDetails = weather?.current_weather;
  const previewPages = pageLinks.filter((page) => page.path !== '/');
  const nearestPreview = nearestBeaches[0];

  return (
    <section className="page-stage home-stage">
      <section className="home-hero panel">
        <div className="home-copy">
          <p className="micro-label">Beachfront editorial</p>
          <h1>Swap the single screen for a whole shoreline journey.</h1>
          <p className="lead-text">
            The frontend now behaves more like a coastal magazine than a dashboard. Move from a relaxed
            arrival page into the atlas, the forecast deck, the compass-style nearby finder, and a data
            pulse page that turns the backend into a visual story.
          </p>

          <div className="button-row">
            <button className="sea-button" type="button" onClick={() => navigate('/atlas')}>
              Open beach atlas
            </button>
            <button className="sand-button" type="button" onClick={() => navigate('/conditions')}>
              Check forecast deck
            </button>
          </div>
        </div>

        <aside className="postcard-panel panel">
          <div className="postcard-badge" />
          <p className="micro-label">Featured shoreline</p>
          <h2>{selectedBeach?.name || 'Waiting for beach data'}</h2>
          <p className="muted-copy">
            {selectedBeach
              ? `${selectedBeach.city}, ${selectedBeach.state}`
              : 'Start the Django API to wake up the featured beach panel.'}
          </p>

          <div className="fact-grid">
            <article className="fact-card">
              <span>Water quality</span>
              <strong>{formatLabel(selectedBeach?.water_quality)}</strong>
            </article>
            <article className="fact-card">
              <span>Crowd density</span>
              <strong>{formatLabel(selectedBeach?.crowd_density)}</strong>
            </article>
            <article className="fact-card">
              <span>Conditions</span>
              <strong>{getWeatherDescription(weather)}</strong>
            </article>
            <article className="fact-card">
              <span>Observed</span>
              <strong>{formatObservationTime(weatherDetails?.time)}</strong>
            </article>
          </div>

          <div className="button-row">
            <button className="link-pill" type="button" onClick={() => navigate('/nearby')}>
              Find nearby beaches
            </button>
            {selectedBeach ? (
              <a
                className="link-pill"
                href={buildMapUrl(selectedBeach.latitude, selectedBeach.longitude)}
                rel="noreferrer"
                target="_blank"
              >
                Open in maps
              </a>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="glance-ribbon panel">
        <article className="glance-card">
          <span>Beaches tracked</span>
          <strong>{beaches.length}</strong>
        </article>
        <article className="glance-card">
          <span>States covered</span>
          <strong>{statesCovered}</strong>
        </article>
        <article className="glance-card">
          <span>Nearest preview</span>
          <strong>{nearestPreview ? `${nearestPreview.distance_km} km` : 'Ready'}</strong>
        </article>
        <article className="glance-card">
          <span>Location mode</span>
          <strong>{userLocation ? `${formatNumber(userLocation.latitude, 1)}°` : 'Off'}</strong>
        </article>
      </section>

      <div className="route-grid">
        {previewPages.map((page) => (
          <article key={page.path} className="route-card panel">
            <p className="micro-label">{page.eyebrow}</p>
            <h3>{page.title}</h3>
            <p className="muted-copy">{page.preview}</p>
            <div className="button-row">
              <button className="link-pill" type="button" onClick={() => navigate(page.path)}>
                Enter page
              </button>
              {page.path === '/nearby' ? (
                <button className="sand-button" type="button" onClick={onLocateMe}>
                  Use my location
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
