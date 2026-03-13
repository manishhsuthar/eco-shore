import { formatLabel, formatNumber } from '../lib/ecoshore';

function NearbyPage({
  isLoadingNearest,
  locationError,
  nearestBeaches,
  onLocateMe,
  selectBeach,
  userLocation,
  navigate,
}) {
  function handleSelectNearby(beachId) {
    selectBeach(beachId);
    navigate('/conditions');
  }

  return (
    <section className="page-stage nearby-stage">
      <div className="nearby-layout">
        <section className="compass-panel">
          <div className="compass-core">
            <p className="micro-label">Drift finder</p>
            <h1>Let your browser point you to the next shoreline.</h1>
            <p className="lead-text">
              This page changes the layout completely. Instead of a general dashboard, it treats
              geolocation as the center of the story and pulls the nearest beaches around it.
            </p>
            <button className="sea-button" type="button" onClick={onLocateMe}>
              Use my location
            </button>
            {userLocation ? (
              <span className="coordinate-chip">
                {formatNumber(userLocation.latitude)}, {formatNumber(userLocation.longitude)}
              </span>
            ) : null}
          </div>
        </section>

        <section className="dock-panel panel">
          <div className="dock-head">
            <div>
              <p className="micro-label">Closest beaches</p>
              <h1>Nearby shoreline picks</h1>
            </div>
            <button className="sand-button" type="button" onClick={() => navigate('/atlas')}>
              Browse atlas
            </button>
          </div>

          {locationError ? <p className="inline-note error">{locationError}</p> : null}

          {isLoadingNearest ? (
            <div className="empty-card">
              <p className="muted-copy">Scanning the nearest shoreline...</p>
            </div>
          ) : nearestBeaches.length === 0 ? (
            <div className="empty-card">
              <p className="muted-copy">Allow location access and the closest beaches will appear here.</p>
            </div>
          ) : (
            <div className="nearest-stack">
              {nearestBeaches.map((beach) => (
                <button
                  key={`${beach.id}-${beach.distance_km}`}
                  className="nearby-card"
                  type="button"
                  onClick={() => handleSelectNearby(beach.id)}
                >
                  <div>
                    <h3>{beach.name}</h3>
                    <p>{beach.city}, {beach.state}</p>
                  </div>
                  <div className="nearby-card-meta">
                    <strong>{beach.distance_km} km</strong>
                    <span>{formatLabel(beach.water_quality)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="packing-strip">
        <article className="packing-card">
          <h3>Check the wind</h3>
          <p>Use the forecast deck after choosing a nearby beach to confirm calmer conditions.</p>
        </article>
        <article className="packing-card">
          <h3>Travel light</h3>
          <p>Pick the closest shoreline when you want a quick sunset trip instead of a full beach day.</p>
        </article>
        <article className="packing-card">
          <h3>Leave it cleaner</h3>
          <p>Pack out waste and keep the beach better than you found it.</p>
        </article>
      </div>
    </section>
  );
}

export default NearbyPage;
