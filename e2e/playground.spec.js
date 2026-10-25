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
  await page.mouse.move(0, 0); // hover also brightens brackets; measure the pressed rule alone
  await expect(group.getByRole('button', { name: '7d' })).toHaveAttribute('aria-pressed', 'true');
  await expect(group.getByRole('button', { name: '24h' })).toHaveAttribute('aria-pressed', 'false');
  const dim = await group.getByRole('button', { name: '24h' }).evaluate((el) => getComputedStyle(el).color);
  const bright = await group
    .getByRole('button', { name: '7d' })
    .evaluate((el) => getComputedStyle(el, '::before').color);
  expect(dim).toBe('rgb(138, 138, 138)');
  expect(bright).toBe('rgb(230, 230, 230)');
  const line = await group
    .getByRole('button', { name: '7d' })
    .locator('.sg-btn-label')
    .evaluate((el) => getComputedStyle(el).textDecorationLine);
  expect(line).toBe('underline');
});

const pages = [
  ['not found page', 'nothing here.'],
  ['expired page', 'this link has expired.'],
  ['locked page', 'this link is locked.'],
];

test('each framed page renders its main landmark', async ({ page }) => {
  await page.goto('/');
  for (const [title, heading] of pages)
    await expect(page.frameLocator(`iframe[title="${title}"]`).getByRole('main', { name: heading })).toBeVisible();
});

test('each page passes axe as a standalone document', async ({ page }) => {
  await page.goto('/');
  const docs = [];
  for (const [title] of pages)
    docs.push(
      await page
        .frameLocator(`iframe[title="${title}"]`)
        .locator('html')
        .evaluate((el) => '<!doctype html>' + el.outerHTML),
    );
  for (const html of docs) {
    await page.setContent(html);
    expect((await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id)).toEqual([]);
  }
});
