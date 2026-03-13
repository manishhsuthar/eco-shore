import { countByLabel, formatLabel, getTopStates } from '../lib/ecoshore';

function BarPanel({ items, tone, title }) {
  const maxValue = Math.max(...items.map((item) => item.total), 1);

  return (
    <article className="metric-panel panel">
      <p className="micro-label">{title}</p>
      <h2>{title} snapshot</h2>

      <div className="bar-list">
        {items.map((item) => (
          <div key={item.label} className="bar-row">
            <span>{item.label}</span>
            <div className="bar-track">
              <div
                className={`bar-fill ${tone}`}
                style={{ width: `${(item.total / maxValue) * 100}%` }}
              />
            </div>
            <strong>{item.total}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function PulsePage({ beaches, beachesError, isLoadingBeaches, navigate, selectedBeach }) {
  const waterCounts = countByLabel(beaches, 'water_quality');
  const crowdCounts = countByLabel(beaches, 'crowd_density');
  const stateCounts = getTopStates(beaches);

  return (
    <section className="page-stage pulse-stage">
      <section className="pulse-hero panel">
        <div>
          <p className="micro-label">Tide pulse</p>
          <h1>Turn beach records into a coastal bulletin.</h1>
          <p className="lead-text">
            This page is deliberately quieter and more analytical. Instead of listing beaches again, it
            reads your backend like a status board for water quality, crowd patterns, and regional spread.
          </p>
          <div className="button-row">
            <button className="sea-button" type="button" onClick={() => navigate('/atlas')}>
              Back to atlas
            </button>
            <button className="sand-button" type="button" onClick={() => navigate('/conditions')}>
              Open forecast deck
            </button>
          </div>
        </div>

        <div className="pulse-number">
          {beaches.length}
          <span>records in motion</span>
        </div>
      </section>

      {beachesError ? <p className="inline-note error">{beachesError}</p> : null}

      {isLoadingBeaches ? (
        <div className="empty-card">
          <p className="muted-copy">Loading the tide pulse...</p>
        </div>
      ) : (
        <div className="pulse-grid">
          <BarPanel items={waterCounts.length ? waterCounts : [{ label: 'Unknown', total: 0 }]} title="Water quality" tone="water" />
          <BarPanel items={crowdCounts.length ? crowdCounts : [{ label: 'Unknown', total: 0 }]} title="Crowd density" tone="crowd" />

          <aside className="story-panel panel">
            <p className="micro-label">Coast notes</p>
            <h2>{selectedBeach?.name || 'Selected shoreline'}</h2>
            <p className="muted-copy">
              {selectedBeach
                ? `${selectedBeach.city}, ${selectedBeach.state} is currently your focused coastline.`
                : 'Pick a beach in the atlas or forecast deck to pin it here.'}
            </p>

            <div className="state-chip-grid">
              {stateCounts.length > 0 ? (
                stateCounts.map((item) => (
                  <article key={item.label} className="state-chip">
                    <span>{formatLabel(item.label)}</span>
                    <strong>{item.total} beaches</strong>
                  </article>
                ))
              ) : (
                <article className="state-chip">
                  <span>No state data</span>
                  <strong>0 beaches</strong>
                </article>
              )}
            </div>

            <div className="note-stack">
              <article className="note-card">
                <strong>Keep the coast quieter</strong>
                <p>Lower crowd beaches can be a better fit for slow mornings and cleanup drives.</p>
              </article>
              <article className="note-card">
                <strong>Watch the water tone</strong>
                <p>Use water quality labels alongside weather before making the final beach choice.</p>
              </article>
              <article className="note-card">
                <strong>Pair pages together</strong>
                <p>Atlas for discovery, forecast for conditions, nearby for spontaneity, pulse for context.</p>
              </article>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default PulsePage;
