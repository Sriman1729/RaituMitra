const CACHE_DURATION = 36 * 60 * 60 * 1000;

const WEATHER_CACHE_KEY = (lat, lon) =>
  `rm.weather.${lat.toFixed(2)}_${lon.toFixed(2)}`;

export function saveWeatherCache(lat, lon, payload) {
  const now = Date.now();

  localStorage.setItem(
    WEATHER_CACHE_KEY(lat, lon),
    JSON.stringify({
      data: payload,
      fetchedAt: now,
      expiresAt: now + CACHE_DURATION,
    })
  );
}

export function getWeatherCache(lat, lon) {
  const raw = localStorage.getItem(WEATHER_CACHE_KEY(lat, lon));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(WEATHER_CACHE_KEY(lat, lon));
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(WEATHER_CACHE_KEY(lat, lon));
    return null;
  }
}