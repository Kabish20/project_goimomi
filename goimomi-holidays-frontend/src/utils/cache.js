const cache = new Map();

/**
 * simpleCache: Fetches data from a function and caches it.
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function that returns a promise
 * @param {number} ttl - Time to live in ms (default 5 mins)
 */
export const simpleCache = async (key, fetchFn, ttl = 300000) => {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: now });
  return data;
};

export const clearCache = (key) => {
  if (key) cache.delete(key);
  else cache.clear();
};
