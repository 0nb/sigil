import '@testing-library/jest-dom/vitest';

globalThis.__reduceMotion = false;

window.matchMedia = (query) => ({
  get matches() {
    return query.includes('prefers-reduced-motion') && globalThis.__reduceMotion === true;
  },
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() {
    return false;
  },
});
