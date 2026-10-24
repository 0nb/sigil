import { reducedMotion } from '../../src/lib/util/motion.js';

test('reads prefers-reduced-motion', () => {
  globalThis.__reduceMotion = true;
  expect(reducedMotion()).toBe(true);
  globalThis.__reduceMotion = false;
  expect(reducedMotion()).toBe(false);
});
