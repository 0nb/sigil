import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import Horizon from '../../src/lib/components/Horizon.svelte';
import { mount } from '../../src/lib/horizon/horizon.js';

afterEach(() => {
  globalThis.__reduceMotion = false;
});

test('mount returns null under reduced motion', () => {
  globalThis.__reduceMotion = true;
  expect(mount(document.createElement('canvas'))).toBeNull();
});

test('mount returns null without webgl2', () => {
  const canvas = document.createElement('canvas');
  canvas.getContext = () => null;
  expect(mount(canvas)).toBeNull();
});

test('Horizon keeps the static sigil when webgl is unavailable', async () => {
  HTMLCanvasElement.prototype.getContext = () => null;
  const { container } = render(Horizon);
  await tick();
  await new Promise((r) => setTimeout(r, 20));
  expect(container.querySelector('svg circle')).not.toBeNull();
});

test('shader is the 0nb.dev shader', async () => {
  const { FS } = await import('../../src/lib/horizon/shader.js');
  expect(FS).toContain('float rs = .085 * k, rp = .0885 * k, E = .15 * k');
});
