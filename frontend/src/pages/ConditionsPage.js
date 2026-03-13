import {
  buildMapUrl,
  formatLabel,
  formatObservationTime,
  getWeatherDescription,
} from '../lib/ecoshore';

function ConditionsPage({
  beaches,
  isLoadingWeather,
  navigate,
  selectBeach,
  selectedBeach,
  selectedBeachId,
  weather,
  weatherError,
}) {
  const weatherDetails = weather?.current_weather;

  return (
    <section className="page-stage conditions-stage">
      <div className="conditions-top">
        <section className="weather-dial panel">
          <div className="dial-core">
            <p className="micro-label">Forecast deck</p>
            <span className="temperature-mark">
              {weatherDetails ? `${Math.round(weatherDetails.temperature)}°C` : '--'}
            </span>
            <p className="weather-word">{getWeatherDescription(weather)}</p>
            <p className="muted-copy">
              {isLoadingWeather
                ? 'Refreshing live conditions...'
                : formatObservationTime(weatherDetails?.time)}
            </p>
          </div>
        </section>

        <section className="conditions-panel panel">
          <p className="micro-label">Selected coast</p>
          <h1>{selectedBeach?.name || 'Choose a coastline from the strip below'}</h1>
          <p className="lead-text">
            This page turns the selected beach into its own live card room. Weather, coordinates, crowd
            cues, and quick actions all sit here without the noise of the full collection.
          </p>

          {weatherError ? <p className="inline-note error">{weatherError}</p> : null}

          <div className="conditions-grid">
            <article>
              <span>Location</span>
              <strong>
                {selectedBeach ? `${selectedBeach.city}, ${selectedBeach.state}` : 'Unavailable'}
              </strong>
            </article>
            <article>
              <span>Water quality</span>
              <strong>{formatLabel(selectedBeach?.water_quality)}</strong>
            </article>
            <article>
              <span>Crowd density</span>
              <strong>{formatLabel(selectedBeach?.crowd_density)}</strong>
            </article>
            <article>
              <span>Wind speed</span>
              <strong>{weatherDetails ? `${weatherDetails.windspeed} km/h` : 'Unavailable'}</strong>
            </article>
            <article>
              <span>Wind direction</span>
              <strong>{weatherDetails ? `${weatherDetails.winddirection}°` : 'Unavailable'}</strong>
            </article>
            <article>
              <span>Light window</span>
              <strong>
                {weatherDetails
                  ? weatherDetails.is_day
                    ? 'Daylight window'
                    : 'After sunset'
                  : 'Unavailable'}
              </strong>
            </article>
          </div>

          <div className="button-row">
            <button className="sand-button" type="button" onClick={() => navigate('/atlas')}>
              Switch in atlas
            </button>
            <button className="sea-button" type="button" onClick={() => navigate('/nearby')}>
              Open nearby finder
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
        </section>
      </div>

      <section className="chooser-strip panel">
        <div className="chooser-head">
          <div>
            <p className="micro-label">Quick swap</p>
            <p className="muted-copy">Flip to a different shoreline without leaving the forecast deck.</p>
          </div>
          <button className="link-pill" type="button" onClick={() => navigate('/pulse')}>
            View tide pulse
          </button>
        </div>

        <div className="chooser-scroll">
          {beaches.map((beach) => (
            <button
              key={beach.id}
              className={`chooser-pill ${selectedBeachId === beach.id ? 'active' : ''}`}
              type="button"
              onClick={() => selectBeach(beach.id)}
            >
              <h3>{beach.name}</h3>
              <p>{beach.city}, {beach.state}</p>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

export default ConditionsPage;
