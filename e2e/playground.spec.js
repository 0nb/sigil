import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('every section renders', async ({ page }) => {
  await page.goto('/');
  for (const h of ['tokens', 'terminal rules', 'copy rules', 'components', 'pages', 'assets'])
    await expect(page.getByRole('heading', { name: h, exact: true })).toBeVisible();
});

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  const [sw, w] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(sw).toBeLessThanOrEqual(w);
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
