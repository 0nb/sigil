export function mount(
  canvas: HTMLCanvasElement,
  opts?: { onready?: () => void; onlost?: () => void },
): { destroy(): void } | null;
