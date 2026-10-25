import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('every section renders', async ({ page }) => {
  await page.goto('/');
  for (const h of ['tokens', 'terminal rules', 'copy rules', 'components', 'pages', 'assets'])
    await expect(page.getByRole('heading', { name: h, exact: true })).toBeVisible();
});

// innerWidth grows with overflowing content on mobile emulation; clientWidth stays the viewport width
const overflows = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  expect(await overflows(page)).toBe(false);
});

test('the overflow check catches a too-wide element', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const d = document.createElement('div');
    d.style.width = '2000px';
    d.style.height = '1px';
    document.body.append(d);
  });
  expect(await overflows(page)).toBe(true);
});

test('prompt takes input and confirm answers by key', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('destination url');
  await input.scrollIntoViewIfNeeded();
  await input.fill('fld.0nb.dev');
  await expect(input).toHaveValue('fld.0nb.dev');
  const no = page.getByRole('button', { name: 'n', exact: true });
  await no.focus();
  await page.keyboard.press('y');
  await expect(page.getByText('answered y.')).toBeVisible();
});

test('spinner is static under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('status').filter({ hasText: 'loading' })).toContainText('…');
});

test('no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});

test('range selector shows the pressed choice', async ({ page }) => {
  await page.goto('/');
  const group = page.getByRole('group', { name: 'range' });
  await group.scrollIntoViewIfNeeded();
  await group.getByRole('button', { name: '7d' }).click();
  await expect(group.getByRole('button', { name: '7d' })).toHaveAttribute('aria-pressed', 'true');
  await expect(group.getByRole('button', { name: '24h' })).toHaveAttribute('aria-pressed', 'false');
  const dim = await group.getByRole('button', { name: '24h' }).evaluate((el) => getComputedStyle(el).color);
  const bright = await group
    .getByRole('button', { name: '7d' })
    .evaluate((el) => getComputedStyle(el, '::before').color);
  expect(dim).toBe('rgb(138, 138, 138)');
  expect(bright).toBe('rgb(230, 230, 230)');
});
