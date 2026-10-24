import { linear, ticks, pathFrom } from '../../src/lib/util/scale.js';

test('linear maps and handles a flat domain', () => {
  expect(linear([0, 10], [0, 100])(5)).toBe(50);
  expect(linear([3, 3], [0, 100])(3)).toBe(50);
});

test('ticks are nice', () => {
  expect(ticks(0, 1284, 3)).toEqual([0, 500, 1000, 1500]);
  expect(ticks(0, 9, 3)).toEqual([0, 5, 10]);
  expect(ticks(7, 7, 3)).toEqual([7]);
});

test('pathFrom', () => {
  expect(pathFrom([])).toBe('');
  expect(pathFrom([{ x: 0, y: 1 }, { x: 2.556, y: 3 }])).toBe('M0 1 L2.56 3');
});
