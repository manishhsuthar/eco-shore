import { buildMapUrl, formatLabel } from '../lib/ecoshore';

function AtlasPage({
  beaches,
  beachesError,
  filteredBeaches,
  isLoadingBeaches,
  navigate,
  onSearchChange,
  searchTerm,
  selectBeach,
  selectedBeach,
  selectedBeachId,
}) {
  const activeBeach = selectedBeach || filteredBeaches[0] || beaches[0] || null;
  const statesCovered = new Set(beaches.map((beach) => beach.state).filter(Boolean)).size;

  return (
    <section className="page-stage atlas-stage">
      <aside className="atlas-rail panel">
        <p className="micro-label">Beach atlas</p>
        <h1>Browse the coast like a travel wall.</h1>
        <p className="lead-text">
          This page breaks the old one-panel layout into a searchable collection space. Use it like a
          postcard board and then jump into the forecast deck when one coastline catches your eye.
        </p>

        <label className="search-shell" htmlFor="atlas-search">
          <span>Search shoreline</span>
          <input
            id="atlas-search"
            placeholder="Beach, city, or state"
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <div className="atlas-stat-grid">
          <article>
            <span>Total beaches</span>
            <strong>{beaches.length}</strong>
          </article>
          <article>
            <span>States covered</span>
            <strong>{statesCovered}</strong>
          </article>
        </div>

        <div className="atlas-spotlight">
          <p className="micro-label">Spotlight pick</p>
          <h2>{activeBeach?.name || 'No beach selected yet'}</h2>
          <p className="muted-copy">
            {activeBeach
              ? `${activeBeach.city}, ${activeBeach.state}`
              : 'Once the API responds, the spotlight card will pin a featured coastline here.'}
          </p>
          <strong>Water: {formatLabel(activeBeach?.water_quality)}</strong>
          <strong>Crowd: {formatLabel(activeBeach?.crowd_density)}</strong>

          <div className="button-row">
            <button className="sea-button" type="button" onClick={() => navigate('/conditions')}>
              Open forecast deck
            </button>
            {activeBeach ? (
              <a
                className="link-pill"
                href={buildMapUrl(activeBeach.latitude, activeBeach.longitude)}
                rel="noreferrer"
                target="_blank"
              >
                Open maps
              </a>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="atlas-board">
        {beachesError ? <p className="inline-note error">{beachesError}</p> : null}

        {isLoadingBeaches ? (
          <div className="empty-card">
            <p className="muted-copy">Loading the beach atlas...</p>
          </div>
        ) : filteredBeaches.length === 0 ? (
          <div className="empty-card">
            <p className="muted-copy">No beaches match that search yet.</p>
          </div>
        ) : (
          filteredBeaches.map((beach, index) => (
            <button
              key={beach.id}
              className={`atlas-card panel ${selectedBeachId === beach.id ? 'active' : ''}`}
              type="button"
              onClick={() => selectBeach(beach.id)}
            >
              <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
              <h2>{beach.name}</h2>
              <p>{beach.city}, {beach.state}</p>

              <div className="chip-row">
                <span className="status-chip water">Water {formatLabel(beach.water_quality)}</span>
                <span className="status-chip crowd">Crowd {formatLabel(beach.crowd_density)}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

export default AtlasPage;
