import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('every section renders', async ({ page }) => {
  await page.goto('/');
  for (const h of ['tokens', 'look rules', 'copy rules', 'components', 'dashboard', 'pages', 'assets'])
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

test('confirm starts on keep, and enter keeps', async ({ page }) => {
  await page.goto('/');
  const keep = page.getByRole('button', { name: 'keep', exact: true });
  await expect(keep).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('answered keep.')).toBeVisible();
});

test('field takes input and shows focus on its box', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('paste a long link');
  await input.scrollIntoViewIfNeeded();
  await input.fill('https://0nb.dev');
  await expect(input).toHaveValue('https://0nb.dev');
  const border = await input.evaluate((el) => getComputedStyle(/** @type {HTMLElement} */ (el.parentElement)).borderColor);
  expect(border).toBe('rgb(230, 230, 230)');
});

test('keyboard focus on a button is outlined', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('paste a long link').focus();
  await page.keyboard.press('Tab');
  const fold = page.getByRole('button', { name: 'fold it' });
  await expect(fold).toBeFocused();
  expect(await fold.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
});

test('a disabled primary button looks disabled', async ({ page }) => {
  await page.goto('/');
  const b = page.getByRole('button', { name: 'sending' });
  await b.hover({ force: true });
  expect(await b.evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el).color])).toEqual([
    'rgba(0, 0, 0, 0)',
    'rgb(138, 138, 138)',
  ]);
});

test('an invalid field still shows focus', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('bad link');
  const box = (/** @type {Element} */ el) => getComputedStyle(/** @type {HTMLElement} */ (el.parentElement)).outlineStyle;
  expect(await input.evaluate(box)).toBe('none');
  await input.focus();
  expect(await input.evaluate(box)).toBe('solid');
});

test('the grid sits behind the content', async ({ page }) => {
  await page.goto('/');
  const z = await page.locator('main[data-grid]').evaluate((el) => getComputedStyle(el, '::before').zIndex);
  expect(z).toBe('-1');
});

test('buttons carry no bracket decorations', async ({ page }) => {
  await page.goto('/');
  const content = await page
    .locator('.sg-btn')
    .evaluateAll((els) => els.flatMap((el) => [getComputedStyle(el, '::before').content, getComputedStyle(el, '::after').content]));
  expect([...new Set(content)]).toEqual(['none']);
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
  await page.mouse.move(0, 0);
  await expect(group.getByRole('button', { name: '7d' })).toHaveAttribute('aria-pressed', 'true');
  await expect(group.getByRole('button', { name: '24h' })).toHaveAttribute('aria-pressed', 'false');
  const look = (name) =>
    group.getByRole('button', { name }).evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el).color]);
  expect(await look('7d')).toEqual(['rgb(230, 230, 230)', 'rgb(0, 0, 0)']);
  expect(await look('24h')).toEqual(['rgba(0, 0, 0, 0)', 'rgb(230, 230, 230)']);
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
